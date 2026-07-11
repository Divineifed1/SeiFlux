'use client';
import * as React from 'react';
import Link from 'next/link';
import { Plus, Zap, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/design-system/page-header';
import { MetricCard } from '@/components/design-system/metric-card';
import { EmptyState } from '@/components/design-system/empty-state';
import { CreateIssueDialog } from '@/components/dialogs/create-issue-dialog';
import { useIssues } from '@/lib/hooks/use-issues';
import type { IssueType, Issue } from '@/lib/hooks/use-issues';
import { cn } from '@/lib/utils';

const FILTER_TABS: { label: string; value: IssueType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Good First Issue', value: 'good-first-issue' },
  { label: 'Bounty', value: 'bounty' },
  { label: 'Documentation', value: 'documentation' },
  { label: 'Bug Fix', value: 'bug-fix' },
  { label: 'Feature', value: 'feature' },
];

const TYPE_BADGE_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'muted' | 'destructive'> = {
  'good-first-issue': 'success',
  'bounty': 'warning',
  'documentation': 'info',
  'bug-fix': 'destructive',
  'feature': 'muted',
};

const DIFFICULTY_CONFIG: Record<string, { label: string; points: number; className: string }> = {
  beginner: { label: 'Beginner', points: 50, className: 'text-green-400 bg-green-500/10 border-green-500/20' },
  intermediate: { label: 'Intermediate', points: 75, className: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  advanced: { label: 'Advanced', points: 100, className: 'text-red-400 bg-red-500/10 border-red-500/20' },
};

function IssueCard({ issue }: { issue: Issue }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 hover:border-border/80 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant={TYPE_BADGE_VARIANT[issue.type] ?? 'muted'} className="text-[10px] capitalize">
              {issue.type.replace(/-/g, ' ')}
            </Badge>
            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border', DIFFICULTY_CONFIG[issue.difficulty]?.className)}>
              {DIFFICULTY_CONFIG[issue.difficulty]?.label ?? issue.difficulty}
            </span>
            <Badge variant="info" className="text-[10px]">
              {issue.points} pts
            </Badge>
            {issue.bountyAmount && (
              <Badge variant="warning" className="text-[10px]">
                {issue.bountyAmount} {issue.bountyToken}
              </Badge>
            )}
          </div>
          <Link href={`/dashboard/issues/${issue.id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
            {issue.title}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">{issue.projectName} · {issue.organizationName}</p>
        </div>
        <span className={cn(
          'text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0',
          issue.status === 'open' ? 'text-green-400 bg-green-500/10 border-green-500/20'
            : issue.status === 'in-progress' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
            : 'text-muted-foreground bg-muted border-border'
        )}>
          {issue.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {issue.skills.slice(0, 4).map((skill) => (
          <Badge key={skill} variant="muted" className="text-[10px] px-1.5">{skill}</Badge>
        ))}
        {issue.skills.length > 4 && (
          <Badge variant="muted" className="text-[10px] px-1.5">+{issue.skills.length - 4}</Badge>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {issue.applicantCount} applicants
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {issue.daysOpen}d open
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-xs h-7 text-muted-foreground hover:text-destructive"
        >
          {issue.status === 'open' ? 'Close' : 'Reopen'}
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-7" asChild>
          <Link href={`/dashboard/issues/${issue.id}`}>Manage</Link>
        </Button>
      </div>
    </div>
  );
}

export default function IssuesPage() {
  const [activeFilter, setActiveFilter] = React.useState<IssueType | 'all'>('all');
  const { data: allIssues = [], isLoading } = useIssues();

  const filtered = activeFilter === 'all'
    ? allIssues
    : allIssues.filter((o) => o.type === activeFilter);

  const totalOpen = allIssues.filter((o) => o.status === 'open').length;
  const totalInProgress = allIssues.filter((o) => o.status === 'in-progress').length;
  const totalClosed = allIssues.filter((o) => o.status === 'closed').length;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Issues"
        description="Manage contribution issues across your projects."
        actions={
          <CreateIssueDialog>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Issue
            </Button>
          </CreateIssueDialog>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="Total" value={allIssues.length} icon={Zap} accent />
        <MetricCard title="Open" value={totalOpen} icon={Zap} />
        <MetricCard title="In Progress" value={totalInProgress} icon={Users} />
        <MetricCard title="Closed" value={totalClosed} icon={Clock} />
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              activeFilter === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            {tab.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} issues</span>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No issues"
          description="Create your first contribution issue to attract contributors."
          action={{ label: 'New Issue' }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}
