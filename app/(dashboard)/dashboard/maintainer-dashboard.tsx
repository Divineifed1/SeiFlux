'use client';
import Link from 'next/link';
import {
  Building2,
  FolderKanban,
  Users,
  FileText,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/design-system/metric-card';
import { PageHeader } from '@/components/design-system/page-header';
import { SectionHeader } from '@/components/design-system/section-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { formatRelativeTime } from '@/lib/utils';

const METRICS = [
  { title: 'Organizations', value: 3, icon: Building2, change: 0, changeLabel: 'this month' },
  { title: 'Projects', value: 12, icon: FolderKanban, change: 8, changeLabel: 'vs last month', accent: true },
  { title: 'Contributors', value: 47, icon: Users, change: 23, changeLabel: 'vs last month' },
  { title: 'Applications', value: 89, icon: FileText, change: 14, changeLabel: 'vs last month' },
];

const RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'application',
    title: 'New application on SeiSwap DEX',
    sub: 'john_dev applied to "Fix slippage bug"',
    time: new Date(Date.now() - 1000 * 60 * 12),
    status: 'pending',
  },
  {
    id: '2',
    type: 'project',
    title: 'SeiLend Protocol approved',
    sub: 'Your project listing was approved by platform admin',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'approved',
  },
  {
    id: '3',
    type: 'application',
    title: 'Application accepted',
    sub: 'sarah_builds was approved for "Dashboard UI"',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5),
    status: 'approved',
  },
  {
    id: '4',
    type: 'project',
    title: 'New opportunity created',
    sub: 'You published "Implement price impact warnings"',
    time: new Date(Date.now() - 1000 * 60 * 60 * 22),
    status: 'open',
  },
  {
    id: '5',
    type: 'application',
    title: 'Application needs review',
    sub: 'alex_coder applied to "Build analytics dashboard"',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'pending',
  },
];

const MY_PROJECTS = [
  { id: '1', name: 'SeiSwap DEX', org: 'SeiSwap Labs', openApps: 5, status: 'approved' as const },
  { id: '2', name: 'SeiLend Protocol', org: 'SeiFinance', openApps: 3, status: 'approved' as const },
  { id: '3', name: 'Sei Game Engine', org: 'SeiGames', openApps: 2, status: 'pending' as const },
];

const QUICK_ACTIONS = [
  { label: 'New Project', href: '/dashboard/projects', icon: FolderKanban, description: 'Add a project listing' },
  { label: 'New Organization', href: '/dashboard/organizations', icon: Building2, description: 'Set up an organization' },
  { label: 'Review Applications', href: '/dashboard/applications', icon: FileText, description: '5 pending reviews' },
];

export function MaintainerDashboard() {
  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Dashboard"
        description="Overview of your SEI Builders Hub activity."
        actions={
          <Button size="sm" asChild>
            <Link href="/dashboard/projects">
              <Plus className="h-4 w-4" />
              New Project
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Activity feed */}
        <div className="space-y-3">
          <SectionHeader
            title="Recent Activity"
            action={
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                View all
              </Button>
            }
          />
          <div className="rounded-lg border border-border bg-card divide-y divide-border/50">
            {RECENT_ACTIVITY.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-4 hover:bg-muted/20 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted shrink-0">
                  {item.type === 'application' ? (
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <StatusBadge status={item.status} />
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {formatRelativeTime(item.time)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div>
            <SectionHeader title="Quick Actions" className="mb-3" />
            <div className="space-y-2">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors group"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* My projects */}
          <div>
            <SectionHeader
              title="My Projects"
              action={
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
                  <Link href="/dashboard/projects">View all</Link>
                </Button>
              }
              className="mb-3"
            />
            <div className="space-y-2">
              {MY_PROJECTS.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors"
                >
                  <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                    {project.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.org}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={project.status} />
                    {project.openApps > 0 && (
                      <Badge variant="info" className="text-[10px]">
                        {project.openApps} apps
                      </Badge>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Growth tip */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-foreground">Grow faster</p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Projects with detailed descriptions and tagged tech stacks attract 3× more contributors.
            </p>
            <Button size="sm" variant="outline-primary" className="text-xs h-7" asChild>
              <Link href="/dashboard/projects">Improve your listing</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
