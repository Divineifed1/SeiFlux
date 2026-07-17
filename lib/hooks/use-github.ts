'use client';
import { useQuery } from '@tanstack/react-query';

export interface GithubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string;
  visibility: 'public' | 'private';
  branch: string;
  synced: boolean;
  lastSync: string;
  url: string;
}

export interface GithubIssue {
  id: string;
  number: number;
  title: string;
  state: 'open' | 'closed';
  labels: string[];
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GithubPR {
  id: string;
  number: number;
  title: string;
  author: string;
  state: 'open' | 'merged' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface GithubContributor {
  login: string;
  commits: number;
  additions: number;
  deletions: number;
}

export interface WeeklyActivity {
  week: string;
  commits: number;
  prsOpened: number;
  prsMerged: number;
  issuesOpened: number;
}

export interface GithubRepoDetail extends GithubRepo {
  contributors: number;
  openPRs: number;
  issues: GithubIssue[];
  pullRequests: GithubPR[];
  contributorList: GithubContributor[];
  activity: WeeklyActivity[];
  recentCommits: { sha: string; message: string; author: string; date: string }[];
  languages: { lang: string; pct: number }[];
}

export interface GithubOrg {
  id: string;
  login: string;
  name: string;
  repoCount: number;
  memberCount: number;
  connected: boolean;
}

async function fetchGithubRepos(): Promise<GithubRepo[]> {
  const response = await fetch('/api/github/repos');
  if (!response.ok) {
    throw new Error('Failed to fetch github repos');
  }
  return response.json();
}

async function fetchGithubRepo(name: string): Promise<GithubRepoDetail> {
  const response = await fetch(`/api/github/repos/${encodeURIComponent(name)}`);
  if (!response.ok) {
    throw new Error(`Repo ${name} not found`);
  }
  return response.json();
}

async function fetchGithubOrgs(): Promise<GithubOrg[]> {
  const response = await fetch('/api/github/orgs');
  if (!response.ok) {
    throw new Error('Failed to fetch github orgs');
  }
  return response.json();
}

export function useGithubRepos() {
  return useQuery({
    queryKey: ['github', 'repos'],
    queryFn: fetchGithubRepos,
    staleTime: 60_000,
  });
}

export function useGithubRepo(name: string) {
  return useQuery({
    queryKey: ['github', 'repos', name],
    queryFn: () => fetchGithubRepo(name),
    enabled: !!name,
    staleTime: 60_000,
  });
}

export function useGithubOrgs() {
  return useQuery({
    queryKey: ['github', 'orgs'],
    queryFn: fetchGithubOrgs,
    staleTime: 60_000,
  });
}
