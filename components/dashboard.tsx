'use client';

import React, { useState, useEffect } from 'react';
// Recharts removed for simplified deployment
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Minus, GitPullRequest, Zap, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import type { DashboardData } from '../types';

interface DashboardProps {
  siteId: string;
}

export default function Dashboard({ siteId }: DashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [siteId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // In production, this would be an actual API call
      const mockData: DashboardData = {
        growthScore: 87,
        recentPRs: [
          {
            id: '1',
            title: 'Optimize hero section copy for better conversion',
            url: 'https://github.com/example/repo/pull/123',
            status: 'merged',
            createdAt: '2024-01-15T10:30:00Z',
            impact: 420,
          },
          {
            id: '2',
            title: 'Add FAQ schema for better SEO visibility',
            url: 'https://github.com/example/repo/pull/124',
            status: 'open',
            createdAt: '2024-01-14T15:45:00Z',
            impact: 280,
          },
          {
            id: '3',
            title: 'Improve page load speed with image optimization',
            url: 'https://github.com/example/repo/pull/125',
            status: 'merged',
            createdAt: '2024-01-13T09:15:00Z',
            impact: 650,
          },
        ],
        opportunities: [
          {
            id: '1',
            title: 'Add competitor price comparison widget',
            description: 'Add widget to compare prices with competitors',
            type: 'CONVERSION' as const,
            priority: 'HIGH' as const,
            revenueDelta: 890,
            confidence: 0.85,
            status: 'PENDING',
          },
          {
            id: '2',
            title: 'Optimize mobile checkout flow',
            description: 'Improve mobile checkout conversion',
            type: 'UX' as const,
            priority: 'HIGH' as const,
            revenueDelta: 1200,
            confidence: 0.92,
            status: 'PENDING',
          },
          {
            id: '3',
            title: 'Create loyalty program landing page',
            description: 'Build dedicated landing page for loyalty program',
            type: 'CONTENT' as const,
            priority: 'MEDIUM' as const,
            revenueDelta: 340,
            confidence: 0.78,
            status: 'PENDING',
          },
        ],
        performanceMetrics: {
          currentScore: 92,
          previousScore: 87,
          trend: 'up',
        },
        competitorAnalysis: [
          {
            name: 'Competitor A',
            url: 'https://competitor-a.com',
            score: 85,
            changes: 2,
          },
          {
            name: 'Competitor B',
            url: 'https://competitor-b.com',
            score: 78,
            changes: -1,
          },
        ],
      };

      setData(mockData);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchDashboardData} />;
  }

  if (!data) {
    return <ErrorState error="No data available" onRetry={fetchDashboardData} />;
  }

  return (
    <div className="min-h-screen bg-background-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-dark-50">Growth Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-gradient-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
              Run Analysis
            </button>
            <button className="border border-border-dark text-text-dark px-4 py-2 rounded-xl hover:bg-surface-dark transition-colors">
              Settings
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GrowthScoreCard score={data.growthScore || 0} />
          <PerformanceCard metrics={data.performanceMetrics || { currentScore: 0, previousScore: 0, trend: 'flat' }} />
          <OpportunitiesCard opportunities={data.opportunities} />
          <RevenueCard recentPRs={data.recentPRs || []} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OpportunitiesChart opportunities={data.opportunities} />
          <PerformanceTrendChart />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentPRsTable recentPRs={data.recentPRs || []} />
          <CompetitorAnalysis competitors={data.competitorAnalysis || []} />
        </div>
      </div>
    </div>
  );
}

function GrowthScoreCard({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-dark';
    if (score >= 70) return 'text-warning-dark';
    return 'text-error-dark';
  };

  return (
    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-dark-secondary text-sm">Growth Score</p>
          <p className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
          <Target className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <div className="w-full bg-dark-800 rounded-full h-2">
          <div
            className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function PerformanceCard({ metrics }: { metrics: DashboardData['performanceMetrics'] }) {
  if (!metrics) return null;
  const TrendIcon = metrics.trend === 'up' ? TrendingUp : metrics.trend === 'down' ? TrendingDown : Minus;
  const trendColor = metrics.trend === 'up' ? 'text-success-dark' : metrics.trend === 'down' ? 'text-error-dark' : 'text-text-dark-secondary';

  return (
    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-dark-secondary text-sm">Performance</p>
          <p className="text-3xl font-bold text-dark-50">{metrics.currentScore}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <TrendIcon className={`w-4 h-4 ${trendColor}`} />
        <span className={`text-sm ${trendColor}`}>
          {Math.abs(metrics.currentScore - metrics.previousScore)} from last week
        </span>
      </div>
    </div>
  );
}

function OpportunitiesCard({ opportunities }: { opportunities: DashboardData['opportunities'] }) {
  const pendingCount = opportunities.filter(o => o.status === 'PENDING').length;
  const highPriorityCount = opportunities.filter(o => o.priority === 'HIGH').length;

  return (
    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-dark-secondary text-sm">Opportunities</p>
          <p className="text-3xl font-bold text-dark-50">{pendingCount}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm text-text-dark-secondary">
          {highPriorityCount} high priority
        </span>
      </div>
    </div>
  );
}

function RevenueCard({ recentPRs }: { recentPRs: DashboardData['recentPRs'] }) {
  if (!recentPRs) return null;
  const totalImpact = recentPRs.reduce((sum, pr) => sum + pr.impact, 0);
  const mergedPRs = recentPRs.filter(pr => pr.status === 'merged').length;

  return (
    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-dark-secondary text-sm">Revenue Impact</p>
          <p className="text-3xl font-bold text-dark-50">${totalImpact}</p>
        </div>
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
          <GitPullRequest className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm text-text-dark-secondary">
          {mergedPRs} PRs merged this month
        </span>
      </div>
    </div>
  );
}

function OpportunitiesChart({ opportunities }: { opportunities: DashboardData['opportunities'] }) {
  const chartData = opportunities.map(opp => ({
    name: opp.title.substring(0, 20) + '...',
    value: opp.revenueDelta,
    priority: opp.priority,
  }));

  const COLORS = {
    HIGH: '#ef4444',
    MEDIUM: '#f59e0b',
    LOW: '#10b981',
  };

  return (
    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
      <h3 className="text-lg font-semibold text-dark-50 mb-4">Revenue Opportunities</h3>
      <div className="w-full h-[300px] bg-dark-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 text-primary-dark mx-auto mb-4" />
          <p className="text-text-dark-secondary">Revenue Chart</p>
          <p className="text-sm text-text-dark-secondary mt-2">Chart component placeholder</p>
        </div>
      </div>
    </div>
  );
}

function PerformanceTrendChart() {
  const data = [
    { date: '2024-01-08', score: 85 },
    { date: '2024-01-09', score: 87 },
    { date: '2024-01-10', score: 89 },
    { date: '2024-01-11', score: 86 },
    { date: '2024-01-12', score: 92 },
    { date: '2024-01-13', score: 90 },
    { date: '2024-01-14', score: 94 },
  ];

  return (
    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
      <h3 className="text-lg font-semibold text-dark-50 mb-4">Performance Trend</h3>
      <div className="w-full h-[300px] bg-dark-800 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-primary-dark mx-auto mb-4" />
          <p className="text-text-dark-secondary">Performance Chart</p>
          <p className="text-sm text-text-dark-secondary mt-2">Chart component placeholder</p>
        </div>
      </div>
    </div>
  );
}

function RecentPRsTable({ recentPRs }: { recentPRs: DashboardData['recentPRs'] }) {
  if (!recentPRs) return null;
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'merged':
        return <CheckCircle className="w-4 h-4 text-success-dark" />;
      case 'open':
        return <GitPullRequest className="w-4 h-4 text-warning-dark" />;
      default:
        return <Minus className="w-4 h-4 text-text-dark-secondary" />;
    }
  };

  return (
    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
      <h3 className="text-lg font-semibold text-dark-50 mb-4">Recent Pull Requests</h3>
      <div className="space-y-4">
        {recentPRs.map((pr) => (
          <div key={pr.id} className="flex items-center justify-between p-4 bg-dark-800 rounded-xl">
            <div className="flex items-center space-x-3">
              {getStatusIcon(pr.status)}
              <div>
                <p className="text-dark-50 font-medium text-sm">{pr.title}</p>
                <p className="text-text-dark-secondary text-xs">
                  {new Date(pr.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-success-dark font-medium text-sm">+${pr.impact}</p>
              <p className="text-text-dark-secondary text-xs">impact</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompetitorAnalysis({ competitors }: { competitors: DashboardData['competitorAnalysis'] }) {
  if (!competitors) return null;
  return (
    <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
      <h3 className="text-lg font-semibold text-dark-50 mb-4">Competitor Analysis</h3>
      <div className="space-y-4">
        {competitors.map((competitor, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-dark-800 rounded-xl">
            <div>
              <p className="text-dark-50 font-medium text-sm">{competitor.name}</p>
              <p className="text-text-dark-secondary text-xs">{competitor.url}</p>
            </div>
            <div className="text-right">
              <p className="text-dark-50 font-medium text-sm">Score: {competitor.score}</p>
              <div className="flex items-center space-x-1">
                {competitor.changes > 0 ? (
                  <TrendingUp className="w-3 h-3 text-error-dark" />
                ) : competitor.changes < 0 ? (
                  <TrendingDown className="w-3 h-3 text-success-dark" />
                ) : (
                  <Minus className="w-3 h-3 text-text-dark-secondary" />
                )}
                <span className="text-text-dark-secondary text-xs">
                  {Math.abs(competitor.changes)} changes
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background-dark p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-8 bg-dark-800 rounded-xl w-64 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
              <div className="h-4 bg-dark-800 rounded w-24 animate-pulse mb-2" />
              <div className="h-8 bg-dark-800 rounded w-16 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-surface-dark rounded-2xl p-6 border border-border-dark h-80">
              <div className="h-6 bg-dark-800 rounded w-32 animate-pulse mb-4" />
              <div className="h-64 bg-dark-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-error-dark mx-auto mb-4" />
        <h2 className="text-xl font-bold text-dark-50 mb-2">Something went wrong</h2>
        <p className="text-text-dark-secondary mb-4">{error}</p>
        <button 
          onClick={onRetry}
          className="bg-gradient-primary text-white px-6 py-2 rounded-xl hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}