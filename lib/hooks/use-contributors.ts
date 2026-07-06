'use client';
import { useQuery } from '@tanstack/react-query';

export interface Contributor {
  id: string;
  name: string;
  handle: string;
  bio?: string;
  skills: string[];
  github?: string;
  website?: string;
  location?: string;
  activeProjects: number;
  completedContribs: number;
  totalApplications: number;
  reputation: number;
  joinedAt: Date;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchContributors(): Promise<Contributor[]> {
  const response = await fetch(`${API_BASE}/users?role=contributor`);
  if (!response.ok) {
    throw new Error('Failed to fetch contributors');
  }
  return response.json();
}

async function fetchContributor(id: string): Promise<Contributor> {
  const response = await fetch(`${API_BASE}/users/${id}`);
  if (!response.ok) {
    throw new Error(`Contributor ${id} not found`);
  }
  return response.json();
}

export function useContributors() {
  return useQuery({
    queryKey: ['contributors'],
    queryFn: fetchContributors,
    staleTime: 60_000,
  });
}

export function useContributor(id: string) {
  return useQuery({
    queryKey: ['contributors', id],
    queryFn: () => fetchContributor(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}