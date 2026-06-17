'use client';
import * as React from 'react';
import Link from 'next/link';
import { Plus, Zap, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/design-system/page-header';
import { MetricCard } from '@/components/design-system/metric-card';
import { EmptyState } from '@/components/design-system/empty-state';
import { CreateOpportunityDialog } from '@/components/dialogs/create-opportunity-dialog';
import { useOpportunities } from '@/lib/hooks/use-opportunities';
import type { OpportunityType, Opportunity } from '@/lib/hooks/use-opportunities';
import { cn } from '@/lib/utils';

const FILTER_TABS: { label: string; value: OpportunityType | 'all' }[] = [
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

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: 'text-green-400 bg-green-500/10 border-green-500/20',
  intermediate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  advanced: 'text-red-400 bg-red-500/10 border-red-500/20',
};

function OpportunityCard({ opp }: { opp: Opportunity }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 hover:border-border/80 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant={TYPE_BADGE_VARIANT[opp.type] ?? 'muted'} className="text-[10px] capitalize">
              {opp.type.replace(/-/g, ' ')}
            </Badge>
            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border', DIFFICULTY_COLOR[opp.difficulty])}>
              {opp.difficulty}
            </span>
            {opp.bountyAmount && (
              <Badge variant="warning" className="text-[10px]">
                {opp.bountyAmount} {opp.bountyToken}
              </Badge>
            )}
          </div>
          <Link href={`/dashboard/opportunities/${opp.id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
            {opp.title}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">{opp.projectName} · {opp.organizationName}</p>
        </div>
        <span className={cn(
          'text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0',
          opp.status === 'open' ? 'text-green-400 bg-green-500/10 border-green-500/20'
            : opp.status === 'in-progress' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20'
            : 'text-muted-foreground bg-muted border-border'
        )}>
          {opp.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {opp.skills.slice(0, 4).map((skill) => (
          <Badge key={skill} variant="muted" className="text-[10px] px-1.5">{skill}</Badge>
        ))}
        {opp.skills.length > 4 && (
          <Badge variant="muted" className="text-[10px] px-1.5">+{opp.skills.length - 4}</Badge>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {opp.applicantCount} applicants
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {opp.daysOpen}d open
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-xs h-7 text-muted-foreground hover:text-destructive"
        >
          {opp.status === 'open' ? 'Close' : 'Reopen'}
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-7" asChild>
          <Link href={`/dashboard/opportunities/${opp.id}`}>Manage</Link>
        </Button>
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  const [activeFilter, setActiveFilter] = React.useState<OpportunityType | 'all'>('all');
  const { data: allOpps = [], isLoading } = useOpportunities();

  const filtered = activeFilter === 'all'
    ? allOpps
    : allOpps.filter((o) => o.type === activeFilter);

  const totalOpen = allOpps.filter((o) => o.status === 'open').length;
  const totalInProgress = allOpps.filter((o) => o.status === 'in-progress').length;
  const totalClosed = allOpps.filter((o) => o.status === 'closed').length;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Opportunities"
        description="Manage contribution opportunities across your projects."
        actions={
          <CreateOpportunityDialog>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Opportunity
            </Button>
          </CreateOpportunityDialog>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="Total" value={allOpps.length} icon={Zap} accent />
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
        <span className="ml-auto text-xs text-muted-foreground">{filtered.length} opportunities</span>
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
          title="No opportunities"
          description="Create your first contribution opportunity to attract contributors."
          action={{ label: 'New Opportunity' }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </div>
      )}
    </div>
  );
}
