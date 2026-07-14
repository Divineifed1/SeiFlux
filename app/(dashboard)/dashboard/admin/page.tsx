'use client';
import * as React from 'react';
import {
  ShieldCheck, Building2, FolderKanban, Users, FileText,
  CheckCircle2, XCircle, Clock, AlertTriangle, TrendingUp,
  Eye, ArrowRight, Pause, PlayCircle, Ban, UserCheck, Zap, Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MetricCard } from '@/components/design-system/metric-card';
import { PageHeader } from '@/components/design-system/page-header';
import { SectionHeader } from '@/components/design-system/section-header';
import { WaveManagerDialog } from '@/components/dialogs/wave-manager-dialog';
import { useWaves } from '@/lib/hooks/use-waves';
import { useProjectSubmissions, timeAgo } from '@/lib/store/project-submissions-store';
import { toast } from '@/hooks/use-toast';

// ─── Mock data ─────────────────────────────────────────────────────────────────

const PLATFORM_METRICS = [
  { title: 'Total Users', value: 284, icon: Users, change: 31, changeLabel: 'vs last month', accent: true },
  { title: 'Total Projects', value: 47, icon: FolderKanban, change: 12, changeLabel: 'vs last month' },
  { title: 'Active Contributors', value: 138, icon: UserCheck, change: 22, changeLabel: 'vs last month' },
  { title: 'Active Maintainers', value: 41, icon: ShieldCheck, change: 8, changeLabel: 'vs last month' },
  { title: 'Repositories', value: 93, icon: FileText, change: 14, changeLabel: 'vs last month' },
  { title: 'Organizations', value: 18, icon: Building2, change: 4, changeLabel: 'vs last month' },
];

const PENDING_PROJECTS = [
  {
    id: '1',
    name: 'SeiVault Protocol',
    org: 'SeiFinance',
    submittedBy: 'vault_dev',
    submittedAt: '3 hours ago',
    tags: ['DeFi', 'Rust'],
    description: 'Secure multi-sig vault protocol for Sei ecosystem with time-locked withdrawals.',
  },
  {
    id: '2',
    name: 'SeiAI Analytics',
    org: 'SeiData',
    submittedBy: 'data_alice',
    submittedAt: '11 hours ago',
    tags: ['Analytics', 'TypeScript'],
    description: 'AI-powered on-chain analytics dashboard for Sei DeFi protocols.',
  },
  {
    id: '3',
    name: 'SeiPay Checkout',
    org: 'SeiCommerce',
    submittedBy: 'pay_builder',
    submittedAt: '28 hours ago',
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
    reportedAt: '45m ago',
    severity: 'medium' as const,
  },
  {
    id: '2',
    type: 'user',
    target: 'spammer_123',
    reason: 'Mass-applying to all opportunities without reading requirements',
    reportedBy: 'dev_maintainer',
    reportedAt: '6h ago',
    severity: 'high' as const,
  },
  {
    id: '3',
    type: 'project',
    target: 'SeiCopy Clone',
    reason: 'Possible IP infringement — forked without attribution',
    reportedBy: 'original_dev',
    reportedAt: '14h ago',
    severity: 'high' as const,
  },
];

interface AdminUser {
  id: string;
  name: string;
  handle: string;
  role: 'maintainer' | 'contributor';
  joinedAt: string;
  status: 'active' | 'suspended';
}

interface AdminOrg {
  id: string;
  name: string;
  slug: string;
  projects: number;
  members: number;
  status: 'active' | 'suspended';
  joinedAt: string;
}

const INITIAL_USERS: AdminUser[] = [
  { id: '1', name: 'Emma Scott', handle: 'emma_scott', role: 'maintainer', joinedAt: '30m ago', status: 'active' },
  { id: '2', name: 'Kai Zhang', handle: 'kai_z_dev', role: 'contributor', joinedAt: '2h ago', status: 'active' },
  { id: '3', name: 'Priya Nair', handle: 'priya_builds', role: 'maintainer', joinedAt: '8h ago', status: 'active' },
  { id: '4', name: 'Lucas Martin', handle: 'lmartin_dev', role: 'contributor', joinedAt: '1d ago', status: 'suspended' },
];

const INITIAL_ORGS: AdminOrg[] = [
  { id: '1', name: 'SeiSwap Labs', slug: 'seiswap-labs', projects: 4, members: 12, status: 'active', joinedAt: '3 months ago' },
  { id: '2', name: 'SeiNFT Marketplace', slug: 'seinft', projects: 2, members: 7, status: 'active', joinedAt: '2 months ago' },
  { id: '3', name: 'SeiData', slug: 'seidata', projects: 3, members: 5, status: 'active', joinedAt: '5 weeks ago' },
  { id: '4', name: 'SeiSpam Protocol', slug: 'seispam', projects: 0, members: 1, status: 'suspended', joinedAt: '2 weeks ago' },
];

const SEVERITY_BADGE: Record<'low' | 'medium' | 'high', 'muted' | 'warning' | 'destructive'> = {
  low: 'muted', medium: 'warning', high: 'destructive',
};

const ROLE_BADGE: Record<string, 'info' | 'muted'> = {
  maintainer: 'info', contributor: 'muted',
};

// ─── Page ──────────────────────────────────────────────────────────────────────

function WaveList() {
  const { data: waves = [], isLoading, refetch } = useWaves();

  const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'muted'> = {
    upcoming: 'warning',
    active: 'success',
    completed: 'muted',
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (waves.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-6">No waves created yet. Use the button above to create one.</p>
    );
  }

  return (
    <div className="space-y-3">
      {waves.map((wave) => (
        <div key={wave.id} className="rounded-lg border border-border bg-card p-4 hover:border-border/80 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-foreground">{wave.name}</p>
                <Badge variant={STATUS_VARIANT[wave.status] ?? 'muted'} className="text-[10px]">
                  {wave.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(wave.startsAt))}
                {' → '}
                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(wave.endsAt))}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [projects, setProjects] = React.useState(PENDING_PROJECTS);
  const [reports, setReports] = React.useState(REPORTED_ISSUES);
  const [users, setUsers] = React.useState(INITIAL_USERS);
  const [orgs, setOrgs] = React.useState(INITIAL_ORGS);

  const submissions = useProjectSubmissions((s) => s.submissions);
  const setStatus = useProjectSubmissions((s) => s.setStatus);

  const submittedPending = submissions
    .filter((p) => p.status === 'pending')
    .map((p) => ({
      id: p.id,
      name: p.name,
      org: p.org,
      submittedBy: p.submittedBy,
      submittedAt: timeAgo(p.submittedAt),
      tags: p.tags,
      description: p.description,
    }));

  const pendingProjects = [...projects, ...submittedPending];

  const [previewProject, setPreviewProject] = React.useState<(typeof pendingProjects)[number] | null>(null);

  const approveProject = (id: string, name: string) => {
    if (id.startsWith('sub_')) {
      setStatus(id, 'approved');
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    toast({ variant: 'success', title: 'Project approved', description: `${name} is now publicly listed.` });
  };

  const rejectProject = (id: string, name: string) => {
    if (id.startsWith('sub_')) {
      setStatus(id, 'rejected');
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    toast({ title: 'Project rejected', description: `${name} was not approved.` });
  };

  const dismissReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast({ variant: 'success', title: 'Report dismissed' });
  };

  const removeReportedItem = (id: string, target: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast({ title: 'Item removed', description: `${target} has been removed from the platform.` });
  };

  const toggleUserStatus = (id: string, name: string, status: 'active' | 'suspended') => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: status === 'active' ? 'suspended' : 'active' } : u));
    if (status === 'active') {
      toast({ title: 'User suspended', description: `${name} has been suspended.` });
    } else {
      toast({ variant: 'success', title: 'User reinstated', description: `${name} has been reinstated.` });
    }
  };

  const toggleOrgStatus = (id: string, name: string, status: 'active' | 'suspended') => {
    setOrgs((prev) => prev.map((o) => o.id === id ? { ...o, status: status === 'active' ? 'suspended' : 'active' } : o));
    if (status === 'active') {
      toast({ title: 'Organization suspended', description: `${name} has been suspended.` });
    } else {
      toast({ variant: 'success', title: 'Organization reinstated', description: `${name} has been reinstated.` });
    }
  };

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Admin Panel"
        description="Platform-wide moderation, analytics, and user management."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {reports.length} reports
            </Badge>
            <Badge variant="warning" className="gap-1">
              <Clock className="h-3 w-3" />
              {pendingProjects.length} pending
            </Badge>
          </div>
        }
      />

      {/* Platform metrics — 6 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PLATFORM_METRICS.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">
             Pending
            {pendingProjects.length > 0 && (
              <Badge variant="warning" className="ml-1.5 text-[10px] px-1">{pendingProjects.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="waves">
            Waves
          </TabsTrigger>
          <TabsTrigger value="reports">
            Reports
            {reports.length > 0 && (
              <Badge variant="destructive" className="ml-1.5 text-[10px] px-1">{reports.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="orgs">Organizations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Pending Projects */}
        <TabsContent value="projects" className="mt-4 space-y-3">
          {pendingProjects.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">All caught up</p>
              <p className="text-xs text-muted-foreground mt-1">No pending project submissions.</p>
            </div>
          ) : (
            pendingProjects.map((project) => (
              <div key={project.id} className="rounded-lg border border-border bg-card p-5 hover:border-border/80 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                      <span className="text-xs text-muted-foreground">by {project.org}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="muted" className="text-[10px]">{tag}</Badge>
                      ))}
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                        <Clock className="h-3 w-3" />
                        {project.submittedAt} by @{project.submittedBy}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" className="gap-1.5 text-xs h-8" onClick={() => approveProject(project.id, project.name)}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={() => setPreviewProject(project)}>
                      <Eye className="h-3.5 w-3.5" />
                      Preview
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-8 text-destructive hover:text-destructive" onClick={() => rejectProject(project.id, project.name)}>
                      <XCircle className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Waves */}
        <TabsContent value="waves" className="mt-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Contribution Waves</h3>
              <WaveManagerDialog>
                <Button size="sm" className="gap-1.5 text-xs">
                  <Plus className="h-3.5 w-3.5" />
                  Manage Waves
                </Button>
              </WaveManagerDialog>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Waves are 8-day contribution windows. Use the dialog to create, edit dates, or delete waves.
            </p>
            <WaveList />
          </div>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="mt-4 space-y-3">
          {reports.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center">
              <ShieldCheck className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">No open reports</p>
              <p className="text-xs text-muted-foreground mt-1">All reports have been reviewed.</p>
            </div>
          ) : (
            reports.map((issue) => (
              <div key={issue.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={SEVERITY_BADGE[issue.severity]} className="text-[10px] uppercase">{issue.severity}</Badge>
                      <Badge variant="muted" className="text-[10px]">{issue.type}</Badge>
                      <span className="text-sm font-medium text-foreground">{issue.target}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{issue.reason}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Reported by @{issue.reportedBy} · {issue.reportedAt}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={() => dismissReport(issue.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Dismiss
                    </Button>
                    <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-8 text-destructive hover:text-destructive" onClick={() => removeReportedItem(issue.id, issue.target)}>
                      <Ban className="h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="mt-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="divide-y divide-border/50">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.handle} · Joined {user.joinedAt}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={ROLE_BADGE[user.role] ?? 'muted'} className="text-[10px]">{user.role}</Badge>
                    <Badge variant={user.status === 'suspended' ? 'destructive' : 'success'} className="text-[10px]">
                      {user.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button size="sm" variant="ghost" className="text-xs h-7 px-2">View</Button>
                    {user.status !== 'suspended' ? (
                      <Button size="sm" variant="ghost" className="text-xs h-7 px-2 text-destructive hover:text-destructive gap-1"
                        onClick={() => toggleUserStatus(user.id, user.name, user.status)}>
                        <Pause className="h-3 w-3" />
                        Suspend
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" className="text-xs h-7 px-2 text-green-500 hover:text-green-400 gap-1"
                        onClick={() => toggleUserStatus(user.id, user.name, user.status)}>
                        <PlayCircle className="h-3 w-3" />
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
              Load more users <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </TabsContent>

        {/* Organizations */}
        <TabsContent value="orgs" className="mt-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-2.5 font-medium text-muted-foreground text-xs">Organization</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Projects</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Members</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
                  <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden lg:table-cell">Joined</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {orgs.map((org) => (
                  <tr key={org.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {org.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{org.name}</p>
                          <p className="text-[10px] text-muted-foreground">/{org.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{org.projects}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{org.members}</td>
                    <td className="px-4 py-3">
                      <Badge variant={org.status === 'suspended' ? 'destructive' : 'success'} className="text-[10px]">
                        {org.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{org.joinedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Button size="sm" variant="ghost" className="text-xs h-7 px-2">View</Button>
                        {org.status !== 'suspended' ? (
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2 text-destructive hover:text-destructive gap-1"
                            onClick={() => toggleOrgStatus(org.id, org.name, org.status)}>
                            <Pause className="h-3 w-3" />
                            Suspend
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" className="text-xs h-7 px-2 text-green-500 hover:text-green-400 gap-1"
                            onClick={() => toggleOrgStatus(org.id, org.name, org.status)}>
                            <PlayCircle className="h-3 w-3" />
                            Reinstate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <SectionHeader title="Platform Growth (7d)" className="mb-4" />
              <div className="space-y-3">
                {[
                  { label: 'New Users', value: 42, max: 100 },
                  { label: 'New Projects', value: 7, max: 30 },
                  { label: 'Applications', value: 89, max: 200 },
                  { label: 'Merged PRs', value: 23, max: 60 },
                  { label: 'New Opportunities', value: 15, max: 50 },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                      <span className="text-xs font-medium tabular-nums">{stat.value}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary/60" style={{ width: `${(stat.value / stat.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                    <span className="text-xs text-muted-foreground w-24 shrink-0">{item.category}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary/50" style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground w-8 text-right shrink-0">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
              <SectionHeader title="Platform Health" className="mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Avg. Response Time', value: '1.4 days', icon: Clock },
                  { label: 'Application Rate', value: '6.2 / opp', icon: TrendingUp },
                  { label: 'Merge Rate', value: '38%', icon: CheckCircle2 },
                  { label: 'Spam Rate', value: '2.1%', icon: ShieldCheck },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-lg bg-muted/40 p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
                    </div>
                    <p className="text-lg font-bold tabular-nums text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!previewProject} onOpenChange={(open) => !open && setPreviewProject(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              {previewProject?.name}
            </DialogTitle>
            <DialogDescription>
              Submitted by @{previewProject?.submittedBy} · {previewProject?.submittedAt}
            </DialogDescription>
          </DialogHeader>
          {previewProject && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Organization</p>
                <p className="text-sm text-foreground">{previewProject.org}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{previewProject.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {previewProject.tags.map((tag) => (
                  <Badge key={tag} variant="muted" className="text-[10px]">{tag}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" className="gap-1.5 text-xs" onClick={() => { if (previewProject) approveProject(previewProject.id, previewProject.name); setPreviewProject(null); }}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approve
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5 text-xs text-destructive hover:text-destructive" onClick={() => { if (previewProject) rejectProject(previewProject.id, previewProject.name); setPreviewProject(null); }}>
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
