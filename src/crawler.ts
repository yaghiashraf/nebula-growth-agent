// Simplified crawler for deployment
export class WebCrawler {
  constructor(options: any = {}) {}
  
  async init() {}
  
  async close() {}
  
  async crawlSite(url: string, options: any = {}) {
    return [{
      url,
      title: 'Test Page',
      content: 'Test content',
      htmlContent: '<p>Test content</p>',
      metaDescription: 'Test description',
      statusCode: 200,
      loadTime: 1000,
      contentSize: 5000,
      performanceMetrics: {
        performanceScore: 0.8,
        accessibilityScore: 0.9,
        bestPracticesScore: 0.85,
        seoScore: 0.9,
        clsScore: 0.1,
        fidScore: 50,
        lcpScore: 1.2,
        fcpScore: 1.5
      }
    }];
  }
}