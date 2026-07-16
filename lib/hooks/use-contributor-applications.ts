'use client';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useAuthStore } from '@/lib/store/auth-store';

export const MAX_WAVE_APPLICATIONS = 10;

export type ContributorApplicationStatus = 'pending' | 'review' | 'approved' | 'rejected' | 'merged' | 'closed';

export type AssignmentStatus = 'assigned_to_you' | 'assigned_to_other' | 'unassigned';

export interface ContributorApplication {
  id: string;
  waveId: string;
  waveName: string;
  issueId: string;
  issueTitle: string;
  projectName:string;
  projectSlug: string;
  status: ContributorApplicationStatus;
  assignedTo: AssignmentStatus;
  appliedAt: Date;
}

export const CURRENT_WAVE = {
  id: 'wave_current',
  name: 'Wave 7',
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export interface ContributorApplicationsResult {
  applications: ContributorApplication[];
  usedSlots: number;
  availableSlots: number;
  totalSlots: number;
  total: number;
  isLoading: boolean;
  error: Error | null;
}

export function useContributorApplications(): ContributorApplicationsResult {
  const user = useAuthStore((s) => s.user);
  const apiUrl = user ? `/api/users/${user.id}/applications` : null;

  const { data: applications = [], error, isLoading } = useSWR<ContributorApplication[]>(apiUrl, fetcher);

  const processedData = useMemo(() => {
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
  }, [applications]);

  return {
    ...processedData,
    isLoading,
    error,
  };
}