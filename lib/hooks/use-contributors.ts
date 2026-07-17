'use client';
import { useQuery } from '@tanstack/react-query';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Contributor {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  skills: string[];
  activeProjects: number;
  completedContribs: number;
  reputation: number;
  github: string;
}

export interface ContributorMetrics {
  total: { value: number; change: number };
  active: { value: number };
  completed: { value: number; change: number };
}

async function fetchContributors(): Promise<Contributor[]> {
  const response = await fetch(`${API_BASE}/contributors`);
  if (!response.ok) {
    throw new Error('Failed to fetch contributors');
  }
  return response.json();
}

async function fetchContributorMetrics(): Promise<ContributorMetrics> {
  const response = await fetch(`${API_BASE}/contributors/metrics`);
  if (!response.ok) {
    throw new Error('Failed to fetch contributor metrics');
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

export function useContributorMetrics() {
  return useQuery({
    queryKey: ['contributor-metrics'],
    queryFn: fetchContributorMetrics,
    staleTime: 60_000,
  });
}