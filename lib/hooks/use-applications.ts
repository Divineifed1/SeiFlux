'use client';
import { useQuery } from '@tanstack/react-query';

export type ApplicationStatus = 'pending' | 'review' | 'approved' | 'rejected';

export interface Application {
  id: string;
  projectId: string;
  projectName: string;
  issueId: string;
  issueTitle: string;
  contributorId: string;
  contributorName: string;
  contributorHandle: string;
  coverNote?: string;
  status: ApplicationStatus;
  skills: string[];
  appliedAt: Date;
  updatedAt: Date;
}

const MOCK_APPLICATIONS: Application[] = [
  {
    id: '1',
    projectId: '1',
    projectName: 'SeiSwap DEX',
    issueId: 'issue_1',
    issueTitle: 'Build analytics dashboard',
    contributorId: '3',
    contributorName: 'Marcus Webb',
    contributorHandle: 'mwebb_eng',
    coverNote: "I have built similar dashboards for EVM protocols and I'm excited about Sei.",
    status: 'pending',
    skills: ['TypeScript', 'React'],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: '2',
    projectId: '2',
    projectName: 'SeiLend Protocol',
    issueId: 'issue_2',
    issueTitle: 'Improve indexer query performance',
    contributorId: '2',
    contributorName: 'Sarah Kim',
    contributorHandle: 'sarah_builds',
    status: 'review',
    skills: ['Go', 'PostgreSQL'],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: '3',
    projectId: '1',
    projectName: 'SeiSwap DEX',
    issueTitle: 'Fix slippage calculation',
    issueId: 'issue_3',
    contributorId: '1',
    contributorName: 'Alex Chen',
    contributorHandle: 'alexc_dev',
    status: 'approved',
    skills: ['Rust', 'CosmWasm'],
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
];

async function fetchApplications(projectId?: string): Promise<Application[]> {
  await new Promise((r) => setTimeout(r, 250));
  return projectId
    ? MOCK_APPLICATIONS.filter((a) => a.projectId === projectId)
    : MOCK_APPLICATIONS;
}

export function useApplications(projectId?: string) {
  return useQuery({
    queryKey: projectId ? ['applications', projectId] : ['applications'],
    queryFn: () => fetchApplications(projectId),
    staleTime: 30_000,
  });
}
