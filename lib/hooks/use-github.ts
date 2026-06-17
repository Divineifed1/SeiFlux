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

const MOCK_REPOS: GithubRepo[] = [
  {
    id: '1', name: 'seiswap-dex', fullName: 'seiswap-labs/seiswap-dex',
    description: 'Main DEX protocol contracts and frontend',
    stars: 1243, forks: 89, openIssues: 14, language: 'TypeScript',
    visibility: 'public', branch: 'main', synced: true, lastSync: '2 min ago',
    url: 'https://github.com/seiswap-labs/seiswap-dex',
  },
  {
    id: '2', name: 'seiswap-sdk', fullName: 'seiswap-labs/seiswap-sdk',
    description: 'TypeScript SDK for SeiSwap integration',
    stars: 348, forks: 31, openIssues: 6, language: 'TypeScript',
    visibility: 'public', branch: 'main', synced: true, lastSync: '5 min ago',
    url: 'https://github.com/seiswap-labs/seiswap-sdk',
  },
  {
    id: '3', name: 'seiswap-subgraph', fullName: 'seiswap-labs/seiswap-subgraph',
    description: 'TheGraph subgraph for SeiSwap events',
    stars: 89, forks: 11, openIssues: 3, language: 'AssemblyScript',
    visibility: 'public', branch: 'main', synced: false, lastSync: '2 hours ago',
    url: 'https://github.com/seiswap-labs/seiswap-subgraph',
  },
];

const MOCK_REPO_DETAILS: Record<string, GithubRepoDetail> = {
  'seiswap-dex': {
    ...MOCK_REPOS[0],
    contributors: 18,
    openPRs: 7,
    issues: [
      { id: 'i1', number: 142, title: 'Fix slippage calculation on USDC pairs', state: 'open', labels: ['bug', 'high-priority'], assignee: 'alexbuilder', createdAt: '2024-06-01', updatedAt: '2024-06-10' },
      { id: 'i2', number: 138, title: 'Add concentrated liquidity UI', state: 'open', labels: ['feature', 'good-first-issue'], createdAt: '2024-05-28', updatedAt: '2024-06-08' },
      { id: 'i3', number: 133, title: 'Improve error messages for failed txs', state: 'open', labels: ['enhancement'], assignee: 'priyanair', createdAt: '2024-05-20', updatedAt: '2024-06-05' },
      { id: 'i4', number: 129, title: 'Mobile layout broken on iOS Safari', state: 'open', labels: ['bug', 'ui'], createdAt: '2024-05-15', updatedAt: '2024-06-01' },
      { id: 'i5', number: 120, title: 'Add dark mode support', state: 'closed', labels: ['enhancement'], assignee: 'chenwei_dev', createdAt: '2024-05-01', updatedAt: '2024-05-25' },
      { id: 'i6', number: 115, title: 'Integrate analytics dashboard', state: 'open', labels: ['feature'], createdAt: '2024-04-28', updatedAt: '2024-05-30' },
      { id: 'i7', number: 110, title: 'Gas optimization for swap route', state: 'open', labels: ['enhancement', 'performance'], assignee: 'samokonkwo', createdAt: '2024-04-20', updatedAt: '2024-05-28' },
      { id: 'i8', number: 105, title: 'Refactor pool state management', state: 'closed', labels: ['refactor'], createdAt: '2024-04-10', updatedAt: '2024-05-10' },
    ],
    pullRequests: [
      { id: 'pr1', number: 88, title: 'feat: add multi-hop routing', author: 'alexbuilder', state: 'open', createdAt: '2024-06-08', updatedAt: '2024-06-10' },
      { id: 'pr2', number: 85, title: 'fix: correct token price oracle', author: 'priyanair', state: 'merged', createdAt: '2024-06-01', updatedAt: '2024-06-05' },
      { id: 'pr3', number: 82, title: 'chore: update dependencies', author: 'chenwei_dev', state: 'merged', createdAt: '2024-05-28', updatedAt: '2024-06-01' },
      { id: 'pr4', number: 79, title: 'feat: add liquidity migration tool', author: 'samokonkwo', state: 'open', createdAt: '2024-05-25', updatedAt: '2024-06-02' },
      { id: 'pr5', number: 76, title: 'fix: handle zero-liquidity edge case', author: 'jmills', state: 'closed', createdAt: '2024-05-20', updatedAt: '2024-05-22' },
    ],
    contributorList: [
      { login: 'alexbuilder', commits: 142, additions: 8420, deletions: 3120 },
      { login: 'priyanair', commits: 89, additions: 5240, deletions: 1890 },
      { login: 'samokonkwo', commits: 67, additions: 4100, deletions: 1450 },
      { login: 'chenwei_dev', commits: 54, additions: 3200, deletions: 980 },
      { login: 'jmills', commits: 38, additions: 2100, deletions: 720 },
      { login: 'maria_v', commits: 22, additions: 1400, deletions: 490 },
    ],
    activity: [
      { week: 'Week 1', commits: 12, prsOpened: 3, prsMerged: 2, issuesOpened: 4 },
      { week: 'Week 2', commits: 18, prsOpened: 4, prsMerged: 3, issuesOpened: 6 },
      { week: 'Week 3', commits: 9, prsOpened: 2, prsMerged: 4, issuesOpened: 3 },
      { week: 'Week 4', commits: 24, prsOpened: 5, prsMerged: 3, issuesOpened: 7 },
      { week: 'Week 5', commits: 15, prsOpened: 3, prsMerged: 2, issuesOpened: 5 },
      { week: 'Week 6', commits: 21, prsOpened: 6, prsMerged: 5, issuesOpened: 4 },
      { week: 'Week 7', commits: 8, prsOpened: 2, prsMerged: 1, issuesOpened: 2 },
      { week: 'Week 8', commits: 19, prsOpened: 4, prsMerged: 3, issuesOpened: 6 },
    ],
    recentCommits: [
      { sha: 'a1b2c3d', message: 'feat: implement concentrated liquidity math', author: 'alexbuilder', date: '2 hours ago' },
      { sha: 'e4f5g6h', message: 'fix: correct slippage tolerance calculation', author: 'priyanair', date: '5 hours ago' },
      { sha: 'i7j8k9l', message: 'chore: bump @sei-js to v2.4.0', author: 'chenwei_dev', date: '1 day ago' },
      { sha: 'm0n1o2p', message: 'docs: add swap API documentation', author: 'jmills', date: '2 days ago' },
    ],
    languages: [
      { lang: 'TypeScript', pct: 68 },
      { lang: 'Rust', pct: 22 },
      { lang: 'CSS', pct: 7 },
      { lang: 'Other', pct: 3 },
    ],
  },
  'seiswap-sdk': {
    ...MOCK_REPOS[1],
    contributors: 8,
    openPRs: 3,
    issues: [
      { id: 'si1', number: 51, title: 'Add wallet connection helpers', state: 'open', labels: ['feature'], createdAt: '2024-05-01', updatedAt: '2024-06-01' },
      { id: 'si2', number: 50, title: 'Improve TypeScript types for Pool', state: 'open', labels: ['enhancement'], createdAt: '2024-05-05', updatedAt: '2024-06-02' },
      { id: 'si3', number: 48, title: 'Fix price impact calculation', state: 'open', labels: ['bug'], createdAt: '2024-05-10', updatedAt: '2024-06-03' },
      { id: 'si4', number: 45, title: 'Add route optimization', state: 'open', labels: ['feature'], createdAt: '2024-05-15', updatedAt: '2024-06-04' },
      { id: 'si5', number: 42, title: 'Export missing types', state: 'closed', labels: ['bug'], createdAt: '2024-04-20', updatedAt: '2024-05-20' },
      { id: 'si6', number: 40, title: 'Update README with examples', state: 'closed', labels: ['documentation'], createdAt: '2024-04-15', updatedAt: '2024-05-15' },
    ],
    pullRequests: [
      { id: 'spr1', number: 41, title: 'feat: add swap hooks', author: 'maria_v', state: 'open', createdAt: '2024-06-05', updatedAt: '2024-06-10' },
      { id: 'spr2', number: 39, title: 'fix: type exports', author: 'alexbuilder', state: 'merged', createdAt: '2024-05-28', updatedAt: '2024-06-01' },
      { id: 'spr3', number: 37, title: 'chore: update peer deps', author: 'samokonkwo', state: 'merged', createdAt: '2024-05-20', updatedAt: '2024-05-25' },
      { id: 'spr4', number: 35, title: 'feat: pool query helpers', author: 'alexbuilder', state: 'open', createdAt: '2024-05-15', updatedAt: '2024-05-22' },
      { id: 'spr5', number: 32, title: 'fix: handle undefined slippage', author: 'maria_v', state: 'closed', createdAt: '2024-05-10', updatedAt: '2024-05-12' },
    ],
    contributorList: [
      { login: 'alexbuilder', commits: 58, additions: 3200, deletions: 1100 },
      { login: 'maria_v', commits: 34, additions: 2100, deletions: 780 },
      { login: 'samokonkwo', commits: 22, additions: 1400, deletions: 520 },
    ],
    activity: [
      { week: 'Week 1', commits: 6, prsOpened: 2, prsMerged: 1, issuesOpened: 2 },
      { week: 'Week 2', commits: 9, prsOpened: 2, prsMerged: 2, issuesOpened: 3 },
      { week: 'Week 3', commits: 5, prsOpened: 1, prsMerged: 1, issuesOpened: 1 },
      { week: 'Week 4', commits: 11, prsOpened: 3, prsMerged: 2, issuesOpened: 4 },
      { week: 'Week 5', commits: 7, prsOpened: 1, prsMerged: 1, issuesOpened: 2 },
      { week: 'Week 6', commits: 13, prsOpened: 2, prsMerged: 3, issuesOpened: 3 },
      { week: 'Week 7', commits: 4, prsOpened: 1, prsMerged: 0, issuesOpened: 1 },
      { week: 'Week 8', commits: 8, prsOpened: 2, prsMerged: 1, issuesOpened: 2 },
    ],
    recentCommits: [
      { sha: 'a1b2c3d', message: 'feat: add swap hooks', author: 'maria_v', date: '3 hours ago' },
      { sha: 'e4f5g6h', message: 'fix: type exports', author: 'alexbuilder', date: '1 day ago' },
      { sha: 'i7j8k9l', message: 'chore: update peer deps', author: 'samokonkwo', date: '3 days ago' },
    ],
    languages: [
      { lang: 'TypeScript', pct: 92 },
      { lang: 'JavaScript', pct: 8 },
    ],
  },
  'seiswap-subgraph': {
    ...MOCK_REPOS[2],
    contributors: 3,
    openPRs: 1,
    issues: [
      { id: 'gi1', number: 22, title: 'Index pool creation events', state: 'open', labels: ['feature'], createdAt: '2024-05-10', updatedAt: '2024-06-01' },
      { id: 'gi2', number: 20, title: 'Fix swap event schema', state: 'open', labels: ['bug'], createdAt: '2024-05-05', updatedAt: '2024-05-30' },
      { id: 'gi3', number: 18, title: 'Add liquidity events', state: 'open', labels: ['feature'], createdAt: '2024-04-28', updatedAt: '2024-05-25' },
    ],
    pullRequests: [
      { id: 'gpr1', number: 15, title: 'feat: add pool events indexing', author: 'chenwei_dev', state: 'open', createdAt: '2024-06-01', updatedAt: '2024-06-08' },
    ],
    contributorList: [
      { login: 'chenwei_dev', commits: 28, additions: 1800, deletions: 600 },
      { login: 'jmills', commits: 12, additions: 740, deletions: 210 },
      { login: 'samokonkwo', commits: 5, additions: 280, deletions: 90 },
    ],
    activity: [
      { week: 'Week 1', commits: 3, prsOpened: 1, prsMerged: 0, issuesOpened: 1 },
      { week: 'Week 2', commits: 5, prsOpened: 0, prsMerged: 1, issuesOpened: 0 },
      { week: 'Week 3', commits: 2, prsOpened: 1, prsMerged: 0, issuesOpened: 1 },
      { week: 'Week 4', commits: 7, prsOpened: 1, prsMerged: 1, issuesOpened: 2 },
      { week: 'Week 5', commits: 3, prsOpened: 0, prsMerged: 0, issuesOpened: 0 },
      { week: 'Week 6', commits: 6, prsOpened: 1, prsMerged: 1, issuesOpened: 1 },
      { week: 'Week 7', commits: 2, prsOpened: 0, prsMerged: 0, issuesOpened: 0 },
      { week: 'Week 8', commits: 4, prsOpened: 0, prsMerged: 1, issuesOpened: 1 },
    ],
    recentCommits: [
      { sha: 'x1y2z3a', message: 'index: add liquidity events', author: 'chenwei_dev', date: '3 days ago' },
      { sha: 'b4c5d6e', message: 'fix: swap event schema', author: 'jmills', date: '5 days ago' },
    ],
    languages: [
      { lang: 'AssemblyScript', pct: 85 },
      { lang: 'TypeScript', pct: 15 },
    ],
  },
};

const MOCK_ORGS: GithubOrg[] = [
  { id: '1', login: 'seiswap-labs', name: 'SeiSwap Labs', repoCount: 3, memberCount: 6, connected: true },
  { id: '2', login: 'seifinance', name: 'SeiFinance', repoCount: 5, memberCount: 4, connected: false },
];

async function fetchGithubRepos(): Promise<GithubRepo[]> {
  await new Promise((r) => setTimeout(r, 250));
  return MOCK_REPOS;
}

async function fetchGithubRepo(name: string): Promise<GithubRepoDetail> {
  await new Promise((r) => setTimeout(r, 300));
  const repo = MOCK_REPO_DETAILS[name];
  if (!repo) throw new Error(`Repo ${name} not found`);
  return repo;
}

async function fetchGithubOrgs(): Promise<GithubOrg[]> {
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_ORGS;
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
