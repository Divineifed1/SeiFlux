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

const ANALYTICS_DATA: Record<AnalyticsPeriod, AnalyticsData> = {
  '7d': {
    period: '7d',
    activeContributors: 12, activeContributorsChange: 8,
    openPRs: 7, openPRsChange: -5,
    mergedPRs: 9, mergedPRsChange: 15,
    issueResolutionRate: 68, issueResolutionRateChange: 3,
    contributorGrowth: [
      { week: 'Mon', newContributors: 1, returning: 5 },
      { week: 'Tue', newContributors: 0, returning: 6 },
      { week: 'Wed', newContributors: 2, returning: 8 },
      { week: 'Thu', newContributors: 1, returning: 7 },
      { week: 'Fri', newContributors: 0, returning: 9 },
      { week: 'Sat', newContributors: 1, returning: 4 },
      { week: 'Sun', newContributors: 0, returning: 3 },
    ],
    prFlow: [
      { week: 'Mon', open: 2, merged: 1, closed: 0 },
      { week: 'Tue', open: 1, merged: 2, closed: 0 },
      { week: 'Wed', open: 3, merged: 1, closed: 1 },
      { week: 'Thu', open: 0, merged: 2, closed: 0 },
      { week: 'Fri', open: 2, merged: 3, closed: 0 },
      { week: 'Sat', open: 1, merged: 0, closed: 0 },
      { week: 'Sun', open: 0, merged: 0, closed: 1 },
    ],
    repoActivity: [
      { repo: 'seiswap-dex', commits: 18, prsOpened: 4, prsMerged: 3, issues: 6 },
      { repo: 'seiswap-sdk', commits: 7, prsOpened: 2, prsMerged: 2, issues: 2 },
      { repo: 'seiswap-subgraph', commits: 3, prsOpened: 1, prsMerged: 0, issues: 1 },
    ],
    topContributors: [
      { name: 'Alex Builder', handle: 'alexbuilder', mergedPRs: 3, openPRs: 2, issuesClosed: 4, joinedAt: '2024-01-15' },
      { name: 'Priya Nair', handle: 'priyanair', mergedPRs: 2, openPRs: 1, issuesClosed: 2, joinedAt: '2024-02-01' },
      { name: 'Sam Okonkwo', handle: 'samokonkwo', mergedPRs: 2, openPRs: 0, issuesClosed: 3, joinedAt: '2024-02-15' },
      { name: 'Chen Wei', handle: 'chenwei_dev', mergedPRs: 1, openPRs: 2, issuesClosed: 1, joinedAt: '2024-03-01' },
      { name: 'Jordan Mills', handle: 'jmills', mergedPRs: 1, openPRs: 2, issuesClosed: 2, joinedAt: '2024-03-20' },
    ],
    issueCategories: [
      { category: 'Bug', count: 8, resolutionRate: 75, color: '#ef4444' },
      { category: 'Feature', count: 5, resolutionRate: 40, color: '#3b82f6' },
      { category: 'Enhancement', count: 4, resolutionRate: 80, color: '#22c55e' },
      { category: 'Documentation', count: 3, resolutionRate: 100, color: '#eab308' },
    ],
  },
  '30d': {
    period: '30d',
    activeContributors: 24, activeContributorsChange: 12,
    openPRs: 11, openPRsChange: 10,
    mergedPRs: 38, mergedPRsChange: 22,
    issueResolutionRate: 72, issueResolutionRateChange: 7,
    contributorGrowth: [
      { week: 'Week 1', newContributors: 3, returning: 8 },
      { week: 'Week 2', newContributors: 2, returning: 12 },
      { week: 'Week 3', newContributors: 4, returning: 11 },
      { week: 'Week 4', newContributors: 1, returning: 14 },
    ],
    prFlow: [
      { week: 'Week 1', open: 8, merged: 6, closed: 2 },
      { week: 'Week 2', open: 10, merged: 9, closed: 1 },
      { week: 'Week 3', open: 7, merged: 11, closed: 3 },
      { week: 'Week 4', open: 11, merged: 12, closed: 2 },
    ],
    repoActivity: [
      { repo: 'seiswap-dex', commits: 67, prsOpened: 18, prsMerged: 14, issues: 22 },
      { repo: 'seiswap-sdk', commits: 28, prsOpened: 8, prsMerged: 7, issues: 8 },
      { repo: 'seiswap-subgraph', commits: 12, prsOpened: 3, prsMerged: 2, issues: 4 },
    ],
    topContributors: [
      { name: 'Alex Builder', handle: 'alexbuilder', mergedPRs: 12, openPRs: 3, issuesClosed: 15, joinedAt: '2024-01-15' },
      { name: 'Priya Nair', handle: 'priyanair', mergedPRs: 8, openPRs: 2, issuesClosed: 9, joinedAt: '2024-02-01' },
      { name: 'Sam Okonkwo', handle: 'samokonkwo', mergedPRs: 7, openPRs: 1, issuesClosed: 11, joinedAt: '2024-02-15' },
      { name: 'Chen Wei', handle: 'chenwei_dev', mergedPRs: 5, openPRs: 3, issuesClosed: 7, joinedAt: '2024-03-01' },
      { name: 'Jordan Mills', handle: 'jmills', mergedPRs: 4, openPRs: 2, issuesClosed: 5, joinedAt: '2024-03-20' },
      { name: 'Maria Vasquez', handle: 'maria_v', mergedPRs: 2, openPRs: 0, issuesClosed: 4, joinedAt: '2024-01-20' },
    ],
    issueCategories: [
      { category: 'Bug', count: 24, resolutionRate: 71, color: '#ef4444' },
      { category: 'Feature', count: 18, resolutionRate: 44, color: '#3b82f6' },
      { category: 'Enhancement', count: 15, resolutionRate: 80, color: '#22c55e' },
      { category: 'Documentation', count: 8, resolutionRate: 100, color: '#eab308' },
    ],
  },
  '90d': {
    period: '90d',
    activeContributors: 41, activeContributorsChange: 35,
    openPRs: 11, openPRsChange: -2,
    mergedPRs: 124, mergedPRsChange: 48,
    issueResolutionRate: 78, issueResolutionRateChange: 14,
    contributorGrowth: [
      { week: 'Week 1', newContributors: 5, returning: 4 },
      { week: 'Week 2', newContributors: 3, returning: 8 },
      { week: 'Week 3', newContributors: 4, returning: 10 },
      { week: 'Week 4', newContributors: 2, returning: 14 },
      { week: 'Week 5', newContributors: 6, returning: 15 },
      { week: 'Week 6', newContributors: 2, returning: 18 },
      { week: 'Week 7', newContributors: 4, returning: 20 },
      { week: 'Week 8', newContributors: 3, returning: 22 },
    ],
    prFlow: [
      { week: 'Week 1', open: 8, merged: 5, closed: 2 },
      { week: 'Week 2', open: 10, merged: 8, closed: 1 },
      { week: 'Week 3', open: 12, merged: 10, closed: 3 },
      { week: 'Week 4', open: 9, merged: 12, closed: 2 },
      { week: 'Week 5', open: 11, merged: 15, closed: 1 },
      { week: 'Week 6', open: 14, merged: 18, closed: 4 },
      { week: 'Week 7', open: 10, merged: 20, closed: 2 },
      { week: 'Week 8', open: 11, merged: 36, closed: 3 },
    ],
    repoActivity: [
      { repo: 'seiswap-dex', commits: 218, prsOpened: 62, prsMerged: 51, issues: 74 },
      { repo: 'seiswap-sdk', commits: 89, prsOpened: 24, prsMerged: 20, issues: 28 },
      { repo: 'seiswap-subgraph', commits: 41, prsOpened: 10, prsMerged: 8, issues: 12 },
    ],
    topContributors: [
      { name: 'Alex Builder', handle: 'alexbuilder', mergedPRs: 38, openPRs: 3, issuesClosed: 45, joinedAt: '2024-01-15' },
      { name: 'Priya Nair', handle: 'priyanair', mergedPRs: 26, openPRs: 2, issuesClosed: 31, joinedAt: '2024-02-01' },
      { name: 'Sam Okonkwo', handle: 'samokonkwo', mergedPRs: 22, openPRs: 1, issuesClosed: 28, joinedAt: '2024-02-15' },
      { name: 'Chen Wei', handle: 'chenwei_dev', mergedPRs: 17, openPRs: 3, issuesClosed: 22, joinedAt: '2024-03-01' },
      { name: 'Jordan Mills', handle: 'jmills', mergedPRs: 14, openPRs: 2, issuesClosed: 18, joinedAt: '2024-03-20' },
      { name: 'Maria Vasquez', handle: 'maria_v', mergedPRs: 7, openPRs: 0, issuesClosed: 12, joinedAt: '2024-01-20' },
    ],
    issueCategories: [
      { category: 'Bug', count: 72, resolutionRate: 78, color: '#ef4444' },
      { category: 'Feature', count: 58, resolutionRate: 48, color: '#3b82f6' },
      { category: 'Enhancement', count: 42, resolutionRate: 83, color: '#22c55e' },
      { category: 'Documentation', count: 24, resolutionRate: 100, color: '#eab308' },
    ],
  },
};

async function fetchAnalytics(period: AnalyticsPeriod): Promise<AnalyticsData> {
  await new Promise((r) => setTimeout(r, 300));
  return ANALYTICS_DATA[period];
}

export function useAnalytics(period: AnalyticsPeriod = '30d') {
  return useQuery({
    queryKey: ['analytics', period],
    queryFn: () => fetchAnalytics(period),
    staleTime: 60_000,
  });
}
