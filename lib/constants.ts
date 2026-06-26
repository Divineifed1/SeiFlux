export const APP_NAME = 'SeiFlux';
export const APP_DESCRIPTION =
  'The platform where maintainers building on the Sei blockchain onboard projects and attract contributors.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
] as const;

export const SIDEBAR_NAV = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    ],
  },
  {
    title: 'Manage',
    items: [
      { label: 'Organizations', href: '/organizations', icon: 'Building2' },
      { label: 'Projects', href: '/projects', icon: 'FolderKanban' },
      { label: 'Contributors', href: '/contributors', icon: 'Users' },
      { label: 'Applications', href: '/applications', icon: 'FileText' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { label: 'GitHub', href: '/github', icon: 'Github' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Settings', href: '/settings', icon: 'Settings' },
    ],
  },
] as const;

export const USER_ROLES = ['admin', 'maintainer', 'contributor'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const PROJECT_STATUSES = ['draft', 'pending', 'approved', 'rejected', 'suspended'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const APPLICATION_STATUSES = ['pending', 'review', 'approved', 'rejected'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const TECH_TAGS = [
  'Rust',
  'TypeScript',
  'Solidity',
  'Python',
  'Go',
  'React',
  'Next.js',
  'CosmWasm',
  'Move',
  'Cairo',
  'Anchor',
  'Hardhat',
  'Foundry',
  'Web3.js',
  'ethers.js',
  'viem',
  'wagmi',
] as const;

export const SEI_ECOSYSTEM_TAGS = [
  'DeFi',
  'NFT',
  'Gaming',
  'Infrastructure',
  'Tooling',
  'Bridge',
  'Oracle',
  'Wallet',
  'Analytics',
  'Indexer',
] as const;
