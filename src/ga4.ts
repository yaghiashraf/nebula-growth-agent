import axios from 'axios';
import { logger, componentLogger } from '../lib/logger';
import { config } from '../lib/config';
import type { GA4Anomaly } from '../types';

export class GA4Client {
  private measurementId: string;
  private apiSecret: string;
  private baseUrl = 'https://www.google-analytics.com/mp/collect';
  private reportingUrl = 'https://analyticsreporting.googleapis.com/v4/reports:batchGet';

  constructor(measurementId?: string, apiSecret?: string) {
    this.measurementId = measurementId || config.GA4_MEASUREMENT_ID || '';
    this.apiSecret = apiSecret || config.GA4_API_SECRET || '';
  }

  async sendEvent(
    clientId: string,
    eventName: string,
    eventParams: Record<string, any> = {}
  ): Promise<void> {
    try {
      const payload = {
        client_id: clientId,
        events: [
          {
            name: eventName,
            params: {
              ...eventParams,
              timestamp_micros: Date.now() * 1000,
            },
          },
        ],
      };

      await axios.post(
        `${this.baseUrl}?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      logger.debug('GA4 event sent successfully', { eventName, clientId });
    } catch (error) {
      logger.error('Failed to send GA4 event', { error, eventName, clientId });
      throw error;
    }
  }

  async trackPageView(
    clientId: string,
    pageUrl: string,
    pageTitle?: string,
    sessionId?: string
  ): Promise<void> {
    await this.sendEvent(clientId, 'page_view', {
      page_location: pageUrl,
      page_title: pageTitle,
      session_id: sessionId,
    });
  }

  async trackCustomEvent(
    clientId: string,
    eventName: string,
    eventParams: Record<string, any> = {}
  ): Promise<void> {
    await this.sendEvent(clientId, eventName, eventParams);
  }

  async detectAnomalies(
    startDate: string,
    endDate: string,
    metrics: string[] = ['sessions', 'pageviews', 'bounceRate', 'avgSessionDuration']
  ): Promise<GA4Anomaly[]> {
    try {
      // This is a simplified implementation
      // In a real-world scenario, you would use Google Analytics Reporting API
      const anomalies: GA4Anomaly[] = [];

      // Mock anomaly detection for demonstration
      const mockAnomalies = [
        {
          metric: 'sessions',
          value: 850,
          previousValue: 1200,
          percentChange: -29.2,
          significance: 'high' as const,
          date: new Date().toISOString().split('T')[0],
        },
        {
          metric: 'pageviews',
          value: 2100,
          previousValue: 2800,
          percentChange: -25.0,
          significance: 'medium' as const,
          date: new Date().toISOString().split('T')[0],
        },
      ];

      // In production, replace with actual API calls
      if (this.measurementId && this.apiSecret) {
        // Real GA4 API implementation would go here
        logger.info('Checking GA4 anomalies', { startDate, endDate, metrics });
        return mockAnomalies;
      }

      return [];
    } catch (error) {
      componentLogger.ai.error('GA4', error as Error);
      return [];
    }
  }

  async getTrafficData(
    startDate: string,
    endDate: string,
    dimensions: string[] = ['date'],
    metrics: string[] = ['sessions', 'pageviews']
  ): Promise<any[]> {
    try {
      // Mock implementation - replace with actual GA4 Data API
      const mockData = [
        {
          date: startDate,
          sessions: 1200,
          pageviews: 2800,
          bounceRate: 0.45,
          avgSessionDuration: 180,
        },
        {
          date: endDate,
          sessions: 850,
          pageviews: 2100,
          bounceRate: 0.52,
          avgSessionDuration: 165,
        },
      ];

      logger.info('Retrieved GA4 traffic data', { 
        startDate, 
        endDate, 
        recordCount: mockData.length 
      });

      return mockData;
    } catch (error) {
      logger.error('Failed to get GA4 traffic data', { error });
      return [];
    }
  }

  async getTopPages(
    startDate: string,
    endDate: string,
    limit: number = 10
  ): Promise<Array<{
    page: string;
    pageviews: number;
    sessions: number;
    bounceRate: number;
  }>> {
    try {
      // Mock implementation
      const mockPages = [
        {
          page: '/',
          pageviews: 850,
          sessions: 420,
          bounceRate: 0.35,
        },
        {
          page: '/products',
          pageviews: 650,
          sessions: 380,
          bounceRate: 0.28,
        },
        {
          page: '/about',
          pageviews: 320,
          sessions: 280,
          bounceRate: 0.42,
        },
        {
          page: '/contact',
          pageviews: 180,
          sessions: 160,
          bounceRate: 0.68,
        },
      ];

      return mockPages.slice(0, limit);
    } catch (error) {
      logger.error('Failed to get top pages', { error });
      return [];
    }
  }

  async getConversionData(
    startDate: string,
    endDate: string,
    conversionEvents: string[] = ['purchase', 'sign_up', 'download']
  ): Promise<Array<{
    event: string;
    count: number;
    value: number;
  }>> {
    try {
      // Mock implementation
      const mockConversions = [
        {
          event: 'purchase',
          count: 45,
          value: 2850.50,
        },
        {
          event: 'sign_up',
          count: 120,
          value: 0,
        },
        {
          event: 'download',
          count: 85,
          value: 0,
        },
      ];

      return mockConversions.filter(c => conversionEvents.includes(c.event));
    } catch (error) {
      logger.error('Failed to get conversion data', { error });
      return [];
    }
  }

  async calculateRevenueDelta(
    currentPeriod: { start: string; end: string },
    previousPeriod: { start: string; end: string }
  ): Promise<{
    currentRevenue: number;
    previousRevenue: number;
    delta: number;
    percentChange: number;
  }> {
    try {
      const currentConversions = await this.getConversionData(
        currentPeriod.start,
        currentPeriod.end
      );
      
      const previousConversions = await this.getConversionData(
        previousPeriod.start,
        previousPeriod.end
      );

      const currentRevenue = currentConversions.reduce((sum, c) => sum + c.value, 0);
      const previousRevenue = previousConversions.reduce((sum, c) => sum + c.value, 0);
      
      const delta = currentRevenue - previousRevenue;
      const percentChange = previousRevenue > 0 ? (delta / previousRevenue) * 100 : 0;

      return {
        currentRevenue,
        previousRevenue,
        delta,
        percentChange,
      };
    } catch (error) {
      logger.error('Failed to calculate revenue delta', { error });
      return {
        currentRevenue: 0,
        previousRevenue: 0,
        delta: 0,
        percentChange: 0,
      };
    }
  }

  async generateInsights(
    startDate: string,
    endDate: string
  ): Promise<{
    anomalies: GA4Anomaly[];
    topPages: Array<{ page: string; pageviews: number; sessions: number; bounceRate: number }>;
    conversionData: Array<{ event: string; count: number; value: number }>;
    suggestions: string[];
  }> {
    try {
      const [anomalies, topPages, conversionData] = await Promise.all([
        this.detectAnomalies(startDate, endDate),
        this.getTopPages(startDate, endDate),
        this.getConversionData(startDate, endDate),
      ]);

      const suggestions = this.generateSuggestions(anomalies, topPages, conversionData);

      return {
        anomalies,
        topPages,
        conversionData,
        suggestions,
      };
    } catch (error) {
      logger.error('Failed to generate GA4 insights', { error });
      return {
        anomalies: [],
        topPages: [],
        conversionData: [],
        suggestions: [],
      };
    }
  }

  private generateSuggestions(
    anomalies: GA4Anomaly[],
    topPages: Array<{ page: string; pageviews: number; sessions: number; bounceRate: number }>,
    conversionData: Array<{ event: string; count: number; value: number }>
  ): string[] {
    const suggestions: string[] = [];

    // Anomaly-based suggestions
    anomalies.forEach(anomaly => {
      if (anomaly.significance === 'high' && anomaly.percentChange < -20) {
        suggestions.push(
          `Critical: ${anomaly.metric} dropped by ${Math.abs(anomaly.percentChange).toFixed(1)}%. Immediate investigation needed.`
        );
      }
    });

    // Page performance suggestions
    topPages.forEach(page => {
      if (page.bounceRate > 0.6) {
        suggestions.push(
          `High bounce rate (${(page.bounceRate * 100).toFixed(1)}%) on ${page.page}. Consider improving content relevance and page speed.`
        );
      }
    });

    // Conversion suggestions
    const totalConversions = conversionData.reduce((sum, c) => sum + c.count, 0);
    if (totalConversions < 100) {
      suggestions.push(
        'Low conversion volume detected. Consider A/B testing CTAs and improving conversion funnels.'
      );
    }

    return suggestions;
  }
}

// Utility functions
export async function trackPageview(
  clientId: string,
  pageUrl: string,
  pageTitle?: string,
  measurementId?: string,
  apiSecret?: string
): Promise<void> {
  const ga4 = new GA4Client(measurementId, apiSecret);
  await ga4.trackPageView(clientId, pageUrl, pageTitle);
}

export async function getAnomalies(
  startDate: string,
  endDate: string,
  measurementId?: string,
  apiSecret?: string
): Promise<GA4Anomaly[]> {
  const ga4 = new GA4Client(measurementId, apiSecret);
  return await ga4.detectAnomalies(startDate, endDate);
}

export default GA4Client;