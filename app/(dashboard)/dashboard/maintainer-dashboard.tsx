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
import { useAuthStore } from '@/lib/store/auth-store';
import { useProjects } from '@/lib/hooks/use-projects';
import { useApplications } from '@/lib/hooks/use-applications';
import { useOrganizations } from '@/lib/hooks/use-organizations';

const QUICK_ACTIONS = [
  { label: 'New Project', href: '/dashboard/projects', icon: FolderKanban, description: 'Add a project listing' },
  { label: 'New Organization', href: '/dashboard/organizations', icon: Building2, description: 'Set up an organization' },
  { label: 'Review Applications', href: '/dashboard/applications', icon: FileText, description: 'Pending reviews' },
];

export function MaintainerDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: applications = [], isLoading: appsLoading } = useApplications();
  const { data: organizations = [], isLoading: orgsLoading } = useOrganizations();

  const myProjects = projects.filter((p) => p.organizationId != null);
  const pendingApplications = applications.filter(
    (a) => a.status === 'pending' || a.status === 'review'
  );

  const recentActivity = [
    ...pendingApplications.map((a) => ({
      id: a.id,
      type: 'application' as const,
      title: `New application on ${a.projectName}`,
      sub: `${a.contributorName} applied to "${a.issueTitle}"`,
      time: a.appliedAt,
      status: a.status,
    })),
    ...myProjects.map((p) => ({
      id: p.id,
      type: 'project' as const,
      title: `${p.name} ${p.status === 'approved' ? 'approved' : 'created'}`,
      sub: `Project status: ${p.status}`,
      time: p.createdAt ? new Date(p.createdAt) : new Date(),
      status: p.status,
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5);

  const metrics = [
    { title: 'Organizations', value: organizations.length, icon: Building2, change: 0, changeLabel: 'total' },
    { title: 'Projects', value: projects.length, icon: FolderKanban, change: 0, changeLabel: 'total', accent: true },
    { title: 'Contributors', value: new Set(applications.map((a) => a.contributorId)).size, icon: Users, change: 0, changeLabel: 'active' },
    { title: 'Applications', value: applications.length, icon: FileText, change: 0, changeLabel: 'total' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Dashboard"
        description="Overview of your SeiFlux activity."
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
        {metrics.map((m) => (
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
          {appsLoading || projectsLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-lg border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card divide-y divide-border/50">
              {recentActivity.map((item) => (
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
          )}
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
            {orgsLoading || projectsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-lg border border-border bg-card animate-pulse" />
                ))}
              </div>
            ) : myProjects.length === 0 ? (
              <div className="rounded-lg border border-border bg-card p-6 text-center">
                <p className="text-xs text-muted-foreground">No projects yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.slug ?? project.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 hover:bg-accent transition-colors"
                  >
                    <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {project.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {project.tags?.slice(0, 2).join(', ') || 'No tags'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={project.status} />
                      {project.openIssues ? (
                        <Badge variant="info" className="text-[10px]">
                          {project.openIssues} issues
                        </Badge>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            )}
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
