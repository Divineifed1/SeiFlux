'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth-store';

export type RewardStatus = 'paid' | 'pending' | 'processing';

export interface RewardEntry {
  id: string;
  description: string;
  amount: number;
  status: RewardStatus;
  date: string;
  wave?: string;
  issueTitle?: string;
}

export interface RewardsResult {
  totalEarned: number;
  pending: number;
  availableToClaim: number;
  rank: number;
  entries: RewardEntry[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchRewards(userId: string): Promise<RewardsResult> {
  const res = await fetch(`${API_BASE}/rewards?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error('Failed to fetch rewards');
  return res.json();
}

async function requestRewards(userId: string): Promise<{ message: string; count: number }> {
  const res = await fetch(`${API_BASE}/rewards/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error('Failed to request rewards');
  return res.json();
}

export function useRewards() {
  const user = useAuthStore((s) => s.user);
  const userId = user?.id ?? '';
  return useQuery({
    queryKey: ['rewards', userId],
    queryFn: () => fetchRewards(userId),
    enabled: !!userId,
    staleTime: 30_000,
  });
}

export function useRequestRewards() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const userId = user?.id ?? '';
  return useMutation({
    mutationFn: () => requestRewards(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards', userId] });
    },
  });
}
