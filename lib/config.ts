import { z } from 'zod';
import { logger } from './logger';

// Environment variable validation schemas
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // AI Services
  OPENAI_API_KEY: z.string().min(1),
  CLAUDE_API_KEY: z.string().min(1),
  
  // GitHub Integration
  GITHUB_APP_ID: z.string().min(1),
  GITHUB_PRIVATE_KEY: z.string().min(1),
  
  // GA4 Integration
  GA4_MEASUREMENT_ID: z.string().optional(),
  GA4_API_SECRET: z.string().optional(),
  
  // Application Settings
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  
  // Feature Flags
  AUTO_MERGE: z.string().transform(val => val === 'true').default('false'),
  ENABLE_PERFORMANCE_TRACKING: z.string().transform(val => val === 'true').default('true'),
  ENABLE_COMPETITOR_TRACKING: z.string().transform(val => val === 'true').default('true'),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW: z.string().transform(val => parseInt(val)).default('900000'), // 15 minutes
  RATE_LIMIT_MAX: z.string().transform(val => parseInt(val)).default('100'),
  
  // Performance Thresholds
  MIN_LIGHTHOUSE_SCORE: z.string().transform(val => parseFloat(val)).default('0.8'),
  MAX_CLS_SCORE: z.string().transform(val => parseFloat(val)).default('0.1'),
  MAX_LCP_SCORE: z.string().transform(val => parseFloat(val)).default('2500'),
  
  // Crawler Settings
  MAX_CRAWL_PAGES: z.string().transform(val => parseInt(val)).default('50'),
  CRAWL_TIMEOUT: z.string().transform(val => parseInt(val)).default('30000'),
  CRAWL_DELAY: z.string().transform(val => parseInt(val)).default('1000'),
  
  // AI Settings
  MAX_AI_TOKENS: z.string().transform(val => parseInt(val)).default('4000'),
  AI_TEMPERATURE: z.string().transform(val => parseFloat(val)).default('0.7'),
  
  // Webhook Settings
  WEBHOOK_SECRET: z.string().optional(),
  SLACK_WEBHOOK_URL: z.string().url().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  ANALYTICS_TRACKING_ID: z.string().optional(),
});

// Load and validate environment variables
function loadConfig() {
  try {
    const config = envSchema.parse(process.env);
    logger.info('Configuration loaded successfully');
    return config;
  } catch (error) {
    logger.error('Configuration validation failed', { error });
    throw new Error('Invalid configuration. Please check your environment variables.');
  }
}

export const config = loadConfig();

// Plan configurations
export const planLimits = {
  STARTER: {
    maxSites: 1,
    maxPages: 50,
    scanFrequency: 'weekly',
    maxCompetitors: 1,
    features: ['basic-audit', 'manual-pr'],
  },
  PRO: {
    maxSites: 5,
    maxPages: 10000,
    scanFrequency: 'nightly',
    maxCompetitors: 3,
    features: ['auto-merge', 'sge-blocks', 'wallet-generator', 'advanced-analytics'],
  },
  AGENCY: {
    maxSites: 25,
    maxPages: 25000,
    scanFrequency: 'hourly',
    maxCompetitors: 5,
    features: ['white-label', 'api-access', 'slack-integration', 'custom-branding'],
  },
  ENTERPRISE: {
    maxSites: Infinity,
    maxPages: Infinity,
    scanFrequency: 'realtime',
    maxCompetitors: 10,
    features: ['sso', 'custom-models', 'dedicated-support', 'sla-guarantee'],
  },
} as const;

// Feature flag helpers
export const features = {
  isEnabled(feature: string): boolean {
    switch (feature) {
      case 'auto-merge':
        return config.AUTO_MERGE;
      case 'performance-tracking':
        return config.ENABLE_PERFORMANCE_TRACKING;
      case 'competitor-tracking':
        return config.ENABLE_COMPETITOR_TRACKING;
      default:
        return false;
    }
  },

  canUseFeature(userPlan: string, feature: string): boolean {
    const plan = planLimits[userPlan as keyof typeof planLimits];
    return plan ? plan.features.includes(feature) : false;
  },
};

// AI model configurations
export const aiModels = {
  openai: {
    embedding: 'text-embedding-3-small',
    chat: 'gpt-4',
    maxTokens: config.MAX_AI_TOKENS,
    temperature: config.AI_TEMPERATURE,
  },
  claude: {
    chat: 'claude-3-sonnet-20240229',
    maxTokens: config.MAX_AI_TOKENS,
    temperature: config.AI_TEMPERATURE,
  },
} as const;

// Crawler configurations
export const crawlerConfig = {
  maxPages: config.MAX_CRAWL_PAGES,
  timeout: config.CRAWL_TIMEOUT,
  delay: config.CRAWL_DELAY,
  userAgent: 'Nebula-Growth-Agent/1.0 (https://nebula-growth-agent.com)',
  viewport: {
    width: 1920,
    height: 1080,
  },
  ignorePatterns: [
    /\.(pdf|zip|exe|dmg|pkg|deb|rpm)$/i,
    /\/(admin|wp-admin|login|private)/,
    /\/api\//,
    /\?download=/,
  ],
  includePatterns: [
    /\.(html|htm|php|asp|aspx|jsp)$/i,
    /\/$/,
    /\/[^.]*$/,
  ],
};

// Performance thresholds
export const performanceThresholds = {
  lighthouse: {
    minimum: config.MIN_LIGHTHOUSE_SCORE,
    excellent: 0.95,
    good: 0.85,
    needsImprovement: 0.65,
  },
  cls: {
    maximum: config.MAX_CLS_SCORE,
    excellent: 0.05,
    good: 0.08,
    needsImprovement: 0.15,
  },
  lcp: {
    maximum: config.MAX_LCP_SCORE,
    excellent: 1500,
    good: 2000,
    needsImprovement: 3000,
  },
  fcp: {
    excellent: 1000,
    good: 1500,
    needsImprovement: 2500,
  },
};

// Rate limiting configuration
export const rateLimiting = {
  window: config.RATE_LIMIT_WINDOW,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests, please try again later.',
    statusCode: 429,
  },
};

// Webhook configurations
export const webhooks = {
  secret: config.WEBHOOK_SECRET,
  slack: {
    url: config.SLACK_WEBHOOK_URL,
    channel: '#nebula-alerts',
    username: 'Nebula Growth Agent',
    iconEmoji: ':rocket:',
  },
};

// Security configurations
export const security = {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://nebula-growth-agent.com', 'https://app.nebula-growth-agent.com']
      : ['http://localhost:3000', 'http://localhost:8888'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.openai.com', 'https://api.anthropic.com'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  },
};

// Export configuration utilities
export const getConfig = (key: string): any => {
  return config[key as keyof typeof config];
};

export const isDevelopment = (): boolean => {
  return config.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
  return config.NODE_ENV === 'production';
};

export const isTest = (): boolean => {
  return config.NODE_ENV === 'test';
};

export default config;