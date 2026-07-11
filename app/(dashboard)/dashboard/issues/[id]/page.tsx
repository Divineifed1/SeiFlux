'use client';
import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ChevronRight, Edit, Users, Clock, Eye, BarChart2, CheckCircle2,
  XCircle, FolderKanban,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/design-system/page-header';
import { MetricCard } from '@/components/design-system/metric-card';
import { useIssue, useIssues } from '@/lib/hooks/use-issues';
import type { IssueApplication } from '@/lib/hooks/use-issues';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const TYPE_BADGE_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'muted' | 'destructive'> = {
  'good-first-issue': 'success',
  'bounty': 'warning',
  'documentation': 'info',
  'bug-fix': 'destructive',
  'feature': 'muted',
};

const APP_STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'info' | 'warning' | 'muted' | 'destructive' }> = {
  pending:   { label: 'Pending',    variant: 'muted' },
  reviewing: { label: 'Reviewing',  variant: 'info' },
  accepted:  { label: 'Accepted',   variant: 'success' },
  rejected:  { label: 'Rejected',   variant: 'destructive' },
};

function ApplicationRow({ app }: { app: IssueApplication }) {
  return (
    <div className="flex items-start gap-3 px-5 py-4 hover:bg-muted/20 transition-colors">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
          {app.applicantName.split(' ').map((n) => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">{app.applicantName}</p>
          <span className="text-xs text-muted-foreground">@{app.applicantHandle}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{app.message}</p>
        <p className="text-[10px] text-muted-foreground mt-1">Applied {app.appliedAt}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={APP_STATUS_CONFIG[app.status]?.variant ?? 'muted'} className="text-[10px]">
          {APP_STATUS_CONFIG[app.status]?.label ?? app.status}
        </Badge>
        {app.status === 'pending' || app.status === 'reviewing' ? (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 text-green-400 hover:bg-green-500/10"
              onClick={() => toast({ variant: 'success', title: 'Application accepted' })}
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => toast({ title: 'Application rejected' })}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function IssueDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: issue, isLoading } = useIssue(params.id);
  const { data: allIssues = [] } = useIssues();

  const similar = allIssues.filter((o) => o.id !== params.id && o.type === issue?.type).slice(0, 3);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="h-16 rounded-lg bg-muted animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm">Issue not found.</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/dashboard/issues">Back to Issues</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title={issue.title}
        description={`${issue.projectName} · ${issue.organizationName}`}
        breadcrumb={
          <>
            <Link href="/dashboard/issues" className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Issues
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[200px]">{issue.title}</span>
          </>
        }
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Edit className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              size="sm"
              variant={issue.status === 'open' ? 'outline' : 'default'}
              className={cn(issue.status === 'open' && 'text-destructive border-destructive/30 hover:bg-destructive/10')}
              onClick={() => toast({ title: issue.status === 'open' ? 'Issue closed' : 'Issue reopened' })}
            >
              {issue.status === 'open' ? 'Close' : 'Reopen'}
            </Button>
          </>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="Applications" value={issue.applicantCount} icon={Users} accent />
        <MetricCard title="Views" value={issue.viewCount} icon={Eye} />
        <MetricCard title="Days Open" value={issue.daysOpen} icon={Clock} />
        <MetricCard title="Difficulty" value={issue.difficulty} icon={BarChart2} />
        <MetricCard title="Points" value={issue.points} icon={BarChart2} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        {/* Left: Details + applications */}
        <div className="space-y-5">
          {/* Description + requirements */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant={TYPE_BADGE_VARIANT[issue.type] ?? 'muted'} className="text-xs capitalize">
                {issue.type.replace(/-/g, ' ')}
              </Badge>
              <span className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                issue.difficulty === 'beginner' ? 'text-green-400 bg-green-500/10 border-green-500/20'
                  : issue.difficulty === 'intermediate' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                  : 'text-red-400 bg-red-500/10 border-red-500/20'
              )}>
                {issue.difficulty} · {issue.points} pts
              </span>
              {issue.bountyAmount && (
                <Badge variant="warning" className="text-xs">
                  {issue.bountyAmount} {issue.bountyToken} bounty
                </Badge>
              )}
            </div>

            <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{issue.description}</p>

            {issue.requirements.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-foreground mt-4 mb-2">Requirements</h3>
                <ul className="space-y-1.5">
                  {issue.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {issue.skills.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-foreground mt-4 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {issue.skills.map((skill) => (
                    <Badge key={skill} variant="muted" className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </>
            )}

            {issue.bountyAmount && (
              <>
                <h3 className="text-sm font-semibold text-foreground mt-4 mb-2">Reward</h3>
                <div className="rounded-lg bg-yellow-500/5 border border-yellow-500/20 p-3">
                  <p className="text-sm font-semibold text-yellow-400">
                    {issue.bountyAmount} {issue.bountyToken}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Paid upon successful merge and review
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Applications */}
          <div className="rounded-xl border border-border overflow-hidden">
            <Tabs defaultValue="applications">
              <div className="px-5 pt-4 border-b border-border">
                <TabsList>
                  <TabsTrigger value="applications">
                    Applications
                    <Badge variant="muted" className="ml-1.5 text-[10px] px-1">{issue.applications.length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="applications" className="m-0">
                {issue.applications.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No applications yet.
                  </div>
                ) : (
                  <div className="divide-y divide-border/50">
                    {issue.applications.map((app) => (
                      <ApplicationRow key={app.id} app={app} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          {/* Project info */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Project</h3>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                {issue.projectName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{issue.projectName}</p>
                <p className="text-xs text-muted-foreground">{issue.organizationName}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-3 text-xs h-7 gap-1.5" asChild>
              <Link href={`/dashboard/projects/${issue.projectId}`}>
                <FolderKanban className="h-3.5 w-3.5" />
                View Project
              </Link>
            </Button>
          </div>

          {/* Maintainer card */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Maintainer</h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">AB</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">Alex Builder</p>
                <p className="text-xs text-muted-foreground">@alexbuilder</p>
              </div>
            </div>
          </div>

          {/* Similar issues */}
          {similar.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Similar Issues</h3>
              <div className="space-y-3">
                {similar.map((s) => (
                  <Link
                    key={s.id}
                    href={`/dashboard/issues/${s.id}`}
                    className="block group"
                  >
                    <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{s.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.projectName} · {s.daysOpen}d open</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
