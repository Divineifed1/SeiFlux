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

const MOCK_CONTRIBUTORS: Contributor[] = [
  {
    id: '1',
    name: 'Alex Chen',
    handle: 'alexc_dev',
    bio: 'Full-stack developer specializing in Rust and TypeScript.',
    skills: ['Rust', 'TypeScript', 'React', 'CosmWasm'],
    github: 'alexc_dev',
    location: 'San Francisco, CA',
    activeProjects: 2,
    completedContribs: 7,
    totalApplications: 12,
    reputation: 94,
    joinedAt: new Date('2024-02-01'),
  },
  {
    id: '2',
    name: 'Sarah Kim',
    handle: 'sarah_builds',
    bio: 'Smart contract auditor and frontend engineer.',
    skills: ['Solidity', 'React', 'TypeScript'],
    github: 'sarah_builds',
    location: 'Seoul, South Korea',
    activeProjects: 1,
    completedContribs: 4,
    totalApplications: 8,
    reputation: 78,
    joinedAt: new Date('2024-03-10'),
  },
  {
    id: '3',
    name: 'Marcus Webb',
    handle: 'mwebb_eng',
    skills: ['Go', 'Rust', 'TypeScript'],
    github: 'mwebb_eng',
    activeProjects: 0,
    completedContribs: 2,
    totalApplications: 5,
    reputation: 51,
    joinedAt: new Date('2024-04-05'),
  },
];

async function fetchContributors(): Promise<Contributor[]> {
  await new Promise((r) => setTimeout(r, 250));
  return MOCK_CONTRIBUTORS;
}

async function fetchContributor(id: string): Promise<Contributor> {
  await new Promise((r) => setTimeout(r, 200));
  const contributor = MOCK_CONTRIBUTORS.find((c) => c.id === id);
  if (!contributor) throw new Error(`Contributor ${id} not found`);
  return contributor;
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
