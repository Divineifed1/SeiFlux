'use client';
import { useQuery } from '@tanstack/react-query';

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  organizationId?: string;
  status: 'approved' | 'pending' | 'draft' | 'rejected' | 'suspended';
  tags?: string[];
  tech?: string[];
  stars?: number;
  forks?: number;
  contributors?: number;
  openOpps?: number;
  createdAt?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchProjects(orgId?: string): Promise<Project[]> {
  const url = orgId ? `${API_BASE}/projects?orgId=${orgId}` : `${API_BASE}/projects`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
}

async function fetchProject(slug: string): Promise<Project> {
  const response = await fetch(`${API_BASE}/projects/by-slug/${slug}`);
  if (!response.ok) {
    throw new Error(`Project ${slug} not found`);
  }
  return response.json();
}

export function useProjects(orgId?: string) {
  return useQuery({
    queryKey: orgId ? ['projects', orgId] : ['projects'],
    queryFn: () => fetchProjects(orgId),
    staleTime: 60_000,
  });
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: ['projects', '_', slug],
    queryFn: () => fetchProject(slug),
    enabled: !!slug,
    staleTime: 60_000,
  });
}