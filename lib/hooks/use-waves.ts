'use client';
import { useQuery } from '@tanstack/react-query';
import type { Wave } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchWaves(): Promise<Wave[]> {
  const response = await fetch(`${API_BASE}/waves`);
  if (!response.ok) {
    throw new Error('Failed to fetch waves');
  }
  return response.json();
}

async function fetchCurrentWave(): Promise<Wave | null> {
  const response = await fetch(`${API_BASE}/waves/current`);
  if (!response.ok) {
    return null;
  }
  return response.json();
}

export function useWaves() {
  return useQuery({
    queryKey: ['waves'],
    queryFn: fetchWaves,
    staleTime: 60_000,
  });
}

export function useCurrentWave() {
  return useQuery({
    queryKey: ['waves', 'current'],
    queryFn: fetchCurrentWave,
    staleTime: 30_000,
  });
}
