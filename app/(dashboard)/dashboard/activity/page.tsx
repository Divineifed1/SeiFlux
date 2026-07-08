'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  GitMerge, GitPullRequest, Plus, Zap, Users, FileText, Building2, RefreshCw, Activity,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/design-system/page-header';
import { EmptyState } from '@/components/design-system/empty-state';
import { useActivityFeed } from '@/lib/hooks/use-activity';
import type { ActivityEventType } from '@/lib/hooks/use-activity';
import { cn } from '@/lib/utils';

// ─── Event type config ─────────────────────────────────────────────────────────

const EVENT_CONFIG: Record<
  ActivityEventType,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    badgeVariant: 'success' | 'info' | 'warning' | 'muted' | 'destructive';
  }
> = {
  pr_merged: { label: 'PR Merged', icon: GitMerge, color: 'text-green-400 bg-green-500/10', badgeVariant: 'success' },
  pr_opened: { label: 'PR Opened', icon: GitPullRequest, color: 'text-blue-400 bg-blue-500/10', badgeVariant: 'info' },
  project_created: { label: 'New Project', icon: Plus, color: 'text-primary bg-primary/10', badgeVariant: 'info' },
  contributor_joined: { label: 'New Contributor', icon: Users, color: 'text-purple-400 bg-purple-500/10', badgeVariant: 'muted' },
  issue_posted: { label: 'Issue', icon: Zap, color: 'text-yellow-400 bg-yellow-500/10', badgeVariant: 'warning' },
  application_submitted: { label: 'Application', icon: FileText, color: 'text-muted-foreground bg-muted', badgeVariant: 'muted' },
  org_created: { label: 'New Org', icon: Building2, color: 'text-orange-400 bg-orange-500/10', badgeVariant: 'warning' },
};

const FILTER_OPTIONS: { label: string; value: ActivityEventType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'PRs', value: 'pr_merged' },
  { label: 'Projects', value: 'project_created' },
  { label: 'Contributors', value: 'contributor_joined' },
  { label: 'Issues', value: 'issue_posted' },
  { label: 'Applications', value: 'application_submitted' },
];

export default function ActivityPage() {
  const [filter, setFilter] = React.useState<ActivityEventType | 'all'>('all');
  const { data: events = [], isLoading, refetch } = useActivityFeed(50);

  const filtered = filter === 'all'
    ? events
    : events.filter((e) => e.type === filter || (filter === 'pr_merged' && e.type === 'pr_opened'));

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Activity Feed"
        description="Real-time activity across the Sei Builders ecosystem."
        actions={
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        }
      />

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filter === opt.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted',
            )}
          >
            {opt.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} events</span>
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3.5 bg-muted animate-pulse rounded w-3/4" />
                <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          description="Activity from the Sei ecosystem will appear here."
        />
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-4 bottom-4 w-px bg-border/50" aria-hidden />

          <div className="space-y-1">
            {filtered.map((event, i) => {
              const config = EVENT_CONFIG[event.type];
              const Icon = config.icon;

              return (
                <div key={event.id} className="relative flex gap-4 pb-4 last:pb-0">
                  {/* Icon node */}
                  <div className={cn(
                    'relative z-10 h-9 w-9 rounded-full flex items-center justify-center shrink-0 border-2 border-background',
                    config.color,
                  )}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1 pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <Avatar className="h-5 w-5 shrink-0">
                            <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-semibold">
                              {event.actor.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-semibold text-foreground">{event.actor.name}</span>
                          <span className="text-xs text-muted-foreground">{event.description}</span>
                          <Badge variant={config.badgeVariant} className="text-[9px] px-1.5 py-0">
                            {config.label}
                          </Badge>
                        </div>
                        {event.targetHref ? (
                          <Link
                            href={event.targetHref}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors line-clamp-1 hover:underline"
                          >
                            {event.target}
                          </Link>
                        ) : (
                          <p className="text-xs text-muted-foreground line-clamp-1">{event.target}</p>
                        )}
                        {event.meta && (
                          <div className="flex items-center gap-2 mt-0.5">
                            {Object.entries(event.meta).map(([k, v]) => (
                              <span key={k} className="text-[10px] text-muted-foreground/60">
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0 pt-0.5">{event.createdAt}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

