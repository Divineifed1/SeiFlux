'use client';
import Link from 'next/link';
import {
  Search,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Star,
  Code2,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/design-system/metric-card';
import { SectionHeader } from '@/components/design-system/section-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { formatRelativeTime } from '@/lib/utils';
import type { AuthUser } from '@/lib/store/auth-store';

const MY_APPLICATIONS = [
  {
    id: '1',
    project: 'SeiSwap DEX',
    opportunity: 'Build analytics dashboard',
    status: 'pending' as const,
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
  },
  {
    id: '2',
    project: 'SeiLend Protocol',
    opportunity: 'Improve indexer query performance',
    status: 'review' as const,
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: '3',
    project: 'SeiSwap DEX',
    opportunity: 'Fix slippage calculation bug',
    status: 'approved' as const,
    appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
];

const RECOMMENDED_OPPORTUNITIES = [
  {
    id: '1',
    project: 'SeiSwap DEX',
    title: 'Add price impact warnings to swap UI',
    type: 'feature',
    difficulty: 'intermediate',
    skills: ['React', 'TypeScript'],
    reward: null,
  },
  {
    id: '2',
    project: 'SeiData',
    title: 'Optimize GraphQL query batching',
    type: 'feature',
    difficulty: 'advanced',
    skills: ['Go', 'GraphQL'],
    reward: null,
  },
  {
    id: '3',
    project: 'SeiLend Protocol',
    title: 'Write integration tests for liquidation module',
    type: 'documentation',
    difficulty: 'beginner',
    skills: ['Rust', 'CosmWasm'],
    reward: null,
  },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: 'text-green-400',
  intermediate: 'text-yellow-400',
  advanced: 'text-red-400',
};

interface ContributorDashboardProps {
  user: AuthUser;
}

export function ContributorDashboard({ user }: ContributorDashboardProps) {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground mb-1">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-muted-foreground">
            Discover opportunities and track your contributions.
          </p>
        </div>
        <Button size="sm" asChild className="gap-1.5 shrink-0">
          <Link href="/projects">
            <Search className="h-3.5 w-3.5" />
            Browse projects
          </Link>
        </Button>
      </div>

      {/* Contributor metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Completed" value={2} icon={CheckCircle2} accent />
        <MetricCard title="In Progress" value={1} icon={Clock} />
        <MetricCard title="Applications" value={MY_APPLICATIONS.length} icon={FileText} />
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Reputation
          </p>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-bold tabular-nums">62</span>
            <span className="text-sm text-muted-foreground">/100</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: '62%' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Recommended opportunities */}
        <div className="space-y-3">
          <SectionHeader
            title="Recommended for you"
            description="Matched to your skills"
            action={
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
                <Link href="/projects">View all</Link>
              </Button>
            }
          />
          <div className="space-y-3">
            {RECOMMENDED_OPPORTUNITIES.map((opp) => (
              <div
                key={opp.id}
                className="rounded-lg border border-border bg-card p-4 hover:border-border/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <Badge variant="muted" className="text-[10px]">
                        {opp.type}
                      </Badge>
                      <span
                        className={`text-[10px] font-medium ${DIFFICULTY_COLOR[opp.difficulty]}`}
                      >
                        {opp.difficulty}
                      </span>
                      <span className="text-xs text-muted-foreground">{opp.project}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">{opp.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {opp.skills.map((skill) => (
                        <Badge key={skill} variant="muted" className="text-[10px]">
                          <Code2 className="h-2.5 w-2.5 mr-1" />
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 text-xs h-8">
                    Apply
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* My applications */}
          <div>
            <SectionHeader
              title="My Applications"
              action={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  asChild
                >
                  <Link href="/dashboard/applications">View all</Link>
                </Button>
              }
              className="mb-3"
            />
            <div className="space-y-2">
              {MY_APPLICATIONS.map((app) => (
                <div
                  key={app.id}
                  className="rounded-lg border border-border bg-card p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-medium text-foreground leading-tight">
                      {app.opportunity}
                    </p>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {app.project} · {formatRelativeTime(app.appliedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill growth tip */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-foreground">Level up</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Contributors with GitHub integration and ≥3 merged PRs get 4× more invitations
              from maintainers.
            </p>
            <Button size="sm" variant="outline-primary" className="text-xs h-7" asChild>
              <Link href="/dashboard/github">Connect GitHub</Link>
            </Button>
          </div>

          {/* Quick links */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Quick links
            </p>
            <div className="space-y-1">
              {[
                { label: 'Browse all projects', href: '/projects', icon: Star },
                { label: 'My profile', href: '/dashboard/contributors/1', icon: Zap },
                { label: 'Settings', href: '/dashboard/settings', icon: Code2 },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {link.label}
                    <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
