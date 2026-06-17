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
  projectCount: number;
  memberCount: number;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Mock data — replace with real API calls
// ---------------------------------------------------------------------------
const MOCK_ORGS: Organization[] = [
  {
    id: '1',
    name: 'SeiSwap Labs',
    slug: 'seiswap-labs',
    description: 'Building the premier DEX and DeFi infrastructure for the Sei ecosystem.',
    githubOrg: 'seiswap-labs',
    website: 'https://seiswap.example.com',
    status: 'active',
    projectCount: 4,
    memberCount: 6,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'SeiFinance',
    slug: 'seifinance',
    description: 'Lending and borrowing protocol natively designed for Sei.',
    status: 'active',
    projectCount: 2,
    memberCount: 3,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'SeiGames',
    slug: 'seigames',
    description: 'On-chain gaming experiences powered by Sei speed.',
    status: 'pending',
    projectCount: 1,
    memberCount: 2,
    createdAt: new Date('2024-03-15'),
  },
];

async function fetchOrganizations(): Promise<Organization[]> {
  // TODO: replace with `fetch('/api/organizations').then(r => r.json())`
  await new Promise((r) => setTimeout(r, 250));
  return MOCK_ORGS;
}

async function fetchOrganization(id: string): Promise<Organization> {
  await new Promise((r) => setTimeout(r, 200));
  const org = MOCK_ORGS.find((o) => o.id === id);
  if (!org) throw new Error(`Organization ${id} not found`);
  return org;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
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
