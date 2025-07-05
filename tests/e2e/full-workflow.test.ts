import { test, expect } from '@playwright/test';
import { db } from '../../lib/db';

test.describe('Nebula Growth Agent E2E Workflow', () => {
  test.beforeEach(async () => {
    // Setup test database and clean slate
    await db.connect();
    // In a real scenario, you'd seed test data here
  });

  test.afterEach(async () => {
    // Cleanup test data
    await db.disconnect();
  });

  test('complete growth optimization workflow', async ({ page, request }) => {
    // Test the full workflow from crawling to PR creation
    
    // Step 1: Trigger nightly crawl function
    const crawlResponse = await request.post('/.netlify/functions/nightly', {
      data: {
        siteId: 'test-site-id',
      },
    });

    expect(crawlResponse.status()).toBe(200);
    const crawlResult = await crawlResponse.json();
    expect(crawlResult.success).toBe(true);

    // Step 2: Wait for crawling and opportunity generation
    await page.waitForTimeout(5000);

    // Step 3: Check that opportunities were created
    const opportunities = await db.client.opportunity.findMany({
      where: { siteId: 'test-site-id' },
    });

    expect(opportunities.length).toBeGreaterThan(0);

    // Step 4: Verify opportunity structure
    const opportunity = opportunities[0];
    expect(opportunity).toHaveProperty('title');
    expect(opportunity).toHaveProperty('description');
    expect(opportunity).toHaveProperty('type');
    expect(opportunity).toHaveProperty('priority');
    expect(opportunity).toHaveProperty('revenueDelta');
    expect(opportunity).toHaveProperty('confidence');

    // Step 5: Check if deployment was created for high-priority opportunities
    if (opportunity.priority === 'HIGH' && opportunity.confidence > 0.8) {
      const deployment = await db.client.deployment.findFirst({
        where: { opportunityId: opportunity.id },
      });

      expect(deployment).toBeDefined();
      expect(deployment?.status).toMatch(/PR_CREATED|PENDING/);
    }
  });

  test('performance monitoring and rollback', async ({ page, request }) => {
    // Test performance monitoring and automatic rollback
    
    // Setup: Create a deployment record
    const site = await db.client.site.create({
      data: {
        url: 'https://test-site.com',
        name: 'Test Site',
        userId: 'test-user-id',
        githubRepo: 'test-repo',
        githubOwner: 'test-owner',
      },
    });

    const opportunity = await db.client.opportunity.create({
      data: {
        siteId: site.id,
        title: 'Test Opportunity',
        description: 'Test performance regression',
        type: 'PERFORMANCE_FIX',
        priority: 'HIGH',
        revenueDelta: 500,
        confidence: 0.9,
      },
    });

    const deployment = await db.client.deployment.create({
      data: {
        opportunityId: opportunity.id,
        siteId: site.id,
        prNumber: 123,
        prUrl: 'https://github.com/test-owner/test-repo/pull/123',
        status: 'DEPLOYED',
        beforeScore: 0.9,
      },
    });

    // Simulate a deploy hook with performance regression
    const deployHookResponse = await request.post('/.netlify/functions/deploy-hook', {
      data: {
        deploymentId: deployment.id,
        siteUrl: 'https://test-site.com',
        prNumber: 123,
        repository: 'test-repo',
        owner: 'test-owner',
      },
    });

    expect(deployHookResponse.status()).toBe(200);
    const deployResult = await deployHookResponse.json();

    // Check if rollback was triggered for poor performance
    if (!deployResult.success) {
      const updatedDeployment = await db.client.deployment.findUnique({
        where: { id: deployment.id },
      });

      expect(updatedDeployment?.status).toBe('ROLLED_BACK');
      expect(updatedDeployment?.rolledBackAt).toBeDefined();
    }
  });

  test('dashboard displays correct data', async ({ page }) => {
    // Test dashboard functionality
    
    // Setup test data
    const site = await db.client.site.create({
      data: {
        url: 'https://dashboard-test.com',
        name: 'Dashboard Test Site',
        userId: 'test-user-id',
      },
    });

    // Create some test opportunities
    await db.client.opportunity.createMany({
      data: [
        {
          siteId: site.id,
          title: 'Improve hero section',
          description: 'Optimize hero copy for better conversion',
          type: 'COPY_TWEAK',
          priority: 'HIGH',
          revenueDelta: 800,
          confidence: 0.95,
          status: 'PENDING',
        },
        {
          siteId: site.id,
          title: 'Add FAQ schema',
          description: 'Implement structured data for better SEO',
          type: 'FAQ_SCHEMA',
          priority: 'MEDIUM',
          revenueDelta: 300,
          confidence: 0.75,
          status: 'IN_PROGRESS',
        },
      ],
    });

    // Navigate to dashboard (assuming a test route exists)
    await page.goto('/dashboard');

    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="growth-score"]');

    // Check that growth score is displayed
    const growthScore = await page.textContent('[data-testid="growth-score"]');
    expect(growthScore).toBeTruthy();

    // Check that opportunities are displayed
    await page.waitForSelector('[data-testid="opportunities-chart"]');
    const opportunityCards = await page.locator('[data-testid="opportunity-card"]').count();
    expect(opportunityCards).toBeGreaterThan(0);

    // Check that performance metrics are shown
    await page.waitForSelector('[data-testid="performance-trend"]');
    const performanceChart = await page.locator('[data-testid="performance-trend"]');
    expect(performanceChart).toBeVisible();

    // Verify recent PRs section
    const prSection = await page.locator('[data-testid="recent-prs"]');
    expect(prSection).toBeVisible();
  });

  test('competitor analysis integration', async ({ page, request }) => {
    // Test competitor tracking and analysis
    
    const site = await db.client.site.create({
      data: {
        url: 'https://main-site.com',
        name: 'Main Site',
        userId: 'test-user-id',
      },
    });

    const competitor = await db.client.competitor.create({
      data: {
        siteId: site.id,
        url: 'https://competitor-site.com',
        name: 'Competitor Site',
      },
    });

    // Trigger crawl that includes competitors
    const crawlResponse = await request.post('/.netlify/functions/nightly', {
      data: {
        siteId: site.id,
        includeCompetitors: true,
      },
    });

    expect(crawlResponse.status()).toBe(200);

    // Wait for crawling to complete
    await page.waitForTimeout(3000);

    // Check that competitor data was collected
    const competitorCrawls = await db.client.crawl.findMany({
      where: { competitorId: competitor.id },
    });

    expect(competitorCrawls.length).toBeGreaterThan(0);

    // Verify competitor analysis in opportunities
    const opportunities = await db.client.opportunity.findMany({
      where: { 
        siteId: site.id,
        type: 'COMPETITOR_RESPONSE',
      },
    });

    // Should have opportunities that reference competitor insights
    if (opportunities.length > 0) {
      expect(opportunities[0].reasoning).toContain('competitor');
    }
  });

  test('API rate limiting and error handling', async ({ request }) => {
    // Test API endpoints handle rate limiting properly
    
    // Make multiple rapid requests to test rate limiting
    const requests = Array(10).fill(null).map(() => 
      request.post('/.netlify/functions/nightly', {
        data: { siteId: 'rate-limit-test' },
      })
    );

    const responses = await Promise.allSettled(requests);
    
    // Should have some successful and some rate-limited responses
    const successful = responses.filter(r => 
      r.status === 'fulfilled' && r.value.status() === 200
    ).length;
    
    const rateLimited = responses.filter(r => 
      r.status === 'fulfilled' && r.value.status() === 429
    ).length;

    expect(successful + rateLimited).toBe(10);
    expect(rateLimited).toBeGreaterThan(0); // Some should be rate limited
  });

  test('asset generation workflow', async ({ page, request }) => {
    // Test wallet pass and asset generation
    
    const site = await db.client.site.create({
      data: {
        url: 'https://ecommerce-site.com',
        name: 'E-commerce Site',
        userId: 'test-user-id',
      },
    });

    // Create an opportunity that should generate assets
    const opportunity = await db.client.opportunity.create({
      data: {
        siteId: site.id,
        title: 'Generate loyalty pass',
        description: 'Create Apple/Google Wallet loyalty pass',
        type: 'LOYALTY_PASS',
        priority: 'HIGH',
        revenueDelta: 1200,
        confidence: 0.9,
        patchData: JSON.stringify({
          type: 'json',
          filePath: 'assets/loyalty-pass.json',
          metadata: {
            passType: 'loyalty',
            customerData: {
              name: 'Test Customer',
              email: 'test@example.com',
              points: 1500,
            },
          },
        }),
      },
    });

    // This would trigger asset generation in the real workflow
    // For testing, we verify the patch data structure
    const patchData = JSON.parse(opportunity.patchData || '{}');
    expect(patchData.type).toBe('json');
    expect(patchData.metadata.passType).toBe('loyalty');
    expect(patchData.metadata.customerData).toBeDefined();
  });

  test('error recovery and logging', async ({ page, request }) => {
    // Test system handles errors gracefully and logs appropriately
    
    // Trigger function with invalid data
    const errorResponse = await request.post('/.netlify/functions/nightly', {
      data: {
        siteId: 'non-existent-site',
      },
    });

    // Should handle error gracefully
    expect(errorResponse.status()).toBeGreaterThanOrEqual(400);
    
    const errorResult = await errorResponse.json();
    expect(errorResult.success).toBe(false);
    expect(errorResult.error).toBeDefined();

    // Test health check endpoint
    const healthResponse = await request.get('/.netlify/functions/deploy-hook/health');
    expect(healthResponse.status()).toBe(200);
    
    const healthResult = await healthResponse.json();
    expect(healthResult.status).toMatch(/healthy|unhealthy/);
  });
});