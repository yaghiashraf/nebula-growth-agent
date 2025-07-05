import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import RAGEngine from '../../src/rag';
import { db } from '../../lib/db';

// Mock console methods
global.mockConsole();

// Mock database
jest.mock('../../lib/db', () => ({
  db: {
    findSimilarContent: jest.fn(),
    getCompetitorData: jest.fn(),
    createOpportunityWithEmbeddings: jest.fn(),
  },
}));

describe('RAGEngine', () => {
  let ragEngine: RAGEngine;

  beforeEach(() => {
    ragEngine = new RAGEngine();
    jest.clearAllMocks();
  });

  describe('createEmbeddings', () => {
    it('should create embeddings for text inputs', async () => {
      const texts = ['Hello world', 'This is a test'];
      const embeddings = await ragEngine.createEmbeddings(texts);

      expect(embeddings).toHaveLength(2);
      expect(embeddings[0]).toHaveProperty('content', 'Hello world');
      expect(embeddings[0]).toHaveProperty('vector');
      expect(embeddings[0]).toHaveProperty('metadata');
      expect(Array.isArray(embeddings[0].vector)).toBe(true);
      expect(embeddings[0].vector).toHaveLength(1536); // OpenAI embedding size
    });

    it('should handle empty input gracefully', async () => {
      const embeddings = await ragEngine.createEmbeddings([]);
      expect(embeddings).toHaveLength(0);
    });

    it('should handle API errors', async () => {
      // Mock OpenAI to throw an error
      const openaiMock = require('openai');
      openaiMock.default.mockImplementation(() => ({
        embeddings: {
          create: jest.fn().mockRejectedValue(new Error('API Error')),
        },
      }));

      const ragEngine = new RAGEngine();
      await expect(ragEngine.createEmbeddings(['test'])).rejects.toThrow('API Error');
    });
  });

  describe('findSimilarContent', () => {
    it('should find similar content using vector search', async () => {
      const mockResults = [
        {
          content: 'Similar content 1',
          similarity: 0.95,
          source: 'site',
          url: 'https://example.com/page1',
        },
        {
          content: 'Similar content 2',
          similarity: 0.87,
          source: 'site',
          url: 'https://example.com/page2',
        },
      ];

      (db.findSimilarContent as jest.Mock).mockResolvedValue(mockResults);

      const results = await ragEngine.findSimilarContent('test query', 'site-id', 5);

      expect(results).toEqual(mockResults);
      expect(db.findSimilarContent).toHaveBeenCalledWith(
        expect.any(Array), // vector
        'site-id',
        5
      );
    });

    it('should handle database errors gracefully', async () => {
      (db.findSimilarContent as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const results = await ragEngine.findSimilarContent('test query', 'site-id');
      expect(results).toEqual([]);
    });
  });

  describe('buildRAGContext', () => {
    it('should build comprehensive RAG context', async () => {
      const mockSimilarContent = [
        {
          content: 'Content 1',
          similarity: 0.9,
          source: 'site',
          url: 'https://example.com/1',
        },
      ];

      const mockCompetitorData = [
        {
          url: 'https://competitor.com',
          content: 'Competitor content',
          relevance: 0.8,
        },
      ];

      (db.findSimilarContent as jest.Mock).mockResolvedValue(mockSimilarContent);
      (db.getCompetitorData as jest.Mock).mockResolvedValue([
        {
          url: 'https://competitor.com',
          crawls: [{ content: 'Competitor content' }],
        },
      ]);

      const context = await ragEngine.buildRAGContext('test query', 'site-id', true);

      expect(context).toEqual({
        query: 'test query',
        similarContent: mockSimilarContent,
        competitorData: expect.arrayContaining([
          expect.objectContaining({
            url: 'https://competitor.com',
            content: 'Competitor content',
          }),
        ]),
      });
    });

    it('should work without competitor data', async () => {
      const mockSimilarContent = [
        {
          content: 'Content 1',
          similarity: 0.9,
          source: 'site',
          url: 'https://example.com/1',
        },
      ];

      (db.findSimilarContent as jest.Mock).mockResolvedValue(mockSimilarContent);

      const context = await ragEngine.buildRAGContext('test query', 'site-id', false);

      expect(context).toEqual({
        query: 'test query',
        similarContent: mockSimilarContent,
        competitorData: [],
      });
    });
  });

  describe('generateOpportunities', () => {
    it('should generate AI opportunities from RAG context', async () => {
      const mockContext = {
        query: 'optimization opportunities',
        similarContent: [
          {
            content: 'Page about products',
            similarity: 0.9,
            source: 'site',
            url: 'https://example.com/products',
          },
        ],
        competitorData: [
          {
            url: 'https://competitor.com',
            content: 'Better pricing display',
            relevance: 0.8,
          },
        ],
      };

      const opportunities = await ragEngine.generateOpportunities(
        mockContext,
        'site-id'
      );

      expect(Array.isArray(opportunities)).toBe(true);
      if (opportunities.length > 0) {
        expect(opportunities[0]).toHaveProperty('id');
        expect(opportunities[0]).toHaveProperty('title');
        expect(opportunities[0]).toHaveProperty('description');
        expect(opportunities[0]).toHaveProperty('type');
        expect(opportunities[0]).toHaveProperty('priority');
        expect(opportunities[0]).toHaveProperty('revenueDelta');
        expect(opportunities[0]).toHaveProperty('confidence');
      }
    });

    it('should handle Claude API errors', async () => {
      // Mock Anthropic to throw an error
      const anthropicMock = require('@anthropic-ai/sdk');
      anthropicMock.default.mockImplementation(() => ({
        messages: {
          create: jest.fn().mockRejectedValue(new Error('Claude API Error')),
        },
      }));

      const ragEngine = new RAGEngine();
      const mockContext = {
        query: 'test',
        similarContent: [],
        competitorData: [],
      };

      const opportunities = await ragEngine.generateOpportunities(mockContext, 'site-id');
      expect(opportunities).toEqual([]);
    });
  });

  describe('generateSGEAnswerBlock', () => {
    it('should generate SGE-optimized answer blocks', async () => {
      const question = 'What are the benefits of our product?';
      const context = 'Our product helps users save time and money.';
      const keywords = ['product benefits', 'save time', 'save money'];

      const answerBlock = await ragEngine.generateSGEAnswerBlock(
        question,
        context,
        keywords
      );

      expect(typeof answerBlock).toBe('string');
      expect(answerBlock.length).toBeGreaterThan(0);
    });

    it('should handle API errors gracefully', async () => {
      // Mock Anthropic to throw an error
      const anthropicMock = require('@anthropic-ai/sdk');
      anthropicMock.default.mockImplementation(() => ({
        messages: {
          create: jest.fn().mockRejectedValue(new Error('API Error')),
        },
      }));

      const ragEngine = new RAGEngine();
      const result = await ragEngine.generateSGEAnswerBlock('test', 'context', []);
      expect(result).toBe('');
    });
  });

  describe('generateFAQSchema', () => {
    it('should generate valid FAQ schema', async () => {
      const questions = [
        'How does the product work?',
        'What is the pricing?',
      ];
      const context = 'Product information and pricing details.';

      const schema = await ragEngine.generateFAQSchema(questions, context);

      expect(typeof schema).toBe('object');
      // The actual schema structure would depend on the Claude response
    });
  });

  describe('processContent', () => {
    it('should improve content quality', async () => {
      const originalContent = 'This is basic content.';
      const improvedContent = await ragEngine.processContent(
        originalContent,
        'improve',
        'Make it more engaging'
      );

      expect(typeof improvedContent).toBe('string');
      expect(improvedContent.length).toBeGreaterThan(0);
    });

    it('should optimize content for SEO', async () => {
      const originalContent = 'Basic product description.';
      const optimizedContent = await ragEngine.processContent(
        originalContent,
        'optimize'
      );

      expect(typeof optimizedContent).toBe('string');
      expect(optimizedContent.length).toBeGreaterThan(0);
    });

    it('should rewrite content for conversions', async () => {
      const originalContent = 'Product features list.';
      const rewrittenContent = await ragEngine.processContent(
        originalContent,
        'rewrite'
      );

      expect(typeof rewrittenContent).toBe('string');
      expect(rewrittenContent.length).toBeGreaterThan(0);
    });

    it('should return original content on API errors', async () => {
      // Mock Anthropic to throw an error
      const anthropicMock = require('@anthropic-ai/sdk');
      anthropicMock.default.mockImplementation(() => ({
        messages: {
          create: jest.fn().mockRejectedValue(new Error('API Error')),
        },
      }));

      const ragEngine = new RAGEngine();
      const originalContent = 'Original content';
      const result = await ragEngine.processContent(originalContent, 'improve');
      
      expect(result).toBe(originalContent);
    });
  });
});