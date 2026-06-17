import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Star,
  GitFork,
  Users,
  Globe,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Zap,
  Code2,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/design-system/status-badge';
import { GithubIcon } from '@/components/ui/github-icon';
import { OpportunitiesList } from './opportunities-list';

export const metadata: Metadata = { title: 'Project' };

// Mock data — replace with real fetch by slug
const PROJECT = {
  name: 'SeiSwap DEX',
  slug: 'seiswap-dex',
  org: 'SeiSwap Labs',
  description:
    'Decentralized exchange built natively on Sei for ultra-fast, low-cost token swaps with concentrated liquidity.',
  longDescription: `SeiSwap is a next-generation decentralized exchange (DEX) built natively on the Sei blockchain.

  Leveraging Sei's parallelized EVM and ultra-low block times, SeiSwap delivers a trading experience that rivals centralized exchanges while remaining fully permissionless and non-custodial.

  The protocol implements concentrated liquidity positions (similar to Uniswap v3) allowing liquidity providers to earn higher fees with capital efficiency. Our novel "Sei-native" architecture takes advantage of the chain's built-in order book matching to achieve sub-100ms settlement finality.`,
  tags: ['DeFi', 'AMM', 'Concentrated Liquidity'],
  tech: ['Rust', 'TypeScript', 'React', 'CosmWasm'],
  stars: 1243,
  forks: 89,
  contributors: 18,
  openOpportunities: 12,
  status: 'approved',
  website: 'https://seiswap.example.com',
  github: 'https://github.com/seiswap/seiswap-dex',
};

const OPPORTUNITIES = [
  {
    id: '1',
    title: 'Implement price impact warnings in swap UI',
    type: 'feature',
    difficulty: 'intermediate',
    skills: ['React', 'TypeScript'],
    applications: 3,
  },
  {
    id: '2',
    title: 'Fix slippage calculation edge case',
    type: 'bug',
    difficulty: 'beginner',
    skills: ['TypeScript'],
    applications: 1,
  },
  {
    id: '3',
    title: 'Improve liquidity position documentation',
    type: 'documentation',
    difficulty: 'beginner',
    skills: ['Technical Writing'],
    applications: 0,
  },
  {
    id: '4',
    title: 'Build position analytics dashboard',
    type: 'feature',
    difficulty: 'advanced',
    skills: ['React', 'TypeScript', 'Rust'],
    applications: 5,
  },
];

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground py-4 mb-2">
          <Link
            href="/projects"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Projects
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{PROJECT.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Main content */}
          <div>
            {/* Project header */}
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center text-xl font-black text-muted-foreground shrink-0">
                  {PROJECT.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-foreground">{PROJECT.name}</h1>
                    <StatusBadge status={PROJECT.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{PROJECT.org}</p>
                </div>
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                {PROJECT.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {PROJECT.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="text-xs bg-primary/15 text-primary border-primary/20"
                  >
                    {tag}
                  </Badge>
                ))}
                {PROJECT.tech.map((t) => (
                  <Badge key={t} variant="muted" className="text-xs">
                    <Code2 className="h-2.5 w-2.5 mr-1" />
                    {t}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4" />
                  <strong className="text-foreground">{PROJECT.stars.toLocaleString()}</strong> stars
                </span>
                <span className="flex items-center gap-1.5">
                  <GitFork className="h-4 w-4" />
                  <strong className="text-foreground">{PROJECT.forks}</strong> forks
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <strong className="text-foreground">{PROJECT.contributors}</strong> contributors
                </span>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Tabs */}
            <Tabs defaultValue="opportunities">
              <TabsList className="mb-6">
                <TabsTrigger value="opportunities">
                  Opportunities{' '}
                  <Badge variant="muted" className="ml-1.5 text-[10px] px-1">
                    {OPPORTUNITIES.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <TabsContent value="opportunities">
                <OpportunitiesList
                  opportunities={OPPORTUNITIES}
                  projectName={PROJECT.name}
                />
              </TabsContent>

              <TabsContent value="about">
                <div className="prose prose-sm prose-invert max-w-none">
                  {PROJECT.longDescription.split('\n\n').map((para, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {para.trim()}
                    </p>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* CTA */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-semibold text-foreground mb-1">
                {PROJECT.openOpportunities} open opportunities
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Join {PROJECT.contributors} contributors already building this project.
              </p>
              <Button className="w-full" asChild>
                <Link href="/sign-up">
                  <Zap className="h-4 w-4" />
                  Start contributing
                </Link>
              </Button>
            </div>

            {/* Links */}
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Links
              </p>
              <div className="space-y-2">
                {PROJECT.website && (
                  <a
                    href={PROJECT.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {PROJECT.github && (
                  <a
                    href={PROJECT.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <GithubIcon className="h-4 w-4" />
                    GitHub
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                <a
                  href="#"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Documentation
                </a>
              </div>
            </div>

            {/* Tech stack */}
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PROJECT.tech.map((t) => (
                  <Badge key={t} variant="muted" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
