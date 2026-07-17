'use client';
import { useQuery } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface MaintainerAnalyticsData {
  metrics: {
    openIssues: { value: number; change: number };
    applications: { value: number; change: number };
    mergedPRs: { value: number; change: number };
    rewardPool: { value: number; description: string };
  };
  issueStatus: { label: string; count: number; color: string }[];
  projectHealth: { name: string; open: number; applications: number; assigned: number }[];
  topContributors: { name:string; handle: string; assigned: number; merged: number; points: number }[];
}

async function fetchMaintainerAnalytics(): Promise<MaintainerAnalyticsData> {
  const response = await fetch(`${API_BASE}/maintainer/analytics`);
  if (!response.ok) {
    throw new Error('Failed to fetch maintainer analytics');
  }
  return response.json();
}

export function useMaintainerAnalytics() {
  return useQuery({
    queryKey: ['maintainer-analytics'],
    queryFn: fetchMaintainerAnalytics,
    staleTime: 60_000,
  });
}