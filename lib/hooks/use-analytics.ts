'use client';
import { useQuery } from '@tanstack/react-query';

export type AnalyticsPeriod = '7d' | '30d' | '90d';

export interface WeeklyContributorData {
  week: string;
  newContributors: number;
  returning: number;
}

export interface WeeklyPRData {
  week: string;
  open: number;
  merged: number;
  closed: number;
}

export interface RepoActivity {
  repo: string;
  commits: number;
  prsOpened: number;
  prsMerged: number;
  issues: number;
}

export interface TopContributor {
  name: string;
  handle: string;
  mergedPRs: number;
  openPRs: number;
  issuesClosed: number;
  joinedAt: string;
}

export interface IssueCategory {
  category: string;
  count: number;
  resolutionRate: number;
  color: string;
}

export interface AnalyticsData {
  period: AnalyticsPeriod;
  activeContributors: number;
  activeContributorsChange: number;
  openPRs: number;
  openPRsChange: number;
  mergedPRs: number;
  mergedPRsChange: number;
  issueResolutionRate: number;
  issueResolutionRateChange: number;
  contributorGrowth: WeeklyContributorData[];
  prFlow: WeeklyPRData[];
  repoActivity: RepoActivity[];
  topContributors: TopContributor[];
  issueCategories: IssueCategory[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchAnalytics(period: AnalyticsPeriod): Promise<AnalyticsData> {
  const response = await fetch(`${API_BASE}/analytics?period=${period}`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  return response.json();
}

export function useAnalytics(period: AnalyticsPeriod = '30d') {
  return useQuery({
    queryKey: ['analytics', period],
    queryFn: () => fetchAnalytics(period),
    staleTime: 60_000,
  });
}
