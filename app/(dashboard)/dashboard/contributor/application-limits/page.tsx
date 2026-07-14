'use client';
import * as React from 'react';
import { Gauge, Zap, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/design-system/page-header';
import { SectionHeader } from '@/components/design-system/section-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  useContributorApplications,
  CURRENT_WAVE,
  type AssignmentStatus,
} from '@/lib/hooks/use-contributor-applications';

const ASSIGNMENT_CONFIG: Record<
  AssignmentStatus,
  { label: string; className: string }
> = {
  assigned_to_you: {
    label: 'Assigned to you',
    className: 'bg-green-500/10 text-green-400 ring-green-500/20',
  },
  assigned_to_other: {
    label: 'Assigned to another',
    className: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
  },
  unassigned: {
    label: 'Not assigned yet',
    className: 'bg-muted text-muted-foreground ring-border',
  },
};

export default function ApplicationLimitsPage() {
  const { applications, usedSlots, availableSlots, totalSlots } = useContributorApplications();
  const pct = Math.round((usedSlots / totalSlots) * 100);
  const nearLimit = availableSlots <= 2;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Application Limits"
        description="Track your active issue applications for the current wave."
        actions={
          <Badge variant="info" className="gap-1">
            <Zap className="h-3 w-3" />
            {CURRENT_WAVE.name}
          </Badge>
        }
      />

      {/* Limit summary */}
      <Card className={cn(nearLimit && 'border-yellow-500/30')}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Active applications
              </p>
              <p className="text-3xl font-bold text-foreground tabular-nums">
                {usedSlots}
                <span className="text-lg text-muted-foreground font-medium"> / {totalSlots}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {availableSlots} slot{availableSlots === 1 ? '' : 's'} available
              </p>
            </div>
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-xl',
                nearLimit ? 'bg-yellow-500/15 text-yellow-400' : 'bg-primary/15 text-primary'
              )}
            >
              <Gauge className="h-6 w-6" />
            </div>
          </div>

          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                nearLimit ? 'bg-yellow-400' : 'bg-primary'
              )}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            {nearLimit ? (
              <AlertTriangle className="h-3.5 w-3.5 text-yellow-400 mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-400 mt-0.5 shrink-0" />
            )}
            <p>
              You can hold up to {totalSlots} active issue applications per wave. Slots free up
              automatically when an application is accepted (approved or merged), so accepted
              issues no longer count toward your limit.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Applications breakdown */}
      <section className="rounded-xl border border-border bg-card p-5">
        <SectionHeader
          title="Your applications"
          description="Issues you've applied to in this wave and whether they consume a slot."
          className="mb-4"
        />
        <div className="space-y-2">
          {applications.map((app) => {
            const consumesSlot = app.status === 'pending' || app.status === 'review';
            const assignment = ASSIGNMENT_CONFIG[app.assignedTo];
            return (
              <div
                key={app.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{app.issueTitle}</p>
                  <p className="text-xs text-muted-foreground">{app.projectName}</p>
                </div>

                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset shrink-0',
                    assignment.className
                  )}
                >
                  {app.assignedTo === 'assigned_to_you' && <CheckCircle2 className="h-3 w-3" />}
                  {app.assignedTo === 'assigned_to_other' && <XCircle className="h-3 w-3" />}
                  {app.assignedTo === 'unassigned' && <Clock className="h-3 w-3" />}
                  {assignment.label}
                </span>

                <StatusBadge status={app.status} className="shrink-0" />

                <span
                  className={cn(
                    'w-24 text-right text-[10px] shrink-0',
                    consumesSlot ? 'text-muted-foreground' : 'text-green-400'
                  )}
                >
                  {consumesSlot ? 'Uses a slot' : 'Slot freed'}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
