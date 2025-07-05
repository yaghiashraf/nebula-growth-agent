// Simplified config for deployment - no external dependencies

// Simple logger fallback
const logger = {
  info: console.log,
  error: console.error,
  warn: console.warn,
};

// Configuration object with environment variables
export const config = {
  // Database
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  // AI Services  
  ai: {
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  },
  
  // GitHub
  github: {
    appId: process.env.GITHUB_APP_ID || '',
    privateKey: process.env.GITHUB_PRIVATE_KEY || '',
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || '',
  },
  
  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },
  
  // Performance thresholds
  performanceThresholds: {
    performance: 0.8,
    accessibility: 0.9,
    bestPractices: 0.85,
    seo: 0.9,
  },
  
  // Rate limiting
  rateLimits: {
    crawlsPerMinute: 10,
    apiRequestsPerMinute: 100,
  },
  
  // Security
  security: {
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
    sessionSecret: process.env.SESSION_SECRET || 'fallback-session',
  },
  
  // Application
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    port: parseInt(process.env.PORT || '3000'),
    environment: process.env.NODE_ENV || 'development',
  },
};

// Performance thresholds export for compatibility
export const performanceThresholds = config.performanceThresholds;

// Default export
export default config;