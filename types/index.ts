// Core types and interfaces for Nebula Growth Agent

export interface CrawlResult {
  url: string;
  title?: string;
  content: string;
  htmlContent: string;
  metaDescription?: string;
  statusCode: number;
  loadTime: number;
  contentSize: number;
  performanceMetrics?: PerformanceMetrics;
}

export interface PerformanceMetrics {
  lighthouseScore?: number;
  performanceScore?: number;
  accessibilityScore?: number;
  bestPracticesScore?: number;
  seoScore?: number;
  clsScore?: number;
  lcpScore?: number;
  fcpScore?: number;
}

export interface GA4Anomaly {
  metric: string;
  value: number;
  previousValue: number;
  percentChange: number;
  significance: 'low' | 'medium' | 'high';
  date: string;
}

export interface EmbeddingVector {
  content: string;
  vector: number[];
  metadata?: Record<string, any>;
}

export interface RAGContext {
  query: string;
  similarContent: Array<{
    content: string;
    similarity: number;
    source: string;
    url: string;
  }>;
  competitorData?: Array<{
    url: string;
    content: string;
    relevance: number;
  }>;
}

export interface AIOpportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  priority: PriorityLevel;
  revenueDelta: number;
  targetUrl?: string;
  currentContent?: string;
  suggestedContent?: string;
  patchData?: PatchData;
  reasoning?: string;
  confidence: number;
}

export interface PatchData {
  type: 'content' | 'html' | 'css' | 'json' | 'image';
  filePath: string;
  oldContent?: string;
  newContent?: string;
  position?: {
    line: number;
    column: number;
  };
  metadata?: Record<string, any>;
}

export interface GitHubPatch {
  repository: string;
  owner: string;
  branch: string;
  files: Array<{
    path: string;
    content: string;
    encoding?: 'utf-8' | 'base64';
  }>;
  commitMessage: string;
  prTitle: string;
  prDescription: string;
}

export interface LighthouseReport {
  url: string;
  categories: {
    performance: { score: number };
    accessibility: { score: number };
    'best-practices': { score: number };
    seo: { score: number };
  };
  audits: {
    'cumulative-layout-shift': { numericValue: number };
    'largest-contentful-paint': { numericValue: number };
    'first-contentful-paint': { numericValue: number };
    [key: string]: { numericValue?: number; score?: number };
  };
  timing: {
    total: number;
  };
}

export interface WalletPassData {
  formatVersion: number;
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;
  organizationName: string;
  description: string;
  logoText: string;
  backgroundColor: string;
  foregroundColor: string;
  labelColor: string;
  generic: {
    primaryFields: Array<{
      key: string;
      label: string;
      value: string;
    }>;
    secondaryFields: Array<{
      key: string;
      label: string;
      value: string;
    }>;
  };
  barcode: {
    message: string;
    format: string;
    messageEncoding: string;
  };
}

export interface ConfigSettings {
  site: {
    url: string;
    name: string;
    maxPages: number;
    autoMerge: boolean;
    scanFrequency: 'weekly' | 'nightly' | 'hourly';
  };
  github: {
    owner: string;
    repo: string;
    token: string;
  };
  ga4: {
    measurementId: string;
    apiSecret: string;
  };
  competitors: Array<{
    url: string;
    name: string;
  }>;
  ai: {
    openaiApiKey: string;
    claudeApiKey: string;
    maxTokens: number;
    temperature: number;
  };
}

export interface DashboardData {
  growthScore: number;
  recentPRs: Array<{
    id: string;
    title: string;
    url: string;
    status: 'merged' | 'open' | 'closed';
    createdAt: string;
    impact: number;
  }>;
  opportunities: Array<{
    id: string;
    title: string;
    priority: PriorityLevel;
    revenueDelta: number;
    status: OpportunityStatus;
  }>;
  performanceMetrics: {
    currentScore: number;
    previousScore: number;
    trend: 'up' | 'down' | 'stable';
  };
  competitorAnalysis: Array<{
    name: string;
    url: string;
    score: number;
    changes: number;
  }>;
}

export interface NetlifyFunctionEvent {
  httpMethod: string;
  path: string;
  queryStringParameters: Record<string, string> | null;
  headers: Record<string, string>;
  body: string | null;
  isBase64Encoded: boolean;
}

export interface NetlifyFunctionContext {
  callbackWaitsForEmptyEventLoop: boolean;
  functionName: string;
  functionVersion: string;
  invokedFunctionArn: string;
  memoryLimitInMB: string;
  awsRequestId: string;
  logGroupName: string;
  logStreamName: string;
  getRemainingTimeInMillis(): number;
}

export interface NetlifyFunctionResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
  isBase64Encoded?: boolean;
}

// Re-export Prisma enums
export {
  PlanType,
  OpportunityType,
  PriorityLevel,
  OpportunityStatus,
  DeploymentStatus,
} from '@prisma/client';

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type APIResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
};

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type EventHandler<T = any> = (event: T) => void | Promise<void>;

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface Logger {
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
}