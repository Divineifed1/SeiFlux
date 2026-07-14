'use client';
import * as React from 'react';
import { Zap, CheckCircle2, Clock, XCircle, Users } from 'lucide-react';
import { PageHeader } from '@/components/design-system/page-header';
import { SectionHeader } from '@/components/design-system/section-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type IssueStatus = 'open' | 'in_review' | 'merged' | 'closed';
type Assignment = 'assigned' | 'unassigned';

interface MaintainerIssue {
  id: string;
  title: string;
  project: string;
  applications: number;
  status: IssueStatus;
  assignment: Assignment;
  assignee?: string;
}

const ISSUES: MaintainerIssue[] = [
  { id: 'm_1', title: 'Implement price impact warnings in swap UI', project: 'SeiSwap DEX', applications: 3, status: 'open', assignment: 'unassigned' },
  { id: 'm_2', title: 'Fix slippage calculation edge case', project: 'SeiSwap DEX', applications: 1, status: 'in_review', assignment: 'assigned', assignee: 'dev_contributor' },
  { id: 'm_3', title: 'Improve liquidity position documentation', project: 'SeiSwap DEX', applications: 0, status: 'open', assignment: 'unassigned' },
  { id: 'm_4', title: 'Build position analytics dashboard', project: 'SeiSwap DEX', applications: 5, status: 'open', assignment: 'unassigned' },
  { id: 'm_5', title: 'Add mobile responsive header', project: 'SeiLend Protocol', applications: 2, status: 'open', assignment: 'unassigned' },
  { id: 'm_6', title: 'Optimise RPC batch calls', project: 'SeiLend Protocol', applications: 4, status: 'in_review', assignment: 'assigned', assignee: 'alex_builder' },
  { id: 'm_7', title: 'Write integration tests for router', project: 'SeiSwap SDK', applications: 1, status: 'open', assignment: 'unassigned' },
  { id: 'm_8', title: 'Create SeiSwap SDK usage examples', project: 'SeiSwap SDK', applications: 2, status: 'merged', assignment: 'assigned', assignee: 'dev_contributor' },
];

const STATUS_LABEL: Record<IssueStatus, string> = {
  open: 'Open',
  in_review: 'In Review',
  merged: 'Merged',
  closed: 'Closed',
};

const STATUS_VARIANT: Record<IssueStatus, 'info' | 'warning' | 'success' | 'muted'> = {
  open: 'info',
  in_review: 'warning',
  merged: 'success',
  closed: 'muted',
};

export default function MaintainerIssuesPage() {
  const [filter, setFilter] = React.useState<'all' | 'open' | 'assigned' | 'unassigned'>('all');

  const total = ISSUES.length;
  const open = ISSUES.filter((i) => i.status === 'open' || i.status === 'in_review').length;
  const assigned = ISSUES.filter((i) => i.assignment === 'assigned').length;
  const unassigned = ISSUES.filter((i) => i.assignment === 'unassigned').length;

  const filtered = ISSUES.filter((i) => {
    if (filter === 'open') return i.status === 'open' || i.status === 'in_review';
    if (filter === 'assigned') return i.assignment === 'assigned';
    if (filter === 'unassigned') return i.assignment === 'unassigned';
    return true;
  });

  const FILTERS: { value: typeof filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'unassigned', label: 'Unassigned' },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Issues"
        description="Manage issue assignments and review applications across your projects."
      />

      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Total issues</p>
          <p className="text-2xl font-bold text-foreground tabular-nums">{total}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Open</p>
          <p className="text-2xl font-bold text-info tabular-nums">{open}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Assigned</p>
          <p className="text-2xl font-bold text-green-400 tabular-nums">{assigned}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Unassigned</p>
          <p className="text-2xl font-bold text-yellow-400 tabular-nums">{unassigned}</p>
        </div>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <SectionHeader title="Project issues" className="mb-4" />

        <div className="flex items-center gap-2 mb-4">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                filter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{issue.title}</p>
                <p className="text-xs text-muted-foreground">{issue.project}</p>
              </div>

              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Users className="h-3.5 w-3.5" />
                {issue.applications} applied
              </span>

              {issue.assignment === 'assigned' ? (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset bg-green-500/10 text-green-400 ring-green-500/20 shrink-0">
                  <CheckCircle2 className="h-3 w-3" />
                  @{issue.assignee}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset bg-muted text-muted-foreground ring-border shrink-0">
                  <Clock className="h-3 w-3" />
                  Unassigned
                </span>
              )}

              <Badge variant={STATUS_VARIANT[issue.status]} className="shrink-0 text-[10px]">
                {STATUS_LABEL[issue.status]}
              </Badge>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-lg border border-dashed border-border py-10 text-center">
              <XCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No issues match this filter.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
