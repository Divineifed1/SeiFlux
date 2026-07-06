'use client';
import { useQuery } from '@tanstack/react-query';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  githubOrg?: string;
  website?: string;
  status: 'active' | 'pending' | 'suspended';
  projectCount?: number;
  memberCount?: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchOrganizations(): Promise<Organization[]> {
  const response = await fetch(`${API_BASE}/organizations`);
  if (!response.ok) {
    throw new Error('Failed to fetch organizations');
  }
  return response.json();
}

async function fetchOrganization(id: string): Promise<Organization> {
  const response = await fetch(`${API_BASE}/organizations/${id}`);
  if (!response.ok) {
    throw new Error(`Organization ${id} not found`);
  }
  return response.json();
}

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations,
    staleTime: 60_000,
  });
}

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => fetchOrganization(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}