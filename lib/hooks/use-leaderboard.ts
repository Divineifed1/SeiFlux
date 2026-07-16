'use client';
import { useMemo } from 'react';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  handle: string;
  points: number;
  issuesCompleted: number;
  mergedPRs: number;
  initials: string;
}

export interface WaveSummary {
  id: string;
  name: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface LeaderboardData {
  waves: WaveSummary[];
  perWave: Record<string, LeaderboardEntry[]>;
  allWaves: LeaderboardEntry[];
}

interface Contributor {
  id: string;
  name: string;
  handle: string;
}



import { useQuery } from '@tanstack/react-query';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchLeaderboardData(): Promise<LeaderboardData> {
  const response = await fetch(`${API_URL}/leaderboard`);
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }
  return response.json();
}

export function useLeaderboard() {
  return useQuery<LeaderboardData>({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderboardData,
    staleTime: 60_000, // 1 minute
    initialData: { waves: [], perWave: {}, allWaves: [] },
  });
}