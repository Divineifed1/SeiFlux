import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ChevronRight,
  Star,
  GitFork,
  CheckCircle2,
  Clock,
  ExternalLink,
  Code2,
  FileText,
  FolderKanban,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/design-system/page-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { MetricCard } from '@/components/design-system/metric-card';
import { formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Contributor Profile' };

const CONTRIBUTOR = {
  id: '1',
  name: 'Alex Chen',
  handle: 'alexc_dev',
  bio: 'Full-stack developer specializing in Rust and TypeScript. Building in Web3 for 3 years. Passionate about DeFi protocols and smart contract security.',
  skills: ['Rust', 'TypeScript', 'React', 'CosmWasm', 'Solidity'],
  github: 'alexc_dev',
  website: 'https://alexchen.dev',
  location: 'San Francisco, CA',
  activeProjects: 2,
  completedContribs: 7,
  totalApplications: 12,
  reputation: 94,
  joinedAt: new Date('2024-02-01'),
};

const CONTRIBUTIONS = [
  {
    id: '1',
    project: 'SeiSwap DEX',
    title: 'Fixed slippage calculation for concentrated liquidity positions',
    type: 'bug',
    status: 'completed',
    mergedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    prUrl: 'https://github.com/seiswap/seiswap-dex/pull/142',
  },
  {
    id: '2',
    project: 'SeiSwap DEX',
    title: 'Added price impact warning component to swap interface',
    type: 'feature',
    status: 'completed',
    mergedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    prUrl: 'https://github.com/seiswap/seiswap-dex/pull/128',
  },
  {
    id: '3',
    project: 'SeiLend Protocol',
    title: 'Implement position health factor display',
    type: 'feature',
    status: 'active',
    mergedAt: null,
    prUrl: null,
  },
];

const APPLICATIONS = [
  {
    id: '1',
    project: 'SeiSwap DEX',
    opportunity: 'Build analytics dashboard',
    status: 'pending' as const,
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: '2',
    project: 'SeiData',
    opportunity: 'Improve indexer query performance',
    status: 'review' as const,
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
];

const TYPE_BADGE: Record<string, 'destructive' | 'info' | 'muted' | 'success'> = {
  bug: 'destructive',
  feature: 'info',
  documentation: 'muted',
};

export default function ContributorDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title={CONTRIBUTOR.name}
        description={`@${CONTRIBUTOR.handle} · Joined ${formatRelativeTime(CONTRIBUTOR.joinedAt)}`}
        breadcrumb={
          <>
            <Link href="/dashboard/contributors" className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Contributors
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{CONTRIBUTOR.name}</span>
          </>
        }
        actions={
          <a
            href={`https://github.com/${CONTRIBUTOR.github}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="gap-1.5">
              <GithubIcon className="h-3.5 w-3.5" />
              View GitHub
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard title="Completed" value={CONTRIBUTOR.completedContribs} icon={CheckCircle2} accent />
        <MetricCard title="Active Projects" value={CONTRIBUTOR.activeProjects} icon={FolderKanban} />
        <MetricCard title="Applications" value={CONTRIBUTOR.totalApplications} icon={FileText} />
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Reputation
          </p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold tabular-nums">{CONTRIBUTOR.reputation}</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${CONTRIBUTOR.reputation}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        {/* Main content */}
        <Tabs defaultValue="contributions">
          <TabsList>
            <TabsTrigger value="contributions">
              Contributions
              <Badge variant="muted" className="ml-1.5 text-[10px] px-1">
                {CONTRIBUTIONS.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="applications">
              Applications
              <Badge variant="muted" className="ml-1.5 text-[10px] px-1">
                {APPLICATIONS.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contributions" className="mt-4 space-y-3">
            {CONTRIBUTIONS.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-border bg-card p-4 hover:border-border/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Badge variant={TYPE_BADGE[c.type] ?? 'muted'} className="text-[10px]">
                        {c.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{c.project}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{c.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {c.status === 'completed' ? (
                        <>
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Merged
                          </span>
                          {c.mergedAt && <span>{formatRelativeTime(c.mergedAt)}</span>}
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-400">
                          <Clock className="h-3 w-3" />
                          In progress
                        </span>
                      )}
                    </div>
                  </div>
                  {c.prUrl && (
                    <a
                      href={c.prUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 shrink-0"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      PR
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="applications" className="mt-4 space-y-3">
            {APPLICATIONS.map((app) => (
              <div
                key={app.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-0.5">{app.opportunity}</p>
                    <p className="text-xs text-muted-foreground">{app.project}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applied {formatRelativeTime(app.appliedAt)}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Profile card */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="text-sm bg-primary/10 text-primary font-semibold">
                  {CONTRIBUTOR.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{CONTRIBUTOR.name}</p>
                <p className="text-xs text-muted-foreground">@{CONTRIBUTOR.handle}</p>
                {CONTRIBUTOR.location && (
                  <p className="text-xs text-muted-foreground mt-0.5">{CONTRIBUTOR.location}</p>
                )}
              </div>
            </div>
            {CONTRIBUTOR.bio && (
              <>
                <Separator className="mb-3" />
                <p className="text-xs text-muted-foreground leading-relaxed">{CONTRIBUTOR.bio}</p>
              </>
            )}
          </div>

          {/* Skills */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {CONTRIBUTOR.skills.map((skill) => (
                <Badge key={skill} variant="muted" className="text-xs">
                  <Code2 className="h-2.5 w-2.5 mr-1" />
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Links
            </p>
            <div className="space-y-2">
              <a
                href={`https://github.com/${CONTRIBUTOR.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <GithubIcon className="h-4 w-4" />
                @{CONTRIBUTOR.github}
                <ExternalLink className="h-3 w-3 ml-auto" />
              </a>
              {CONTRIBUTOR.website && (
                <a
                  href={CONTRIBUTOR.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Star className="h-4 w-4" />
                  Website
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
