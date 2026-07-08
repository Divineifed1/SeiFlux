'use client';
import { useQuery } from '@tanstack/react-query';

export type IssueType = 'good-first-issue' | 'bounty' | 'documentation' | 'bug-fix' | 'feature';
export type IssueStatus = 'open' | 'closed' | 'in-progress';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Issue {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  organizationName: string;
  type: IssueType;
  status: IssueStatus;
  difficulty: DifficultyLevel;
  skills: string[];
  bountyAmount?: number;
  bountyToken?: string;
  applicantCount: number;
  viewCount: number;
  daysOpen: number;
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IssueApplication {
  id: string;
  applicantName: string;
  applicantHandle: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  appliedAt: string;
  message: string;
}

export interface IssueDetail extends Issue {
  applications: IssueApplication[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchIssues(type?: IssueType): Promise<Issue[]> {
  const url = type ? `${API_BASE}/issues?type=${type}` : `${API_BASE}/issues`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch issues');
  }
  return response.json();
}

async function fetchIssue(id: string): Promise<IssueDetail> {
  const response = await fetch(`${API_BASE}/issues/${id}`);
  if (!response.ok) {
    throw new Error(`Issue ${id} not found`);
  }
  return response.json();
}

async function fetchProjects() {
  const response = await fetch(`${API_BASE}/projects`);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
}

export function useIssues(type?: IssueType) {
  return useQuery({
    queryKey: type ? ['issues', type] : ['issues'],
    queryFn: () => fetchIssues(type),
    staleTime: 60_000,
  });
}

export function useIssue(id: string) {
  return useQuery({
    queryKey: ['issues', id],
    queryFn: () => fetchIssue(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 60_000,
  });
}
