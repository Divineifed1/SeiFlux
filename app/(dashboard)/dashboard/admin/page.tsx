import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  FolderKanban,
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard } from '@/components/design-system/metric-card';
import { PageHeader } from '@/components/design-system/page-header';
import { SectionHeader } from '@/components/design-system/section-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Admin Panel' };

const PLATFORM_METRICS = [
  { title: 'Total Projects', value: 47, icon: FolderKanban, change: 12, changeLabel: 'vs last month' },
  { title: 'Active Users', value: 284, icon: Users, change: 31, changeLabel: 'vs last month', accent: true },
  { title: 'Organizations', value: 18, icon: Building2, change: 4, changeLabel: 'vs last month' },
  { title: 'Applications', value: 612, icon: FileText, change: 22, changeLabel: 'vs last month' },
];

const PENDING_PROJECTS = [
  {
    id: '1',
    name: 'SeiVault Protocol',
    org: 'SeiFinance',
    submittedBy: 'vault_dev',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    tags: ['DeFi', 'Rust'],
    description: 'Secure multi-sig vault protocol for Sei ecosystem with time-locked withdrawals.',
  },
  {
    id: '2',
    name: 'SeiAI Analytics',
    org: 'SeiData',
    submittedBy: 'data_alice',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 11),
    tags: ['Analytics', 'TypeScript'],
    description: 'AI-powered on-chain analytics dashboard for Sei DeFi protocols.',
  },
  {
    id: '3',
    name: 'SeiPay Checkout',
    org: 'SeiCommerce',
    submittedBy: 'pay_builder',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
    tags: ['Infrastructure', 'TypeScript', 'Solidity'],
    description: 'Embeddable crypto checkout widget for e-commerce stores on Sei.',
  },
];

const REPORTED_ISSUES = [
  {
    id: '1',
    type: 'project',
    target: 'TestToken Factory',
    reason: 'Suspected spam / low quality listing',
    reportedBy: 'mod_bob',
    reportedAt: new Date(Date.now() - 1000 * 60 * 45),
    severity: 'medium' as const,
  },
  {
    id: '2',
    type: 'user',
    target: 'spammer_123',
    reason: 'Mass-applying to all opportunities without reading requirements',
    reportedBy: 'dev_maintainer',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    severity: 'high' as const,
  },
  {
    id: '3',
    type: 'project',
    target: 'SeiCopy Clone',
    reason: 'Possible IP infringement — forked without attribution',
    reportedBy: 'original_dev',
    reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 14),
    severity: 'high' as const,
  },
];

const RECENT_USERS = [
  {
    id: '1',
    name: 'Emma Scott',
    handle: 'emma_scott',
    role: 'maintainer' as const,
    joinedAt: new Date(Date.now() - 1000 * 60 * 30),
    status: 'active',
  },
  {
    id: '2',
    name: 'Kai Zhang',
    handle: 'kai_z_dev',
    role: 'contributor' as const,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    status: 'active',
  },
  {
    id: '3',
    name: 'Priya Nair',
    handle: 'priya_builds',
    role: 'maintainer' as const,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    status: 'active',
  },
  {
    id: '4',
    name: 'Lucas Martin',
    handle: 'lmartin_dev',
    role: 'contributor' as const,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'suspended',
  },
];

const SEVERITY_BADGE: Record<'low' | 'medium' | 'high', 'muted' | 'warning' | 'destructive'> = {
  low: 'muted',
  medium: 'warning',
  high: 'destructive',
};

const ROLE_BADGE: Record<string, 'info' | 'muted'> = {
  maintainer: 'info',
  contributor: 'muted',
};

export default function AdminPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Admin Panel"
        description="Platform-wide moderation, analytics, and user management."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {REPORTED_ISSUES.length} reports
            </Badge>
            <Badge variant="warning" className="gap-1">
              <Clock className="h-3 w-3" />
              {PENDING_PROJECTS.length} pending
            </Badge>
          </div>
        }
      />

      {/* Platform metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLATFORM_METRICS.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">
            Pending Projects
            <Badge variant="warning" className="ml-1.5 text-[10px] px-1">
              {PENDING_PROJECTS.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="reports">
            Reports
            <Badge variant="destructive" className="ml-1.5 text-[10px] px-1">
              {REPORTED_ISSUES.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="users">
            Users
          </TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Pending Projects */}
        <TabsContent value="projects" className="mt-4 space-y-3">
          {PENDING_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-border bg-card p-5 hover:border-border/80 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                    <span className="text-xs text-muted-foreground">by {project.org}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="muted" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                      <Clock className="h-3 w-3" />
                      Submitted {formatRelativeTime(project.submittedAt)} by @{project.submittedBy}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button size="sm" className="gap-1.5 text-xs h-8">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </Button>
                  <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-8 text-destructive hover:text-destructive">
                    <XCircle className="h-3.5 w-3.5" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="mt-4 space-y-3">
          {REPORTED_ISSUES.map((issue) => (
            <div
              key={issue.id}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant={SEVERITY_BADGE[issue.severity]} className="text-[10px] uppercase">
                      {issue.severity}
                    </Badge>
                    <Badge variant="muted" className="text-[10px]">
                      {issue.type}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">{issue.target}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                    {issue.reason}
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Reported by @{issue.reportedBy} · {formatRelativeTime(issue.reportedAt)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8">
                    <Eye className="h-3.5 w-3.5" />
                    Review
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 text-xs h-8 text-destructive hover:text-destructive"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="mt-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="divide-y divide-border/50">
              {RECENT_USERS.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors"
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{user.handle} · Joined {formatRelativeTime(user.joinedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={ROLE_BADGE[user.role] ?? 'muted'} className="text-[10px]">
                      {user.role}
                    </Badge>
                    {user.status === 'suspended' ? (
                      <Badge variant="destructive" className="text-[10px]">suspended</Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px]">active</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                      View
                    </Button>
                    {user.status !== 'suspended' ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs h-7 px-2 text-destructive hover:text-destructive"
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" className="text-xs h-7 px-2 text-green-500 hover:text-green-400">
                        Reinstate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-center">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
              Load more users
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Growth chart placeholder */}
            <div className="rounded-lg border border-border bg-card p-5">
              <SectionHeader title="Platform Growth" className="mb-4" />
              <div className="space-y-3">
                {[
                  { label: 'New Users (7d)', value: 42, max: 100 },
                  { label: 'New Projects (7d)', value: 7, max: 30 },
                  { label: 'Applications (7d)', value: 89, max: 200 },
                  { label: 'Merged PRs (7d)', value: 23, max: 60 },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                      <span className="text-xs font-medium tabular-nums">{stat.value}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60 transition-all"
                        style={{ width: `${(stat.value / stat.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top categories */}
            <div className="rounded-lg border border-border bg-card p-5">
              <SectionHeader title="Top Project Categories" className="mb-4" />
              <div className="space-y-2.5">
                {[
                  { category: 'DeFi', count: 21, pct: 44 },
                  { category: 'Infrastructure', count: 12, pct: 26 },
                  { category: 'NFT', count: 7, pct: 15 },
                  { category: 'Gaming', count: 4, pct: 9 },
                  { category: 'Tooling', count: 3, pct: 6 },
                ].map((item) => (
                  <div key={item.category} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24 shrink-0">
                      {item.category}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/50"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground w-8 text-right shrink-0">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Health metrics */}
            <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
              <SectionHeader title="Platform Health" className="mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Avg. Response Time', value: '1.4 days', trend: 'good', icon: Clock },
                  { label: 'Application Rate', value: '6.2 / opp', trend: 'good', icon: TrendingUp },
                  { label: 'Merge Rate', value: '38%', trend: 'neutral', icon: CheckCircle2 },
                  { label: 'Spam Rate', value: '2.1%', trend: 'good', icon: ShieldCheck },
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="rounded-lg bg-muted/40 p-3">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {metric.label}
                        </span>
                      </div>
                      <p className="text-lg font-bold tabular-nums text-foreground">
                        {metric.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
