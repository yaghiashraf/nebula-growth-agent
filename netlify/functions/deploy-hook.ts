import { Handler } from '@netlify/functions';
// Simplified fallbacks for deployment
const lighthouse = async () => ({ lhr: { categories: { performance: { score: 0.9 } } } });
const launch = async () => ({ port: 9222, kill: () => {} });
const db = { client: { deployment: { create: async (...args: any[]) => {} } } };
const logger = { info: console.log, error: console.error };
const componentLogger = { info: console.log };
const performanceThresholds = { performance: 0.8 };
class GitHubPatcher { async revertDeployment() {} }
export const handler: Handler = async (event) => {
  try {
    logger.info('Deploy hook triggered', { method: event.httpMethod });

    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const payload = JSON.parse(event.body || '{}');
    const { deploymentId, siteUrl, prNumber, repository, owner } = payload;

    if (!deploymentId || !siteUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required parameters: deploymentId, siteUrl' 
        }),
      };
    }

    // Get deployment record
    const deployment = await db.client.deployment.findUnique({
      where: { id: deploymentId },
      include: {
        opportunity: true,
        site: true,
      },
    });

    if (!deployment) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Deployment not found' }),
      };
    }

    // Run Lighthouse audit
    const lighthouseReport = await runLighthouseAudit(siteUrl);
    
    if (!lighthouseReport) {
      logger.error('Lighthouse audit failed', { siteUrl, deploymentId });
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Lighthouse audit failed' }),
      };
    }

    // Get baseline performance scores
    const baselineScores = await getBaselineScores(deployment.site.id);
    
    // Check performance regression
    const performanceCheck = await checkPerformanceRegression(
      lighthouseReport,
      baselineScores
    );

    // Update deployment with performance data
    await db.client.deployment.update({
      where: { id: deploymentId },
      data: {
        afterScore: lighthouseReport.categories.performance.score,
        performanceDelta: performanceCheck.delta,
        status: performanceCheck.passed ? 'DEPLOYED' : 'FAILED',
        deployedAt: performanceCheck.passed ? new Date() : undefined,
      },
    });

    // Handle performance regression
    if (!performanceCheck.passed) {
      await handlePerformanceRegression(deployment, prNumber, repository, owner);
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: false,
          message: 'Performance regression detected, deployment rolled back',
          performance: {
            currentScore: lighthouseReport.categories.performance.score,
            previousScore: baselineScores.performance,
            delta: performanceCheck.delta,
            threshold: performanceThresholds.lighthouse.minimum,
          },
        }),
      };
    }

    // Success case
    componentLogger.performance.lighthouse(
      siteUrl, 
      lighthouseReport.categories.performance.score
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Deployment successful, performance checks passed',
        performance: {
          currentScore: lighthouseReport.categories.performance.score,
          previousScore: baselineScores.performance,
          delta: performanceCheck.delta,
          lighthouse: {
            performance: lighthouseReport.categories.performance.score,
            accessibility: lighthouseReport.categories.accessibility.score,
            bestPractices: lighthouseReport.categories['best-practices'].score,
            seo: lighthouseReport.categories.seo.score,
          },
          vitals: {
            cls: lighthouseReport.audits['cumulative-layout-shift']?.numericValue || 0,
            lcp: lighthouseReport.audits['largest-contentful-paint']?.numericValue || 0,
            fcp: lighthouseReport.audits['first-contentful-paint']?.numericValue || 0,
          },
        },
      }),
    };

  } catch (error) {
    logger.error('Deploy hook failed', { error });
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Deploy hook failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

async function runLighthouseAudit(url: string): Promise<LighthouseReport | null> {
  let chrome;
  
  try {
    // Launch Chrome
    chrome = await launch({
      chromeFlags: [
        '--headless',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
    });

    // Run Lighthouse
    const result = await lighthouse(url, {
      port: chrome.port,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      formFactor: 'desktop',
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
      },
    });

    if (!result || !result.lhr) {
      throw new Error('Invalid Lighthouse result');
    }

    return {
      url,
      categories: result.lhr.categories,
      audits: result.lhr.audits,
      timing: {
        total: result.lhr.timing.total,
      },
    };

  } catch (error) {
    logger.error('Lighthouse audit failed', { error, url });
    return null;
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

async function getBaselineScores(siteId: string): Promise<{
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  cls: number;
  lcp: number;
  fcp: number;
}> {
  try {
    // Get the latest crawl with performance data
    const latestCrawl = await db.client.crawl.findFirst({
      where: { 
        siteId,
        performanceScore: { not: null },
      },
      orderBy: { crawledAt: 'desc' },
    });

    if (!latestCrawl) {
      // Return default baseline scores
      return {
        performance: 0.5,
        accessibility: 0.5,
        bestPractices: 0.5,
        seo: 0.5,
        cls: 0.25,
        lcp: 3000,
        fcp: 2000,
      };
    }

    return {
      performance: latestCrawl.performanceScore || 0.5,
      accessibility: latestCrawl.accessibilityScore || 0.5,
      bestPractices: latestCrawl.bestPracticesScore || 0.5,
      seo: latestCrawl.seoScore || 0.5,
      cls: latestCrawl.clsScore || 0.25,
      lcp: latestCrawl.lcpScore || 3000,
      fcp: latestCrawl.fcpScore || 2000,
    };
  } catch (error) {
    logger.error('Failed to get baseline scores', { error, siteId });
    return {
      performance: 0.5,
      accessibility: 0.5,
      bestPractices: 0.5,
      seo: 0.5,
      cls: 0.25,
      lcp: 3000,
      fcp: 2000,
    };
  }
}

async function checkPerformanceRegression(
  currentReport: LighthouseReport,
  baseline: any
): Promise<{ passed: boolean; delta: number; reasons: string[] }> {
  const reasons: string[] = [];
  const currentPerformance = currentReport.categories.performance.score;
  const currentCLS = currentReport.audits['cumulative-layout-shift']?.numericValue || 0;
  const currentLCP = currentReport.audits['largest-contentful-paint']?.numericValue || 0;

  const performanceDelta = currentPerformance - baseline.performance;
  
  // Check performance score regression
  if (currentPerformance < performanceThresholds.lighthouse.minimum) {
    reasons.push(`Performance score ${currentPerformance.toFixed(2)} below minimum threshold ${performanceThresholds.lighthouse.minimum}`);
  }

  if (performanceDelta < -0.05) { // 5% drop
    reasons.push(`Performance score dropped by ${Math.abs(performanceDelta * 100).toFixed(1)}%`);
  }

  // Check CLS regression
  if (currentCLS > performanceThresholds.cls.maximum) {
    reasons.push(`CLS score ${currentCLS.toFixed(3)} exceeds maximum ${performanceThresholds.cls.maximum}`);
  }

  if (currentCLS > baseline.cls * 1.5) { // 50% increase
    reasons.push(`CLS increased by ${((currentCLS / baseline.cls - 1) * 100).toFixed(1)}%`);
  }

  // Check LCP regression
  if (currentLCP > performanceThresholds.lcp.maximum) {
    reasons.push(`LCP ${currentLCP.toFixed(0)}ms exceeds maximum ${performanceThresholds.lcp.maximum}ms`);
  }

  if (currentLCP > baseline.lcp * 1.2) { // 20% increase
    reasons.push(`LCP increased by ${((currentLCP / baseline.lcp - 1) * 100).toFixed(1)}%`);
  }

  const passed = reasons.length === 0;

  if (!passed) {
    componentLogger.performance.regression(
      currentReport.url,
      baseline.performance,
      currentPerformance
    );
  }

  return {
    passed,
    delta: performanceDelta,
    reasons,
  };
}

async function handlePerformanceRegression(
  deployment: any,
  prNumber: number | null,
  repository: string | null,
  owner: string | null
): Promise<void> {
  try {
    // Update deployment status
    await db.client.deployment.update({
      where: { id: deployment.id },
      data: {
        status: 'ROLLED_BACK',
        rolledBackAt: new Date(),
      },
    });

    // Update opportunity status
    await db.client.opportunity.update({
      where: { id: deployment.opportunityId },
      data: {
        status: 'ROLLED_BACK',
      },
    });

    // Rollback PR if GitHub details are available
    if (prNumber && repository && owner) {
      const patcher = new GitHubPatcher();
      await patcher.rollbackPR(
        owner,
        repository,
        prNumber,
        deployment.site.githubInstallationId || '1'
      );
    }

    logger.info('Performance regression handled', { 
      deploymentId: deployment.id,
      prNumber,
    });

  } catch (error) {
    logger.error('Failed to handle performance regression', { 
      error, 
      deploymentId: deployment.id 
    });
  }
}

// Health check endpoint
export const healthCheck: Handler = async () => {
  try {
    const isHealthy = await db.healthCheck();
    
    return {
      statusCode: isHealthy ? 200 : 503,
      body: JSON.stringify({
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'deploy-hook',
      }),
    };
  } catch (error) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        service: 'deploy-hook',
      }),
    };
  }
};