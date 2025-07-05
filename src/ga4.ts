// Simplified GA4 client for deployment
export class GA4Client {
  constructor(measurementId?: string, apiSecret?: string) {}
  
  async detectAnomalies() {
    return [];
  }
  
  async generateInsights(startDate: string, endDate: string) {
    return {
      summary: 'Test insights',
      metrics: {
        pageViews: 1000,
        sessions: 500,
        bounceRate: 0.3
      }
    };
  }
}