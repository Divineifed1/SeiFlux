'use client';
import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ChevronRight, Star, GitMerge, CheckCircle2, Clock,
  ExternalLink, Code2, FileText, FolderKanban, Edit, GitPullRequest,
  Globe, MapPin, Calendar, Flame, Award, TrendingUp,
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
import { cn } from '@/lib/utils';

// ─── Mock data (replace with useContributor(id) when API is ready) ────────────

const CONTRIBUTOR = {
  id: '1',
  name: 'Alex Chen',
  handle: 'alexc_dev',
  bio: 'Full-stack developer specializing in Rust and TypeScript. Building in Web3 for 3 years. Passionate about DeFi protocols and smart contract security.',
  skills: ['Rust', 'TypeScript', 'React', 'CosmWasm', 'Solidity', 'Go'],
  languages: [
    { name: 'Rust', pct: 52, color: '#ef4444' },
    { name: 'TypeScript', pct: 28, color: '#3b82f6' },
    { name: 'Go', pct: 12, color: '#22c55e' },
    { name: 'Other', pct: 8, color: '#6b7280' },
  ],
  github: 'alexc_dev',
  website: 'https://alexchen.dev',
  location: 'San Francisco, CA',
  activeProjects: 2,
  completedContribs: 7,
  mergedPRs: 14,
  totalApplications: 12,
  reputation: 94,
  seiEcosystemScore: 87,
  joinedAt: 'Feb 2024',
  weeklyActivity: [3, 6, 4, 8, 5, 7, 2, 9, 6, 4, 7, 8],
};

const CONTRIBUTIONS = [
  {
    id: '1',
    project: 'SeiSwap DEX',
    projectSlug: 'seiswap-dex',
    title: 'Fixed slippage calculation for concentrated liquidity positions',
    type: 'bug',
    status: 'completed',
    mergedAt: '5 days ago',
    prNumber: 142,
    prUrl: 'https://github.com/seiswap/seiswap-dex/pull/142',
    additions: 84,
    deletions: 31,
  },
  {
    id: '2',
    project: 'SeiSwap DEX',
    projectSlug: 'seiswap-dex',
    title: 'Added price impact warning component to swap interface',
    type: 'feature',
    status: 'completed',
    mergedAt: '12 days ago',
    prNumber: 128,
    prUrl: 'https://github.com/seiswap/seiswap-dex/pull/128',
    additions: 213,
    deletions: 18,
  },
  {
    id: '3',
    project: 'SeiLend Protocol',
    projectSlug: 'seilend-protocol',
    title: 'Implement position health factor display',
    type: 'feature',
    status: 'active',
    mergedAt: null,
    prNumber: 89,
    prUrl: null,
    additions: 167,
    deletions: 0,
  },
  {
    id: '4',
    project: 'SeiSwap DEX',
    projectSlug: 'seiswap-dex',
    title: 'Update oracle price feed integration',
    type: 'feature',
    status: 'completed',
    mergedAt: '23 days ago',
    prNumber: 119,
    prUrl: 'https://github.com/seiswap/seiswap-dex/pull/119',
    additions: 305,
    deletions: 47,
  },
  {
    id: '5',
    project: 'SeiLend Protocol',
    projectSlug: 'seilend-protocol',
    title: 'Improve documentation for liquidation flow',
    type: 'documentation',
    status: 'completed',
    mergedAt: '31 days ago',
    prNumber: 62,
    prUrl: 'https://github.com/seilend/protocol/pull/62',
    additions: 120,
    deletions: 55,
  },
];

const APPLICATIONS = [
  {
    id: '1',
    project: 'SeiSwap DEX',
    opportunity: 'Build analytics dashboard',
    status: 'pending' as const,
    appliedAt: '4 hours ago',
  },
  {
    id: '2',
    project: 'SeiData',
    opportunity: 'Improve indexer query performance',
    status: 'review' as const,
    appliedAt: '2 days ago',
  },
  {
    id: '3',
    project: 'SeiOracle',
    opportunity: 'Write integration tests for price feeds',
    status: 'completed' as const,
    appliedAt: '18 days ago',
  },
  {
    id: '4',
    project: 'SeiLend Protocol',
    opportunity: 'Smart contract audit — lending pool module',
    status: 'rejected' as const,
    appliedAt: '30 days ago',
  },
];

const TYPE_BADGE: Record<string, 'destructive' | 'info' | 'muted' | 'success'> = {
  bug: 'destructive',
  feature: 'info',
  documentation: 'muted',
};

const mergedContribs = CONTRIBUTIONS.filter((c) => c.status === 'completed');
const maxActivity = Math.max(...CONTRIBUTOR.weeklyActivity, 1);

export default function ContributorDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title={CONTRIBUTOR.name}
        description={`@${CONTRIBUTOR.handle} · Joined ${CONTRIBUTOR.joinedAt}`}
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
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/contributors/${params.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Edit className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            </Link>
            <a
              href={`https://github.com/${CONTRIBUTOR.github}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-1.5">
                <GithubIcon className="h-3.5 w-3.5" />
                GitHub
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          </div>
        }
      />

      {/* Metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="Merged PRs" value={CONTRIBUTOR.mergedPRs} icon={GitMerge} accent />
        <MetricCard title="Active Projects" value={CONTRIBUTOR.activeProjects} icon={FolderKanban} />
        <MetricCard title="Applications" value={CONTRIBUTOR.totalApplications} icon={FileText} />
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Reputation</p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold tabular-nums text-primary">{CONTRIBUTOR.reputation}</span>
            <span className="text-xs text-muted-foreground">/100</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${CONTRIBUTOR.reputation}%` }} />
          </div>
        </div>
      </div>

      {/* Sei Ecosystem Score */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Sei Ecosystem Score
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Composite score based on contributions, PR quality, community engagement, and tenure.
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary tabular-nums">{CONTRIBUTOR.seiEcosystemScore}</p>
            <p className="text-[10px] text-muted-foreground">out of 100</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Code Quality', value: 91, icon: Code2 },
            { label: 'Activity', value: 88, icon: Flame },
            { label: 'Community', value: 79, icon: Star },
            { label: 'Consistency', value: 84, icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-lg bg-muted/40 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
              </div>
              <p className="text-sm font-bold text-foreground tabular-nums">{value}</p>
              <div className="mt-1.5 h-1 w-full rounded-full bg-background overflow-hidden">
                <div className="h-full rounded-full bg-primary/60" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Main tabs */}
        <Tabs defaultValue="contributions">
          <TabsList>
            <TabsTrigger value="contributions">
              Contributions
              <Badge variant="muted" className="ml-1.5 text-[10px] px-1">{CONTRIBUTIONS.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="applications">
              Applications
              <Badge variant="muted" className="ml-1.5 text-[10px] px-1">{APPLICATIONS.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Contributions tab */}
          <TabsContent value="contributions" className="mt-4 space-y-3">
            {CONTRIBUTIONS.map((c) => (
              <div key={c.id} className="rounded-lg border border-border bg-card p-4 hover:border-border/70 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                    c.status === 'completed' ? 'bg-green-500/10' : 'bg-blue-500/10',
                  )}>
                    {c.status === 'completed'
                      ? <GitMerge className="h-3.5 w-3.5 text-green-400" />
                      : <GitPullRequest className="h-3.5 w-3.5 text-blue-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant={TYPE_BADGE[c.type] ?? 'muted'} className="text-[10px]">{c.type}</Badge>
                      <Link href={`/dashboard/projects/${c.projectSlug}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                        {c.project}
                      </Link>
                      <span className="text-xs text-muted-foreground">#{c.prNumber}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1.5">{c.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {c.status === 'completed' ? (
                        <>
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Merged {c.mergedAt}
                          </span>
                          <span className="text-green-500/80">+{c.additions}</span>
                          <span className="text-red-400/70">-{c.deletions}</span>
                        </>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-400">
                          <Clock className="h-3 w-3" />
                          In review
                        </span>
                      )}
                    </div>
                  </div>
                  {c.prUrl && (
                    <a href={c.prUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Applications tab */}
          <TabsContent value="applications" className="mt-4 space-y-3">
            {APPLICATIONS.map((app) => (
              <div key={app.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-0.5">{app.opportunity}</p>
                    <p className="text-xs text-muted-foreground">{app.project}</p>
                    <p className="text-xs text-muted-foreground mt-1">Applied {app.appliedAt}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Activity tab */}
          <TabsContent value="activity" className="mt-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Contribution Activity (12 weeks)</h3>
              <div className="flex items-end gap-1 h-24">
                {CONTRIBUTOR.weeklyActivity.map((count, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-sm bg-primary/70 transition-all"
                      style={{ height: `${(count / maxActivity) * 80}px`, minHeight: count > 0 ? '4px' : '0' }}
                      title={`${count} contributions`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                <span>12w ago</span>
                <span>This week</span>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Merged PRs', value: mergedContribs.length, icon: GitMerge },
                  { label: 'Total PRs', value: CONTRIBUTIONS.length, icon: GitPullRequest },
                  { label: 'Completions', value: CONTRIBUTOR.completedContribs, icon: CheckCircle2 },
                  { label: 'Streak', value: '7 days', icon: Flame },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{value}</p>
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {CONTRIBUTOR.location}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Joined {CONTRIBUTOR.joinedAt}
                </p>
              </div>
            </div>
            {CONTRIBUTOR.bio && (
              <>
                <Separator className="mb-3" />
                <p className="text-xs text-muted-foreground leading-relaxed">{CONTRIBUTOR.bio}</p>
              </>
            )}
          </div>

          {/* Languages */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Languages</p>
            <div className="space-y-2.5">
              {CONTRIBUTOR.languages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="flex items-center gap-1.5 text-foreground font-medium">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
                      {lang.name}
                    </span>
                    <span className="text-muted-foreground">{lang.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${lang.pct}%`, backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Skills</p>
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
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Links</p>
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
                  <Globe className="h-4 w-4" />
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
