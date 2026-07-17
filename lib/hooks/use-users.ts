'use client';
import { useQuery } from '@tanstack/react-query';

export type UserRole = 'admin' | 'maintainer' | 'contributor';

export interface PlatformUser {
  id: string;
  name: string;
  handle?: string;
  email?: string;
  role: UserRole;
  status?: 'active' | 'pending' | 'suspended';
  joinedAt?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchUsers(): Promise<PlatformUser[]> {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 60_000,
  });
}
