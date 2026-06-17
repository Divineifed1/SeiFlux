'use client';
import { useQuery } from '@tanstack/react-query';

export type OpportunityType = 'good-first-issue' | 'bounty' | 'documentation' | 'bug-fix' | 'feature';
export type OpportunityStatus = 'open' | 'closed' | 'in-progress';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  organizationName: string;
  type: OpportunityType;
  status: OpportunityStatus;
  difficulty: DifficultyLevel;
  skills: string[];
  bountyAmount?: number;
  bountyToken?: string;
  applicantCount: number;
  viewCount: number;
  daysOpen: number;
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OppApplication {
  id: string;
  applicantName: string;
  applicantHandle: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  appliedAt: string;
  message: string;
}

export interface OpportunityDetail extends Opportunity {
  applications: OppApplication[];
}

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Fix slippage calculation bug on USDC pairs',
    description: 'There is a known bug in the slippage tolerance calculation when swapping USDC pairs. The current implementation uses an incorrect formula that results in higher-than-expected slippage for USDC→SEI trades. The fix involves updating the price impact calculation in the swap router.',
    projectId: '1', projectName: 'SeiSwap DEX', organizationName: 'SeiSwap Labs',
    type: 'bug-fix', status: 'open', difficulty: 'intermediate',
    skills: ['Rust', 'TypeScript', 'DeFi'],
    applicantCount: 4, viewCount: 87, daysOpen: 12,
    requirements: ['Experience with Rust', 'Understanding of AMM mechanics', 'Familiarity with Sei blockchain'],
    createdAt: '2024-06-01', updatedAt: '2024-06-10',
  },
  {
    id: '2',
    title: 'Add concentrated liquidity UI components',
    description: 'Build React components for the concentrated liquidity interface. This includes a range selector for liquidity positions, a price chart with range visualization, and a position summary card. Designs are provided in Figma.',
    projectId: '1', projectName: 'SeiSwap DEX', organizationName: 'SeiSwap Labs',
    type: 'good-first-issue', status: 'open', difficulty: 'beginner',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    applicantCount: 8, viewCount: 134, daysOpen: 8,
    requirements: ['React experience', 'Tailwind CSS knowledge', 'Understanding of DeFi UX'],
    createdAt: '2024-06-05', updatedAt: '2024-06-10',
  },
  {
    id: '3',
    title: 'Implement cross-chain bridge integration',
    description: 'Develop the cross-chain bridge functionality for moving assets between Sei and Ethereum. This requires implementing both the CosmWasm contract logic and the Solidity contracts on the Ethereum side, as well as a relay service.',
    projectId: '1', projectName: 'SeiSwap DEX', organizationName: 'SeiSwap Labs',
    type: 'feature', status: 'in-progress', difficulty: 'advanced',
    skills: ['CosmWasm', 'Rust', 'Solidity', 'DeFi'],
    bountyAmount: 2000, bountyToken: 'SEI',
    applicantCount: 2, viewCount: 62, daysOpen: 5,
    requirements: ['Advanced Rust/CosmWasm experience', 'Cross-chain bridge experience', 'Solidity knowledge'],
    createdAt: '2024-06-08', updatedAt: '2024-06-10',
  },
  {
    id: '4',
    title: 'Write comprehensive SDK documentation',
    description: 'Create detailed documentation for the SeiSwap TypeScript SDK including API reference, code examples for all major functions, integration guides for common use cases, and a getting-started tutorial.',
    projectId: '2', projectName: 'SeiSwap SDK', organizationName: 'SeiSwap Labs',
    type: 'documentation', status: 'open', difficulty: 'beginner',
    skills: ['Technical Writing', 'TypeScript', 'Markdown'],
    bountyAmount: 500, bountyToken: 'SEI',
    applicantCount: 6, viewCount: 103, daysOpen: 15,
    requirements: ['Strong technical writing skills', 'TypeScript knowledge', 'Experience with API documentation'],
    createdAt: '2024-05-28', updatedAt: '2024-06-08',
  },
  {
    id: '5',
    title: 'Optimize gas usage in swap routing',
    description: 'Analyze and optimize the gas costs for multi-hop swap routes. The current implementation has suboptimal gas usage for routes with 3+ hops. The goal is to reduce gas by at least 20% while maintaining the same routing quality.',
    projectId: '1', projectName: 'SeiSwap DEX', organizationName: 'SeiSwap Labs',
    type: 'bounty', status: 'open', difficulty: 'advanced',
    skills: ['Rust', 'CosmWasm', 'Gas Optimization'],
    bountyAmount: 5000, bountyToken: 'SEI',
    applicantCount: 3, viewCount: 156, daysOpen: 20,
    requirements: ['Deep Rust knowledge', 'CosmWasm smart contract experience', 'Gas optimization expertise'],
    createdAt: '2024-05-23', updatedAt: '2024-06-09',
  },
  {
    id: '6',
    title: 'Add TheGraph data indexing for pool events',
    description: 'Extend the existing subgraph to index pool creation, liquidity addition/removal, and swap events. The data should be queryable via GraphQL with filters for time range, pool address, and user address.',
    projectId: '3', projectName: 'SeiSwap Subgraph', organizationName: 'SeiSwap Labs',
    type: 'feature', status: 'open', difficulty: 'intermediate',
    skills: ['AssemblyScript', 'GraphQL', 'TheGraph'],
    applicantCount: 1, viewCount: 45, daysOpen: 7,
    requirements: ['TheGraph protocol knowledge', 'AssemblyScript experience', 'GraphQL schema design'],
    createdAt: '2024-06-06', updatedAt: '2024-06-10',
  },
  {
    id: '7',
    title: 'Fix mobile layout on iOS Safari',
    description: 'Several UI elements are broken on iOS Safari mobile browser. Known issues include the swap input fields overlapping on small screens, the wallet connect button being unclickable, and the token list modal not scrolling properly.',
    projectId: '1', projectName: 'SeiSwap DEX', organizationName: 'SeiSwap Labs',
    type: 'bug-fix', status: 'open', difficulty: 'beginner',
    skills: ['CSS', 'React', 'Mobile Development'],
    applicantCount: 5, viewCount: 78, daysOpen: 10,
    requirements: ['CSS/React experience', 'iOS Safari debugging knowledge', 'Responsive design skills'],
    createdAt: '2024-06-03', updatedAt: '2024-06-09',
  },
  {
    id: '8',
    title: 'SDK TypeScript type improvements',
    description: 'Improve TypeScript type definitions for better developer experience. This includes adding proper generics, stricter union types for token addresses, and comprehensive JSDoc comments for all exported functions.',
    projectId: '2', projectName: 'SeiSwap SDK', organizationName: 'SeiSwap Labs',
    type: 'good-first-issue', status: 'closed', difficulty: 'beginner',
    skills: ['TypeScript'],
    applicantCount: 9, viewCount: 201, daysOpen: 30,
    requirements: ['TypeScript expertise', 'Understanding of SDK patterns'],
    createdAt: '2024-05-01', updatedAt: '2024-06-01',
  },
];

const MOCK_APPLICATIONS: Record<string, OppApplication[]> = {
  '1': [
    { id: 'a1', applicantName: 'Aisha Patel', applicantHandle: 'aishapatel', status: 'accepted', appliedAt: '2024-06-01', message: 'I can fix this. I have 3 years of DeFi Rust experience and have worked on AMM price calculations before.' },
    { id: 'a2', applicantName: 'Jordan Mills', applicantHandle: 'jmills', status: 'reviewing', appliedAt: '2024-06-02', message: 'I have experience with Rust and have worked on AMM protocols before. I reviewed the code and believe the issue is in the price impact calculation.' },
    { id: 'a3', applicantName: 'Yuki Tanaka', applicantHandle: 'yukidev', status: 'pending', appliedAt: '2024-06-05', message: 'Interested in fixing this bug. I have reviewed the codebase and identified the root cause.' },
    { id: 'a4', applicantName: 'Marco Rossi', applicantHandle: 'marcorossi', status: 'pending', appliedAt: '2024-06-07', message: 'I have dealt with similar slippage issues in other DEX projects and have a clear fix in mind.' },
  ],
  '2': [
    { id: 'b1', applicantName: 'Sam Okonkwo', applicantHandle: 'samokonkwo', status: 'reviewing', appliedAt: '2024-06-06', message: 'I love building UI components and have done concentrated liquidity UIs for other protocols.' },
    { id: 'b2', applicantName: 'Elena Koroleva', applicantHandle: 'elenakdev', status: 'pending', appliedAt: '2024-06-07', message: 'Frontend developer with DeFi experience. Would love to contribute.' },
    { id: 'b3', applicantName: 'Alex Chen', applicantHandle: 'alexchen', status: 'pending', appliedAt: '2024-06-08', message: 'I have built similar range selector components for Uniswap v3 forks.' },
  ],
  '3': [
    { id: 'c1', applicantName: 'Ivan Petrov', applicantHandle: 'ivanp', status: 'accepted', appliedAt: '2024-06-08', message: 'I have built cross-chain bridges before and can handle both the CosmWasm and Solidity sides.' },
    { id: 'c2', applicantName: 'Fatima Al-Zahra', applicantHandle: 'fatimazahra', status: 'reviewing', appliedAt: '2024-06-09', message: 'Bridge developer with 4 years of experience across multiple chains.' },
  ],
  '4': [
    { id: 'd1', applicantName: 'Chen Wei', applicantHandle: 'chenwei_dev', status: 'reviewing', appliedAt: '2024-05-30', message: 'Technical writer with TypeScript expertise. I have documented several DeFi SDKs.' },
    { id: 'd2', applicantName: 'Priya Nair', applicantHandle: 'priyanair', status: 'pending', appliedAt: '2024-06-01', message: 'I love writing documentation and am familiar with the SeiSwap SDK.' },
  ],
  '5': [
    { id: 'e1', applicantName: 'Alex Builder', applicantHandle: 'alexbuilder', status: 'reviewing', appliedAt: '2024-05-25', message: 'I have done gas optimization for several CosmWasm contracts and can achieve 25%+ reduction.' },
    { id: 'e2', applicantName: 'Maria Vasquez', applicantHandle: 'maria_v', status: 'pending', appliedAt: '2024-05-28', message: 'Rust optimization specialist. Familiar with the SeiSwap codebase.' },
    { id: 'e3', applicantName: 'Kwame Acheampong', applicantHandle: 'kwamedev', status: 'pending', appliedAt: '2024-06-01', message: 'I have optimized similar routing algorithms and can provide a detailed analysis.' },
  ],
};

async function fetchOpportunities(type?: OpportunityType): Promise<Opportunity[]> {
  await new Promise((r) => setTimeout(r, 250));
  return type ? MOCK_OPPORTUNITIES.filter((o) => o.type === type) : MOCK_OPPORTUNITIES;
}

async function fetchOpportunity(id: string): Promise<OpportunityDetail> {
  await new Promise((r) => setTimeout(r, 200));
  const opp = MOCK_OPPORTUNITIES.find((o) => o.id === id);
  if (!opp) throw new Error(`Opportunity ${id} not found`);
  return { ...opp, applications: MOCK_APPLICATIONS[id] ?? [] };
}

export function useOpportunities(type?: OpportunityType) {
  return useQuery({
    queryKey: type ? ['opportunities', type] : ['opportunities'],
    queryFn: () => fetchOpportunities(type),
    staleTime: 60_000,
  });
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: ['opportunities', id],
    queryFn: () => fetchOpportunity(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}
