'use client';
import * as React from 'react';
import Link from 'next/link';
import { Zap, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { PageHeader } from '@/components/design-system/page-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/design-system/empty-state';
import { cn } from '@/lib/utils';
import {
  useContributorApplications,
  type AssignmentStatus,
} from '@/lib/hooks/use-contributor-applications';

const ASSIGNMENT_CONFIG: Record<
  AssignmentStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  assigned_to_you: {
    label: 'Assigned to you',
    className: 'bg-green-500/10 text-green-400 ring-green-500/20',
    icon: CheckCircle2,
  },
  assigned_to_other: {
    label: 'Assigned to another',
    className: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
    icon: XCircle,
  },
  unassigned: {
    label: 'Not assigned yet',
    className: 'bg-muted text-muted-foreground ring-border',
    icon: Clock,
  },
};

export default function ContributorIssuesPage() {
  const { applications } = useContributorApplications();

  const assignedToYou = applications.filter((a) => a.assignedTo === 'assigned_to_you').length;
  const assignedToOther = applications.filter((a) => a.assignedTo === 'assigned_to_other').length;
  const unassigned = applications.filter((a) => a.assignedTo === 'unassigned').length;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="My Issues"
        description="Issues you've applied to and their current assignment status."
      />

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Assigned to you</p>
          <p className="text-2xl font-bold text-green-400 tabular-nums">{assignedToYou}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Assigned to another</p>
          <p className="text-2xl font-bold text-yellow-400 tabular-nums">{assignedToOther}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Not assigned yet</p>
          <p className="text-2xl font-bold text-foreground tabular-nums">{unassigned}</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No applications yet"
          description="Apply to issues to start contributing and track them here."
        />
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs">Issue</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden md:table-cell">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs">Assignment</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const assignment = ASSIGNMENT_CONFIG[app.assignedTo];
                const AssignmentIcon = assignment.icon;
                return (
                  <tr
                    key={app.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-foreground">{app.issueTitle}</p>
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground hidden md:table-cell">
                      {app.projectName}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset',
                          assignment.className
                        )}
                      >
                        <AssignmentIcon className="h-3 w-3" />
                        {assignment.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
                        <Link href={`/projects/${app.projectSlug}`} target="_blank">
                          View
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
