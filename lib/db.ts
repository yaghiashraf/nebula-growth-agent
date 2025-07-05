import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

// Global PrismaClient instance to prevent multiple connections
declare global {
  var __prisma: PrismaClient | undefined;
}

// Initialize Prisma Client
const prisma = globalThis.__prisma || new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

// Log database events
prisma.$on('query', (e) => {
  logger.debug('Database query', {
    query: e.query,
    params: e.params,
    duration: e.duration,
  });
});

prisma.$on('info', (e) => {
  logger.info('Database info', { message: e.message });
});

prisma.$on('warn', (e) => {
  logger.warn('Database warning', { message: e.message });
});

prisma.$on('error', (e) => {
  logger.error('Database error', { message: e.message });
});

// Ensure single instance in development
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

// Database utility functions
export const db = {
  // Core Prisma client
  client: prisma,

  // Connection management
  async connect(): Promise<void> {
    try {
      await prisma.$connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Failed to connect to database', { error });
      throw error;
    }
  },

  async disconnect(): Promise<void> {
    try {
      await prisma.$disconnect();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Failed to disconnect from database', { error });
      throw error;
    }
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed', { error });
      return false;
    }
  },

  // Transaction wrapper
  async transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return prisma.$transaction(fn);
  },

  // Utility queries
  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        sites: {
          include: {
            competitors: true,
            opportunities: {
              where: { status: 'PENDING' },
              orderBy: { revenueDelta: 'desc' },
              take: 5,
            },
          },
        },
      },
    });
  },

  async getSiteWithDetails(siteId: string) {
    return prisma.site.findUnique({
      where: { id: siteId },
      include: {
        user: true,
        competitors: true,
        crawls: {
          orderBy: { crawledAt: 'desc' },
          take: 10,
        },
        opportunities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  },

  async getLatestCrawlForSite(siteId: string) {
    return prisma.crawl.findFirst({
      where: { siteId },
      orderBy: { crawledAt: 'desc' },
      include: {
        embeddings: true,
      },
    });
  },

  async createOpportunityWithEmbeddings(
    siteId: string,
    opportunity: {
      title: string;
      description: string;
      type: string;
      priority: string;
      revenueDelta: number;
      targetUrl?: string;
      currentContent?: string;
      suggestedContent?: string;
      patchData?: string;
      reasoning?: string;
      confidence: number;
    }
  ) {
    return prisma.opportunity.create({
      data: {
        ...opportunity,
        siteId,
        type: opportunity.type as any,
        priority: opportunity.priority as any,
      },
    });
  },

  async findSimilarContent(
    vector: number[],
    siteId: string,
    limit: number = 5
  ): Promise<Array<{
    content: string;
    similarity: number;
    url: string;
    source: string;
  }>> {
    // In a real implementation, you would use vector similarity search
    // For SQLite, we'll use a simplified approach with text matching
    const crawls = await prisma.crawl.findMany({
      where: { siteId },
      include: { embeddings: true },
      take: limit * 2,
    });

    // Simple similarity calculation (in production, use proper vector similarity)
    const results = crawls.map(crawl => ({
      content: crawl.content,
      similarity: Math.random(), // Placeholder similarity
      url: crawl.url,
      source: 'site',
    }));

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  },

  async getCompetitorData(siteId: string) {
    return prisma.competitor.findMany({
      where: { siteId, isActive: true },
      include: {
        crawls: {
          orderBy: { crawledAt: 'desc' },
          take: 1,
        },
      },
    });
  },

  async updatePerformanceMetrics(
    crawlId: string,
    metrics: {
      lighthouseScore?: number;
      performanceScore?: number;
      accessibilityScore?: number;
      bestPracticesScore?: number;
      seoScore?: number;
      clsScore?: number;
      lcpScore?: number;
      fcpScore?: number;
    }
  ) {
    return prisma.crawl.update({
      where: { id: crawlId },
      data: metrics,
    });
  },

  async trackAnalytics(
    event: string,
    data: Record<string, any>,
    siteId?: string,
    userId?: string
  ) {
    return prisma.analytics.create({
      data: {
        event,
        data: JSON.stringify(data),
        siteId,
        userId,
        clientId: data.clientId,
        sessionId: data.sessionId,
      },
    });
  },

  async cleanupOldData(daysOld: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await prisma.$transaction([
      // Clean up old crawls
      prisma.crawl.deleteMany({
        where: {
          crawledAt: { lt: cutoffDate },
        },
      }),
      // Clean up old analytics
      prisma.analytics.deleteMany({
        where: {
          timestamp: { lt: cutoffDate },
        },
      }),
    ]);

    logger.info('Cleaned up old data', { cutoffDate, daysOld });
  },
};

// Export the Prisma client for direct use when needed
export { prisma };
export default db;