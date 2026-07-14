'use client';
import { useMemo } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

export type RewardStatus = 'paid' | 'pending' | 'processing';

export interface RewardEntry {
  id: string;
  description: string;
  amount: number;
  status: RewardStatus;
  date: Date;
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

const MOCK_REWARDS: RewardEntry[] = [
  {
    id: 'rw_1',
    description: 'Bounty payout — Create SeiSwap SDK usage examples',
    amount: 320,
    status: 'paid',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    wave: 'Wave 6',
    issueTitle: 'Create SeiSwap SDK usage examples',
  },
  {
    id: 'rw_2',
    description: 'Bounty payout — Optimise RPC batch calls',
    amount: 180,
    status: 'pending',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
    wave: 'Wave 7',
    issueTitle: 'Optimise RPC batch calls',
  },
  {
    id: 'rw_3',
    description: 'Review bonus — Wave 7 participation',
    amount: 50,
    status: 'processing',
    date: new Date(Date.now() - 1000 * 60 * 60 * 12),
    wave: 'Wave 7',
  },
  {
    id: 'rw_4',
    description: 'Bounty payout — Fix slippage calculation edge case',
    amount: 140,
    status: 'pending',
    date: new Date(Date.now() - 1000 * 60 * 60 * 8),
    wave: 'Wave 7',
    issueTitle: 'Fix slippage calculation edge case',
  },
  {
    id: 'rw_5',
    description: 'Bounty payout — SeiSwap router refactor',
    amount: 260,
    status: 'paid',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21),
    wave: 'Wave 5',
    issueTitle: 'SeiSwap router refactor',
  },
];

export function useRewards(): RewardsResult {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    void user;
    const totalEarned = MOCK_REWARDS.filter((r) => r.status === 'paid').reduce(
      (sum, r) => sum + r.amount,
      0
    );
    const pending = MOCK_REWARDS.filter((r) => r.status !== 'paid').reduce(
      (sum, r) => sum + r.amount,
      0
    );
    const availableToClaim = MOCK_REWARDS.filter((r) => r.status === 'pending').reduce(
      (sum, r) => sum + r.amount,
      0
    );

    return {
      totalEarned,
      pending,
      availableToClaim,
      rank: 14,
      entries: MOCK_REWARDS,
    };
  }, [user]);
}
