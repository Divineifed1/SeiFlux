import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Search, Star, GitFork, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/design-system/page-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { EmptyState } from '@/components/design-system/empty-state';
import { CreateProjectDialog } from '@/components/dialogs/create-project-dialog';
import { formatNumber } from '@/lib/utils';

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

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="max-w-xs flex-1">
          <Input
            placeholder="Search projects..."
            startIcon={<Search />}
            className="h-8 text-xs"
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {(['all', 'approved', 'pending', 'draft'] as const).map((filter) => (
            <button
              key={filter}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
          <span className="text-xs text-muted-foreground ml-2">{PROJECTS.length} projects</span>
        </div>
      </div>

      {PROJECTS.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No projects yet"
          description="Create your first project listing to attract contributors to your Sei project."
          action={{ label: 'Create project' }}
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Tags</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Stats</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{project.org}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((t) => (
                        <Badge key={t} variant="muted" className="text-[10px] px-1.5">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {formatNumber(project.stars)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.contributors}
                      </span>
                      {project.openOpps > 0 && (
                        <Badge variant="info" className="text-[10px]">
                          {project.openOpps} open
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Button variant="ghost" size="icon-sm" asChild title="View public page">
                        <Link href={`/projects/${project.slug}`} target="_blank">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                        <Link href={`/dashboard/projects/${project.slug}`}>Manage</Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
