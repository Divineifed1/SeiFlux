import type { Metadata } from 'next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/design-system/page-header';
import { CreateProjectDialog } from '@/components/dialogs/create-project-dialog';
import { ProjectsTable } from './projects-table';

export const metadata: Metadata = { title: 'Projects' };

const PROJECTS = [
  {
    id: '1', name: 'SeiSwap DEX', org: 'SeiSwap Labs', slug: 'seiswap-dex',
    description: 'Decentralized exchange built natively on Sei.',
    tags: ['DeFi', 'AMM'], tech: ['Rust', 'TypeScript'],
    stars: 1243, forks: 89, contributors: 18, openOpps: 12,
    status: 'approved' as const,
  },
  {
    id: '2', name: 'SeiSwap SDK', org: 'SeiSwap Labs', slug: 'seiswap-sdk',
    description: 'TypeScript SDK for SeiSwap protocol integration.',
    tags: ['Tooling'], tech: ['TypeScript'],
    stars: 348, forks: 31, contributors: 8, openOpps: 5,
    status: 'approved' as const,
  },
  {
    id: '3', name: 'SeiLend Protocol', org: 'SeiFinance', slug: 'seilend',
    description: 'Overcollateralized lending protocol for Sei.',
    tags: ['DeFi', 'Lending'], tech: ['CosmWasm', 'TypeScript'],
    stars: 672, forks: 51, contributors: 14, openOpps: 9,
    status: 'approved' as const,
  },
  {
    id: '4', name: 'Sei Game Engine', org: 'SeiGames', slug: 'sei-game-engine',
    description: "On-chain game engine leveraging Sei's block times.",
    tags: ['Gaming'], tech: ['Rust', 'WebAssembly'],
    stars: 389, forks: 31, contributors: 7, openOpps: 4,
    status: 'pending' as const,
  },
  {
    id: '5', name: 'SeiSwap Docs', org: 'SeiSwap Labs', slug: 'seiswap-docs',
    description: 'Protocol documentation and developer guides.',
    tags: ['Documentation'], tech: ['MDX'],
    stars: 44, forks: 8, contributors: 5, openOpps: 2,
    status: 'draft' as const,
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Projects"
        description="Manage your project listings and contribution opportunities."
        actions={
          <CreateProjectDialog>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </CreateProjectDialog>
        }
      />

      <ProjectsTable initialProjects={PROJECTS} />
    </div>
  );
}
