// Simplified database client for deployment

// Simple logger fallback
const logger = {
  info: console.log,
  error: console.error,
  warn: console.warn,
};

// Mock database client for deployment
class MockPrismaClient {
  user = {
    findMany: async (...args: any[]) => [],
    findUnique: async (...args: any[]) => null,
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
  };
  
  website = {
    findMany: async (...args: any[]) => [],
    findUnique: async (...args: any[]) => null,
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
  };
  
  subscription = {
    findMany: async (...args: any[]) => [],
    findUnique: async (...args: any[]) => null,
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
  };
  
  deployment = {
    findMany: async (...args: any[]) => [],
    findUnique: async (...args: any[]) => null,
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
  };
  
  optimization = {
    findMany: async (...args: any[]) => [],
    findUnique: async (...args: any[]) => null,
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
  };
  
  crawlResult = {
    findMany: async (...args: any[]) => [],
    findUnique: async (...args: any[]) => null,
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
  };
  
  pullRequest = {
    findMany: async (...args: any[]) => [],
    findUnique: async (...args: any[]) => null,
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
  };
  
  analytics = {
    findMany: async (...args: any[]) => [],
    findUnique: async (...args: any[]) => null,
    create: async (...args: any[]) => ({}),
    update: async (...args: any[]) => ({}),
    delete: async (...args: any[]) => ({}),
  };
  
  async $connect() {
    logger.info('Mock database connected');
  }
  
  async $disconnect() {
    logger.info('Mock database disconnected');
  }
}

// Global PrismaClient instance
let globalForPrisma = globalThis as unknown as {
  prisma: MockPrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new MockPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database utility class
export class DatabaseClient {
  client: MockPrismaClient;
  
  constructor() {
    this.client = prisma;
  }
  
  async trackAnalytics(event: string, data: any) {
    logger.info('Analytics event:', event, data);
    return {};
  }
  
  async getUsageStats(userId: string) {
    return {
      sites: 0,
      pages: 0,
      crawls: 0,
    };
  }
  
  async checkPlanLimits(userId: string, planType: string) {
    return {
      withinLimits: true,
      usage: { sites: 0, pages: 0, crawls: 0 },
      limits: { sites: 5, pages: 10000, crawls: 100 },
    };
  }
}

// Export the database client instance
export const db = new DatabaseClient();

// Export the prisma client for direct use
export { prisma };

export default db;