import { useQuery } from '@tanstack/react-query';

export type ActivityEventType =
  | 'project_created'
  | 'contributor_joined'
  | 'pr_opened'
  | 'pr_merged'
  | 'issue_posted'
  | 'application_submitted'
  | 'org_created';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  actor: { name: string; handle: string; initials: string };
  target: string;
  targetHref?: string;
  description: string;
  createdAt: string;
  meta?: Record<string, string | number>;
}

const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: 'a1',
    type: 'pr_merged',
    actor: { name: 'Alex Builder', handle: 'alexbuilder', initials: 'AB' },
    target: 'Fix: LP calculation overflow (#112)',
    targetHref: '/dashboard/github/repositories/seiswap-core',
    description: 'merged pull request in seiswap-core',
    createdAt: '2m ago',
    meta: { repo: 'seiswap-core', prNumber: 112 },
  },
  {
    id: 'a2',
    type: 'issue_posted',
    actor: { name: 'SeiSwap Labs', handle: 'seiswap-labs', initials: 'SL' },
    target: 'Build NFT metadata indexer',
    targetHref: '/dashboard/issues/issue-2',
    description: 'posted a new bounty issue',
    createdAt: '15m ago',
    meta: { bounty: '500 SEI' },
  },
  {
    id: 'a3',
    type: 'contributor_joined',
    actor: { name: 'Sarah Dev', handle: 'sarah_builds', initials: 'SD' },
    target: 'SeiSwap Labs',
    targetHref: '/dashboard/organizations/1',
    description: 'joined the organization',
    createdAt: '34m ago',
  },
  {
    id: 'a4',
    type: 'pr_opened',
    actor: { name: 'John Coder', handle: 'john_dev', initials: 'JC' },
    target: 'Add staking rewards endpoint (#89)',
    targetHref: '/dashboard/github/repositories/seiswap-api',
    description: 'opened a pull request in seiswap-api',
    createdAt: '1h ago',
    meta: { repo: 'seiswap-api', prNumber: 89 },
  },
  {
    id: 'a5',
    type: 'project_created',
    actor: { name: 'SeiOracle', handle: 'seioracle', initials: 'SO' },
    target: 'SeiOracle Data Feeds v2',
    targetHref: '/dashboard/projects/proj-3',
    description: 'published a new project',
    createdAt: '2h ago',
  },
  {
    id: 'a6',
    type: 'application_submitted',
    actor: { name: 'Maria Santos', handle: 'mariasantos', initials: 'MS' },
    target: 'Build NFT metadata indexer',
    targetHref: '/dashboard/opportunities/opp-2',
    description: 'applied to an issue',
    createdAt: '3h ago',
  },
  {
    id: 'a7',
    type: 'pr_merged',
    actor: { name: 'James Wilson', handle: 'jwilson', initials: 'JW' },
    target: 'Update oracle price feeds (#76)',
    targetHref: '/dashboard/github/repositories/seioracle-core',
    description: 'merged pull request in seioracle-core',
    createdAt: '4h ago',
    meta: { repo: 'seioracle-core', prNumber: 76 },
  },
  {
    id: 'a8',
    type: 'org_created',
    actor: { name: 'Sei Bridge', handle: 'sei-bridge', initials: 'SB' },
    target: 'Sei Bridge Protocol',
    targetHref: '/dashboard/organizations/3',
    description: 'created a new organization',
    createdAt: '6h ago',
  },
  {
    id: 'a9',
    type: 'issue_posted',
    actor: { name: 'SeiNFT', handle: 'seinft', initials: 'SN' },
    target: 'Improve gas optimization in minting contract',
    targetHref: '/dashboard/issues/issue-4',
    description: 'posted a good-first-issue',
    createdAt: '8h ago',
  },
  {
    id: 'a10',
    type: 'contributor_joined',
    actor: { name: 'Aiko Tanaka', handle: 'aikot', initials: 'AT' },
    target: 'SeiNFT Marketplace',
    targetHref: '/dashboard/organizations/2',
    description: 'joined the organization',
    createdAt: '10h ago',
  },
  {
    id: 'a11',
    type: 'pr_merged',
    actor: { name: 'Sarah Dev', handle: 'sarah_builds', initials: 'SD' },
    target: 'Add dark mode to dashboard (#44)',
    targetHref: '/dashboard/github/repositories/seiswap-interface',
    description: 'merged pull request in seiswap-interface',
    createdAt: '12h ago',
    meta: { repo: 'seiswap-interface', prNumber: 44 },
  },
  {
    id: 'a12',
    type: 'project_created',
    actor: { name: 'SeiSwap Labs', handle: 'seiswap-labs', initials: 'SL' },
    target: 'SeiSwap V3 Interface',
    targetHref: '/dashboard/projects/proj-7',
    description: 'published a new project',
    createdAt: '1d ago',
  },
];

export function useActivityFeed(limit = 20) {
  return useQuery({
    queryKey: ['activity', limit],
    queryFn: async (): Promise<ActivityEvent[]> => {
      await new Promise((r) => setTimeout(r, 400));
      return MOCK_ACTIVITY.slice(0, limit);
    },
    staleTime: 30_000,
  });
}
