'use client';
import { useQuery } from '@tanstack/react-query';

export interface Project {
  id: string;
  slug: string;
  title: string;
  organizationId: string;
  organizationName: string;
  description: string;
  repoUrl?: string;
  websiteUrl?: string;
  status: 'approved' | 'pending' | 'draft' | 'rejected';
  tags: string[];
  techStack: string[];
  starCount: number;
  forkCount: number;
  contributorCount: number;
  openOpportunities: number;
  createdAt: Date;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    slug: 'seiswap-dex',
    title: 'SeiSwap DEX',
    organizationId: '1',
    organizationName: 'SeiSwap Labs',
    description: 'High-performance decentralized exchange with concentrated liquidity on Sei.',
    repoUrl: 'https://github.com/seiswap/seiswap-dex',
    websiteUrl: 'https://seiswap.example.com',
    status: 'approved',
    tags: ['DeFi', 'Infrastructure'],
    techStack: ['Rust', 'TypeScript', 'React'],
    starCount: 284,
    forkCount: 47,
    contributorCount: 12,
    openOpportunities: 4,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    slug: 'seilend-protocol',
    title: 'SeiLend Protocol',
    organizationId: '2',
    organizationName: 'SeiFinance',
    description: 'Lending and borrowing with dynamic interest rates and cross-collateral positions.',
    status: 'approved',
    tags: ['DeFi'],
    techStack: ['CosmWasm', 'Rust', 'Next.js'],
    starCount: 142,
    forkCount: 23,
    contributorCount: 7,
    openOpportunities: 2,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: '3',
    slug: 'sei-game-engine',
    title: 'Sei Game Engine',
    organizationId: '3',
    organizationName: 'SeiGames',
    description: 'On-chain game state management framework optimized for Sei latency.',
    status: 'pending',
    tags: ['Gaming', 'Infrastructure'],
    techStack: ['Rust', 'TypeScript'],
    starCount: 0,
    forkCount: 0,
    contributorCount: 2,
    openOpportunities: 0,
    createdAt: new Date('2024-03-20'),
  },
];

async function fetchProjects(orgId?: string): Promise<Project[]> {
  await new Promise((r) => setTimeout(r, 250));
  return orgId ? MOCK_PROJECTS.filter((p) => p.organizationId === orgId) : MOCK_PROJECTS;
}

async function fetchProject(slug: string): Promise<Project> {
  await new Promise((r) => setTimeout(r, 200));
  const project = MOCK_PROJECTS.find((p) => p.slug === slug);
  if (!project) throw new Error(`Project ${slug} not found`);
  return project;
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
