'use client';
import { useMemo } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';

export const MAX_WAVE_APPLICATIONS = 10;

export type ContributorApplicationStatus = 'pending' | 'review' | 'approved' | 'rejected';

export type AssignmentStatus = 'assigned_to_you' | 'assigned_to_other' | 'unassigned';

export interface ContributorApplication {
  id: string;
  waveId: string;
  waveName: string;
  issueId: string;
  issueTitle: string;
  projectName: string;
  projectSlug: string;
  status: ContributorApplicationStatus;
  assignedTo: AssignmentStatus;
  appliedAt: Date;
}

export const CURRENT_WAVE = {
  id: 'wave_current',
  name: 'Wave 7',
};

const MOCK_APPLICATIONS: ContributorApplication[] = [
  {
    id: 'ca_1',
    waveId: CURRENT_WAVE.id,
    waveName: CURRENT_WAVE.name,
    issueId: 'issue_1',
    issueTitle: 'Implement price impact warnings in swap UI',
    projectName: 'SeiSwap DEX',
    projectSlug: 'seiswap-dex',
    status: 'review',
    assignedTo: 'unassigned',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    id: 'ca_2',
    waveId: CURRENT_WAVE.id,
    waveName: CURRENT_WAVE.name,
    issueId: 'issue_2',
    issueTitle: 'Fix slippage calculation edge case',
    projectName: 'SeiSwap DEX',
    projectSlug: 'seiswap-dex',
    status: 'pending',
    assignedTo: 'unassigned',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
  },
  {
    id: 'ca_3',
    waveId: CURRENT_WAVE.id,
    waveName: CURRENT_WAVE.name,
    issueId: 'issue_3',
    issueTitle: 'Improve liquidity position documentation',
    projectName: 'SeiSwap DEX',
    projectSlug: 'seiswap-dex',
    status: 'review',
    assignedTo: 'unassigned',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: 'ca_4',
    waveId: CURRENT_WAVE.id,
    waveName: CURRENT_WAVE.name,
    issueId: 'issue_4',
    issueTitle: 'Build position analytics dashboard',
    projectName: 'SeiSwap DEX',
    projectSlug: 'seiswap-dex',
    status: 'pending',
    assignedTo: 'unassigned',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: 'ca_5',
    waveId: CURRENT_WAVE.id,
    waveName: CURRENT_WAVE.name,
    issueId: 'issue_5',
    issueTitle: 'Add mobile responsive header',
    projectName: 'SeiLend Protocol',
    projectSlug: 'seilend-protocol',
    status: 'pending',
    assignedTo: 'unassigned',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: 'ca_6',
    waveId: CURRENT_WAVE.id,
    waveName: CURRENT_WAVE.name,
    issueId: 'issue_6',
    issueTitle: 'Optimise RPC batch calls',
    projectName: 'SeiLend Protocol',
    projectSlug: 'seilend-protocol',
    status: 'review',
    assignedTo: 'unassigned',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
  },
  {
    id: 'ca_7',
    waveId: CURRENT_WAVE.id,
    waveName: CURRENT_WAVE.name,
    issueId: 'issue_7',
    issueTitle: 'Write integration tests for router',
    projectName: 'SeiSwap SDK',
    projectSlug: 'seiswap-sdk',
    status: 'pending',
    assignedTo: 'unassigned',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: 'ca_8',
    waveId: CURRENT_WAVE.id,
    waveName: CURRENT_WAVE.name,
    issueId: 'issue_8',
    issueTitle: 'Create SeiSwap SDK usage examples',
    projectName: 'SeiSwap SDK',
    projectSlug: 'seiswap-sdk',
    status: 'approved',
    assignedTo: 'assigned_to_you',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
  },
  {
    id: 'ca_9',
    waveId: CURRENT_WAVE.id,
    waveName: CURRENT_WAVE.name,
    issueId: 'issue_9',
    issueTitle: 'Refactor event indexer',
    projectName: 'SeiIndexer',
    projectSlug: 'sei-indexer',
    status: 'rejected',
    assignedTo: 'assigned_to_other',
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
  },
];

export interface ContributorApplicationsResult {
  applications: ContributorApplication[];
  usedSlots: number;
  availableSlots: number;
  totalSlots: number;
  total: number;
}

export function useContributorApplications(): ContributorApplicationsResult {
  const user = useAuthStore((s) => s.user);

  return useMemo(() => {
    void user;
    const applications = MOCK_APPLICATIONS;
    const usedSlots = applications.filter(
      (a) => a.status === 'pending' || a.status === 'review'
    ).length;
    const availableSlots = Math.max(0, MAX_WAVE_APPLICATIONS - usedSlots);

    return {
      applications,
      usedSlots,
      availableSlots,
      totalSlots: MAX_WAVE_APPLICATIONS,
      total: applications.length,
    };
  }, [user]);
}
