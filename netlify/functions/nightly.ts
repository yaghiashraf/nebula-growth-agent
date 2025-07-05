import { Handler } from '@netlify/functions';
import { db } from '../../lib/db';
import { logger, performanceLogger } from '../../lib/logger';
import WebCrawler from '../../src/crawler';
import GA4Client from '../../src/ga4';
import RAGEngine from '../../src/rag';
import GitHubPatcher from '../../src/patcher';
import type { NetlifyFunctionEvent, NetlifyFunctionContext } from '../../types';

export const handler: Handler = async (event: NetlifyFunctionEvent, context: NetlifyFunctionContext) => {
  const endTimer = performanceLogger.start('nightly-cron');
  
  try {
    logger.info('Nightly cron job started');

    // Get all active sites
    const sites = await db.client.site.findMany({
      where: { isActive: true },
      include: {
        user: true,
        competitors: { where: { isActive: true } },
      },
    });

    logger.info('Processing sites', { count: sites.length });

    const results = await Promise.allSettled(
      sites.map(site => processSite(site))
    );

    // Log results
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    logger.info('Nightly cron job completed', { 
      total: sites.length,
      successful,
      failed,
    });

    endTimer();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Nightly cron job completed',
        results: {
          total: sites.length,
          successful,
          failed,
        },
      }),
    };
  } catch (error) {
    endTimer();
    logger.error('Nightly cron job failed', { error });

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Nightly cron job failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

async function processSite(site: any): Promise<void> {
  const siteTimer = performanceLogger.start(`process-site-${site.id}`);
  
  try {
    logger.info('Processing site', { siteId: site.id, url: site.url });

    // Step 1: Crawl main site
    const crawler = new WebCrawler({ maxPages: site.maxPages });
    await crawler.init();

    const crawlResults = await crawler.crawlSite(site.url, {
      maxPages: site.maxPages,
      sameDomain: true,
    });

    // Store crawl results
    const crawlPromises = crawlResults.map(async (result) => {
      const crawl = await db.client.crawl.create({
        data: {
          url: result.url,
          title: result.title,
          content: result.content,
          htmlContent: result.htmlContent,
          metaDescription: result.metaDescription,
          statusCode: result.statusCode,
          loadTime: result.loadTime,
          contentSize: result.contentSize,
          siteId: site.id,
          performanceScore: result.performanceMetrics?.performanceScore,
          accessibilityScore: result.performanceMetrics?.accessibilityScore,
          bestPracticesScore: result.performanceMetrics?.bestPracticesScore,
          seoScore: result.performanceMetrics?.seoScore,
          clsScore: result.performanceMetrics?.clsScore,
          lcpScore: result.performanceMetrics?.lcpScore,
          fcpScore: result.performanceMetrics?.fcpScore,
        },
      });

      // Create embeddings for content
      if (result.content.length > 100) {
        const ragEngine = new RAGEngine();
        const embeddings = await ragEngine.createEmbeddings([result.content]);
        await ragEngine.storeEmbeddings(crawl.id, embeddings);
      }

      return crawl;
    });

    await Promise.all(crawlPromises);

    // Step 2: Crawl competitors
    const competitorPromises = site.competitors.map(async (competitor: any) => {
      try {
        const competitorResults = await crawler.crawlSite(competitor.url, {
          maxPages: 5, // Limit competitor crawling
          sameDomain: true,
        });

        // Store competitor crawl results
        await Promise.all(competitorResults.map(result => 
          db.client.crawl.create({
            data: {
              url: result.url,
              title: result.title,
              content: result.content,
              htmlContent: result.htmlContent,
              metaDescription: result.metaDescription,
              statusCode: result.statusCode,
              loadTime: result.loadTime,
              contentSize: result.contentSize,
              competitorId: competitor.id,
            },
          })
        ));
      } catch (error) {
        logger.error('Failed to crawl competitor', { 
          competitorId: competitor.id, 
          url: competitor.url, 
          error 
        });
      }
    });

    await Promise.all(competitorPromises);
    await crawler.close();

    // Step 3: Get GA4 insights
    let ga4Insights = null;
    if (site.ga4MeasurementId && site.ga4ApiSecret) {
      try {
        const ga4Client = new GA4Client(site.ga4MeasurementId, site.ga4ApiSecret);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        ga4Insights = await ga4Client.generateInsights(
          weekAgo.toISOString().split('T')[0],
          yesterday.toISOString().split('T')[0]
        );
      } catch (error) {
        logger.error('Failed to get GA4 insights', { siteId: site.id, error });
      }
    }

    // Step 4: Generate opportunities using RAG
    const ragEngine = new RAGEngine();
    const ragContext = await ragEngine.buildRAGContext(
      'website optimization opportunities', 
      site.id, 
      true
    );

    const opportunities = await ragEngine.generateOpportunities(
      ragContext,
      site.id,
      ga4Insights
    );

    // Store opportunities
    const opportunityPromises = opportunities.map(opportunity =>
      db.createOpportunityWithEmbeddings(site.id, {
        title: opportunity.title,
        description: opportunity.description,
        type: opportunity.type,
        priority: opportunity.priority,
        revenueDelta: opportunity.revenueDelta,
        targetUrl: opportunity.targetUrl,
        currentContent: opportunity.currentContent,
        suggestedContent: opportunity.suggestedContent,
        patchData: opportunity.patchData ? JSON.stringify(opportunity.patchData) : undefined,
        reasoning: opportunity.reasoning,
        confidence: opportunity.confidence,
      })
    );

    const storedOpportunities = await Promise.all(opportunityPromises);

    // Step 5: Create PRs for high-priority opportunities (if auto-merge enabled)
    if (site.autoMerge && site.githubRepo && site.githubOwner) {
      const highPriorityOpportunities = storedOpportunities.filter(
        opp => opp.priority === 'HIGH' && opp.confidence > 0.8
      );

      if (highPriorityOpportunities.length > 0) {
        await createPullRequests(site, highPriorityOpportunities.slice(0, 3)); // Limit to 3 PRs
      }
    }

    siteTimer();
    logger.info('Site processing completed', { 
      siteId: site.id, 
      crawlCount: crawlResults.length,
      opportunityCount: opportunities.length,
    });

  } catch (error) {
    siteTimer();
    logger.error('Failed to process site', { siteId: site.id, error });
    throw error;
  }
}

async function createPullRequests(site: any, opportunities: any[]): Promise<void> {
  try {
    const patcher = new GitHubPatcher();

    for (const opportunity of opportunities) {
      try {
        // Generate patch data
        const patchData = opportunity.patchData ? JSON.parse(opportunity.patchData) : null;
        
        if (!patchData) {
          logger.warn('No patch data available for opportunity', { 
            opportunityId: opportunity.id 
          });
          continue;
        }

        // Create GitHub patch
        const gitHubPatch = {
          repository: site.githubRepo,
          owner: site.githubOwner,
          branch: `nebula-${opportunity.id}`,
          files: [{
            path: patchData.filePath,
            content: patchData.newContent,
            encoding: 'utf-8' as const,
          }],
          commitMessage: `${opportunity.title}\n\n${opportunity.description}`,
          prTitle: opportunity.title,
          prDescription: `${opportunity.description}\n\nEstimated revenue impact: $${opportunity.revenueDelta}/month\nConfidence: ${(opportunity.confidence * 100).toFixed(1)}%\n\nReasoning:\n${opportunity.reasoning}`,
        };

        // Create PR
        const { prNumber, prUrl } = await patcher.createPullRequest(
          gitHubPatch,
          site.githubInstallationId || '1' // You'd store this during GitHub App installation
        );

        // Create deployment record
        await db.client.deployment.create({
          data: {
            opportunityId: opportunity.id,
            siteId: site.id,
            prNumber,
            prUrl,
            prTitle: opportunity.title,
            prDescription: gitHubPatch.prDescription,
            status: 'PR_CREATED',
          },
        });

        logger.info('PR created for opportunity', { 
          opportunityId: opportunity.id,
          prNumber,
          prUrl,
        });

      } catch (error) {
        logger.error('Failed to create PR for opportunity', { 
          opportunityId: opportunity.id, 
          error 
        });
      }
    }
  } catch (error) {
    logger.error('Failed to create pull requests', { siteId: site.id, error });
  }
}

// Handle manual trigger
export const manualTrigger: Handler = async (event, context) => {
  // Allow manual triggering via API call
  if (event.httpMethod === 'POST') {
    return await handler(event, context);
  }

  return {
    statusCode: 405,
    body: JSON.stringify({
      success: false,
      error: 'Method not allowed',
    }),
  };
};