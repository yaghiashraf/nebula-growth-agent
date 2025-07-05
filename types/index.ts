// Simplified types for deployment
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
  performanceScore?: number;
  accessibilityScore?: number;
  bestPracticesScore?: number;
  seoScore?: number;
  clsScore?: number;
  fidScore?: number;
  lcpScore?: number;
  fcpScore?: number;
}

export type OpportunityType = 'CONTENT' | 'PERFORMANCE' | 'SEO' | 'UX' | 'CONVERSION';
export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  priority: PriorityLevel;
  revenueDelta: number;
  targetUrl?: string;
  currentContent?: string;
  suggestedContent?: string;
  patchData?: string;
  reasoning?: string;
  confidence: number;
  status?: 'PENDING' | 'DEPLOYED' | 'FAILED' | 'ROLLED_BACK';
}

export interface GitHubPatch {
  repository: string;
  owner: string;
  branch: string;
  files: Array<{
    path: string;
    content: string;
    encoding: 'utf-8' | 'base64';
  }>;
  commitMessage: string;
  prTitle: string;
  prDescription: string;
}

export interface PatchData {
  filePath: string;
  newContent: string;
}

export interface GA4Anomaly {
  metric: string;
  value: number;
  expected: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  date: string;
}

export interface WalletPassData {
  title: string;
  description: string;
  logoUrl: string;
  backgroundColor: string;
  foregroundColor: string;
  data: Record<string, any>;
}

export interface DashboardData {
  opportunities: Opportunity[];
  metrics?: {
    totalOpportunities: number;
    totalRevenue: number;
    avgConfidence: number;
    implementationRate: number;
  };
  recentActivity?: any[];
  performanceHistory?: any[];
  growthScore?: number;
  recentPRs?: Array<{
    id: string;
    title: string;
    url: string;
    status: string;
    createdAt: string;
    impact: number;
  }>;
  performanceMetrics?: {
    currentScore: number;
    previousScore: number;
    trend: string;
  };
  competitorAnalysis?: Array<{
    name: string;
    url: string;
    score: number;
    changes: number;
  }>;
}