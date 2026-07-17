'use client';
import * as React from 'react';
import { Zap, FileText, GitMerge, Trophy, Users, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/design-system/page-header';
import { SectionHeader } from '@/components/design-system/section-header';
import { MetricCard } from '@/components/design-system/metric-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useMaintainerAnalytics } from '@/lib/hooks/use-maintainer-analytics';

export default function MaintainerAnalyticsPage() {
  const { data, isLoading } = useMaintainerAnalytics();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { metrics, issueStatus, projectHealth, topContributors } = data;
  const totalIssues = issueStatus.reduce((a, c) => a + c.count, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Analytics"
        description="Contribution and assignment health across your projects."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="Open Issues" value={metrics.openIssues.value} icon={Zap} change={metrics.openIssues.change} changeLabel="vs last wave" accent />
        <MetricCard title="Applications" value={metrics.applications.value} icon={FileText} change={metrics.applications.change} changeLabel="vs last wave" />
        <MetricCard title="Merged PRs" value={metrics.mergedPRs.value} icon={GitMerge} change={metrics.mergedPRs.change} changeLabel="vs last wave" />
        <MetricCard title="Reward Pool" value={metrics.rewardPool.value.toLocaleString()} prefix="" icon={Trophy} description={metrics.rewardPool.description} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-xl border border-border bg-card p-5">
          <SectionHeader title="Issues by status" description="Across all your projects" className="mb-5" />
          <div className="space-y-3">
            {issueStatus.map((s) => {
              const pct = totalIssues ? (s.count / totalIssues) * 100 : 0;
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      {s.label}
                    </span>
                    <span className="text-muted-foreground">{s.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <SectionHeader title="Project health" description="Open vs assigned issues" className="mb-5" />
          <div className="space-y-4">
            {projectHealth.map((p) => {
              const assignedPct = p.open ? (p.assigned / p.open) * 100 : 0;
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="text-muted-foreground">{p.assigned}/{p.open} assigned</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', assignedPct >= 60 ? 'bg-green-500/70' : 'bg-yellow-500/70')}
                      style={{ width: `${assignedPct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{p.applications} applications</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <SectionHeader title="Top Contributors" className="mb-5" />
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-2.5 font-medium text-muted-foreground text-xs">Contributor</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Assigned</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Merged</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Points</th>
              </tr>
            </thead>
            <tbody>
              {topContributors.map((c) => (
                <tr key={c.handle} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground">@{c.handle}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground tabular-nums">{c.assigned}</td>
                  <td className="px-4 py-3 text-sm text-foreground tabular-nums">{c.merged}</td>
                  <td className="px-4 py-3 text-sm text-foreground tabular-nums">
                    <Badge variant="muted" className="text-[10px]">{c.points} pts</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1.5">
          <Users className="h-3 w-3" />
          Rankings update at the end of each contribution wave.
        </p>
      </section>
    </div>
  );
}