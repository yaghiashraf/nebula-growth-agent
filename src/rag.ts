import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { logger, componentLogger } from '../lib/logger';
import { config, aiModels } from '../lib/config';
import { db } from '../lib/db';
import type { RAGContext, EmbeddingVector, AIOpportunity } from '../types';

export class RAGEngine {
  private openai: OpenAI;
  private anthropic: Anthropic;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.OPENAI_API_KEY,
    });

    this.anthropic = new Anthropic({
      apiKey: config.CLAUDE_API_KEY,
    });
  }

  async createEmbeddings(texts: string[]): Promise<EmbeddingVector[]> {
    try {
      componentLogger.ai.request('OpenAI', texts.join(' ').length);

      const response = await this.openai.embeddings.create({
        model: aiModels.openai.embedding,
        input: texts,
        encoding_format: 'float',
      });

      componentLogger.ai.response('OpenAI', response.usage?.total_tokens || 0);

      return response.data.map((embedding, index) => ({
        content: texts[index],
        vector: embedding.embedding,
        metadata: {
          model: aiModels.openai.embedding,
          created_at: new Date().toISOString(),
        },
      }));
    } catch (error) {
      componentLogger.ai.error('OpenAI', error as Error);
      throw error;
    }
  }

  async storeEmbeddings(crawlId: string, embeddings: EmbeddingVector[]): Promise<void> {
    try {
      const embeddingRecords = embeddings.map(embedding => ({
        crawlId,
        content: embedding.content,
        vector: JSON.stringify(embedding.vector),
      }));

      await db.client.embedding.createMany({
        data: embeddingRecords,
      });

      logger.info('Stored embeddings successfully', { 
        crawlId, 
        count: embeddings.length 
      });
    } catch (error) {
      logger.error('Failed to store embeddings', { error, crawlId });
      throw error;
    }
  }

  async findSimilarContent(
    query: string,
    siteId: string,
    limit: number = 5
  ): Promise<Array<{
    content: string;
    similarity: number;
    source: string;
    url: string;
  }>> {
    try {
      // Create embedding for query
      const queryEmbeddings = await this.createEmbeddings([query]);
      const queryVector = queryEmbeddings[0].vector;

      // For SQLite, we'll use a simplified similarity search
      // In production, use proper vector database like Pinecone or Weaviate
      const results = await db.findSimilarContent(queryVector, siteId, limit);

      return results;
    } catch (error) {
      logger.error('Failed to find similar content', { error, query, siteId });
      return [];
    }
  }

  async buildRAGContext(
    query: string,
    siteId: string,
    includeCompetitors: boolean = true
  ): Promise<RAGContext> {
    try {
      const [similarContent, competitorData] = await Promise.all([
        this.findSimilarContent(query, siteId),
        includeCompetitors ? this.getCompetitorContext(siteId) : Promise.resolve([]),
      ]);

      return {
        query,
        similarContent,
        competitorData,
      };
    } catch (error) {
      logger.error('Failed to build RAG context', { error, query, siteId });
      return {
        query,
        similarContent: [],
        competitorData: [],
      };
    }
  }

  private async getCompetitorContext(siteId: string): Promise<Array<{
    url: string;
    content: string;
    relevance: number;
  }>> {
    try {
      const competitors = await db.getCompetitorData(siteId);
      
      return competitors.map(competitor => ({
        url: competitor.url,
        content: competitor.crawls[0]?.content || '',
        relevance: Math.random(), // Simplified relevance scoring
      })).filter(c => c.content.length > 0);
    } catch (error) {
      logger.error('Failed to get competitor context', { error, siteId });
      return [];
    }
  }

  async generateOpportunities(
    ragContext: RAGContext,
    siteId: string,
    ga4Insights?: any
  ): Promise<AIOpportunity[]> {
    try {
      const prompt = this.buildOpportunityPrompt(ragContext, ga4Insights);
      
      componentLogger.ai.request('Claude', prompt.length);

      const response = await this.anthropic.messages.create({
        model: aiModels.claude.chat,
        max_tokens: aiModels.claude.maxTokens,
        temperature: aiModels.claude.temperature,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      componentLogger.ai.response('Claude', response.usage?.input_tokens || 0);

      const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
      const opportunities = this.parseOpportunities(responseText);

      return opportunities;
    } catch (error) {
      componentLogger.ai.error('Claude', error as Error);
      return [];
    }
  }

  private buildOpportunityPrompt(ragContext: RAGContext, ga4Insights?: any): string {
    let prompt = `# Growth Opportunity Analysis

## Current Site Analysis
Query: ${ragContext.query}

### Similar Content Analysis:
${ragContext.similarContent.map(content => `
- URL: ${content.url}
- Content: ${content.content.substring(0, 200)}...
- Relevance: ${(content.similarity * 100).toFixed(1)}%
`).join('\n')}

`;

    if (ragContext.competitorData && ragContext.competitorData.length > 0) {
      prompt += `### Competitor Analysis:
${ragContext.competitorData.map(comp => `
- URL: ${comp.url}
- Content: ${comp.content.substring(0, 200)}...
- Relevance: ${(comp.relevance * 100).toFixed(1)}%
`).join('\n')}

`;
    }

    if (ga4Insights) {
      prompt += `### Analytics Insights:
${JSON.stringify(ga4Insights, null, 2)}

`;
    }

    prompt += `## Task
Based on the analysis above, identify 3-5 high-impact growth opportunities. For each opportunity, provide:

1. **Type**: One of [COPY_TWEAK, SEO_OPTIMIZATION, PERFORMANCE_FIX, UX_IMPROVEMENT, SGE_ANSWER_BLOCK, FAQ_SCHEMA, IMAGE_OPTIMIZATION, LOYALTY_PASS, COMPETITOR_RESPONSE]
2. **Title**: Clear, actionable title
3. **Description**: Detailed explanation of the opportunity
4. **Priority**: HIGH, MEDIUM, or LOW
5. **Revenue Delta**: Estimated monthly revenue impact (numeric value)
6. **Target URL**: Specific page to modify (if applicable)
7. **Current Content**: Existing content to be changed
8. **Suggested Content**: Proposed replacement content
9. **Reasoning**: Why this opportunity will drive growth
10. **Confidence**: Score from 0-1 indicating confidence in the opportunity

Return the response as a JSON array of opportunities. Focus on data-driven recommendations that address specific issues found in the analysis.`;

    return prompt;
  }

  private parseOpportunities(responseText: string): AIOpportunity[] {
    try {
      // Extract JSON from response
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        logger.warn('No JSON found in opportunity response');
        return [];
      }

      const opportunities = JSON.parse(jsonMatch[0]);
      
      return opportunities.map((opp: any) => ({
        id: `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: opp.title || 'Untitled Opportunity',
        description: opp.description || '',
        type: opp.type || 'COPY_TWEAK',
        priority: opp.priority || 'MEDIUM',
        revenueDelta: typeof opp.revenueDelta === 'number' ? opp.revenueDelta : 0,
        targetUrl: opp.targetUrl,
        currentContent: opp.currentContent,
        suggestedContent: opp.suggestedContent,
        reasoning: opp.reasoning,
        confidence: typeof opp.confidence === 'number' ? opp.confidence : 0.5,
        patchData: opp.patchData ? {
          type: opp.patchData.type || 'content',
          filePath: opp.patchData.filePath || '',
          oldContent: opp.patchData.oldContent,
          newContent: opp.patchData.newContent,
          metadata: opp.patchData.metadata,
        } : undefined,
      }));
    } catch (error) {
      logger.error('Failed to parse opportunities', { error, responseText });
      return [];
    }
  }

  async generateSGEAnswerBlock(
    question: string,
    context: string,
    targetKeywords: string[]
  ): Promise<string> {
    try {
      const prompt = `# SGE Answer Block Generation

## Question: ${question}

## Context:
${context}

## Target Keywords:
${targetKeywords.join(', ')}

## Task:
Generate a comprehensive, SEO-optimized answer block that would be suitable for Google's Search Generative Experience (SGE). The answer should:

1. Directly answer the question in the first paragraph
2. Include relevant keywords naturally
3. Be well-structured with clear sections
4. Include specific details and examples
5. Be approximately 150-300 words
6. Use proper HTML formatting

Return only the HTML content for the answer block.`;

      const response = await this.anthropic.messages.create({
        model: aiModels.claude.chat,
        max_tokens: 1000,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }],
      });

      return response.content[0].type === 'text' ? response.content[0].text : '';
    } catch (error) {
      logger.error('Failed to generate SGE answer block', { error });
      return '';
    }
  }

  async generateFAQSchema(
    questions: string[],
    context: string
  ): Promise<object> {
    try {
      const prompt = `# FAQ Schema Generation

## Questions:
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

## Context:
${context}

## Task:
Generate a JSON-LD FAQ schema that includes answers to all the questions above. The schema should follow the official schema.org FAQ format and provide comprehensive, helpful answers based on the context provided.

Return only the JSON-LD schema object.`;

      const response = await this.anthropic.messages.create({
        model: aiModels.claude.chat,
        max_tokens: 2000,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }],
      });

      const responseText = response.content[0].type === 'text' ? response.content[0].text : '{}';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {};
    } catch (error) {
      logger.error('Failed to generate FAQ schema', { error });
      return {};
    }
  }

  async processContent(
    content: string,
    task: 'improve' | 'optimize' | 'rewrite',
    context?: string
  ): Promise<string> {
    try {
      const prompt = `# Content Processing Task: ${task.toUpperCase()}

## Original Content:
${content}

${context ? `## Context:\n${context}\n` : ''}

## Task:
${task === 'improve' ? 'Improve the content for better clarity, engagement, and SEO performance.' : ''}
${task === 'optimize' ? 'Optimize the content for search engines while maintaining readability.' : ''}
${task === 'rewrite' ? 'Rewrite the content to be more compelling and conversion-focused.' : ''}

Return only the processed content without any additional commentary.`;

      const response = await this.anthropic.messages.create({
        model: aiModels.claude.chat,
        max_tokens: 2000,
        temperature: 0.4,
        messages: [{ role: 'user', content: prompt }],
      });

      return response.content[0].type === 'text' ? response.content[0].text : content;
    } catch (error) {
      logger.error('Failed to process content', { error, task });
      return content;
    }
  }
}

export default RAGEngine;