'use client';
import { useQuery } from '@tanstack/react-query';

export type OpportunityType = 'good-first-issue' | 'bounty' | 'documentation' | 'bug-fix' | 'feature';
export type OpportunityStatus = 'open' | 'closed' | 'in-progress';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  organizationName: string;
  type: OpportunityType;
  status: OpportunityStatus;
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

export interface OppApplication {
  id: string;
  applicantName: string;
  applicantHandle: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  appliedAt: string;
  message: string;
}

export interface OpportunityDetail extends Opportunity {
  applications: OppApplication[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchOpportunities(type?: OpportunityType): Promise<Opportunity[]> {
  const url = type ? `${API_BASE}/opportunities?type=${type}` : `${API_BASE}/opportunities`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch opportunities');
  }
  return response.json();
}

async function fetchOpportunity(id: string): Promise<OpportunityDetail> {
  const response = await fetch(`${API_BASE}/opportunities/${id}`);
  if (!response.ok) {
    throw new Error(`Opportunity ${id} not found`);
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

export function useOpportunities(type?: OpportunityType) {
  return useQuery({
    queryKey: type ? ['opportunities', type] : ['opportunities'],
    queryFn: () => fetchOpportunities(type),
    staleTime: 60_000,
  });
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: ['opportunities', id],
    queryFn: () => fetchOpportunity(id),
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