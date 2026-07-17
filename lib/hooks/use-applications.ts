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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchApplications(projectId?: string): Promise<Application[]> {
  const url = projectId
    ? `${API_BASE}/applications?projectId=${encodeURIComponent(projectId)}`
    : `${API_BASE}/applications`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }
  return response.json();
}

export function useApplications(projectId?: string) {
  return useQuery({
    queryKey: projectId ? ['applications', projectId] : ['applications'],
    queryFn: () => fetchApplications(projectId),
    staleTime: 30_000,
  });
}
