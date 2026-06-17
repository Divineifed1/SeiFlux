'use client';
import * as React from 'react';
import { Users, GitPullRequest, GitMerge, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader } from '@/components/design-system/page-header';
import { MetricCard } from '@/components/design-system/metric-card';
import { SectionHeader } from '@/components/design-system/section-header';
import { useAnalytics, type AnalyticsPeriod } from '@/lib/hooks/use-analytics';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const [period, setPeriod] = React.useState<AnalyticsPeriod>('30d');
  const { data, isLoading } = useAnalytics(period);

  const PERIOD_OPTS: { label: string; value: AnalyticsPeriod }[] = [
    { label: 'Last 7d', value: '7d' },
    { label: 'Last 30d', value: '30d' },
    { label: 'Last 90d', value: '90d' },
  ];

  if (isLoading || !data) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="h-16 rounded-lg bg-muted animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />)}
        </div>
      </div>
    );
  }

  const maxRepoCommits = Math.max(...data.repoActivity.map((r) => r.commits), 1);
  const maxContrib = Math.max(...data.contributorGrowth.map((w) => w.newContributors + w.returning), 1);
  const maxPR = Math.max(...data.prFlow.map((w) => w.open + w.merged + w.closed), 1);
  const totalIssues = data.issueCategories.reduce((a, c) => a + c.count, 0);

  // Conic gradient for donut
  let conicParts: string[] = [];
  let acc = 0;
  data.issueCategories.forEach((cat) => {
    const pct = (cat.count / totalIssues) * 100;
    conicParts.push(`${cat.color} ${acc}% ${acc + pct}%`);
    acc += pct;
  });
  const conicGradient = `conic-gradient(${conicParts.join(', ')})`;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Analytics"
        description="Track contributor activity and project health across your organization."
        actions={
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted">
            {PERIOD_OPTS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={cn(
                  'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                  period === opt.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        }
      />

      {/* Top metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard
          title="Active Contributors"
          value={data.activeContributors}
          icon={Users}
          change={data.activeContributorsChange}
          changeLabel="vs prev period"
          accent
        />
        <MetricCard
          title="Open PRs"
          value={data.openPRs}
          icon={GitPullRequest}
          change={data.openPRsChange}
          changeLabel="vs prev period"
        />
        <MetricCard
          title="Merged PRs"
          value={data.mergedPRs}
          icon={GitMerge}
          change={data.mergedPRsChange}
          changeLabel="this period"
        />
        <MetricCard
          title="Resolution Rate"
          value={data.issueResolutionRate}
          suffix="%"
          icon={CheckCircle2}
          change={data.issueResolutionRateChange}
          changeLabel="vs prev period"
        />
      </div>

      {/* Repository Activity */}
      <section className="rounded-xl border border-border bg-card p-5">
        <SectionHeader title="Repository Activity" description="Commit volume per repository" className="mb-5" />
        <div className="space-y-4">
          {data.repoActivity.map((repo) => (
            <div key={repo.repo}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">{repo.repo}</span>
                <span className="text-xs text-muted-foreground">{repo.commits} commits</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/70"
                  style={{ width: `${(repo.commits / maxRepoCommits) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-4 mt-1 text-[10px] text-muted-foreground">
                <span>{repo.prsOpened} PRs opened</span>
                <span>{repo.prsMerged} merged</span>
                <span>{repo.issues} issues</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Contributor Growth */}
        <section className="rounded-xl border border-border bg-card p-5">
          <SectionHeader title="Contributor Growth" description="New vs returning contributors" className="mb-5" />
          <div className="space-y-3">
            {data.contributorGrowth.map((w) => {
              const total = w.newContributors + w.returning;
              const newPct = total ? (w.newContributors / maxContrib) * 100 : 0;
              const retPct = total ? (w.returning / maxContrib) * 100 : 0;
              return (
                <div key={w.week} className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground w-14 shrink-0 text-right">{w.week}</span>
                  <div className="flex-1 flex gap-0.5 h-4 rounded overflow-hidden">
                    {w.newContributors > 0 && (
                      <div
                        className="h-full bg-primary/80 rounded-l"
                        style={{ width: `${newPct}%` }}
                        title={`${w.newContributors} new`}
                      />
                    )}
                    {w.returning > 0 && (
                      <div
                        className="h-full bg-primary/30"
                        style={{ width: `${retPct}%` }}
                        title={`${w.returning} returning`}
                      />
                    )}
                  </div>
                  <span className="text-muted-foreground w-8 text-right tabular-nums">{total}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary/80 shrink-0" />New contributors</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary/30 shrink-0" />Returning</span>
          </div>
        </section>

        {/* PR Flow */}
        <section className="rounded-xl border border-border bg-card p-5">
          <SectionHeader title="PR Flow" description="Open / merged / closed per period" className="mb-5" />
          <div className="space-y-3">
            {data.prFlow.map((w) => {
              const total = w.open + w.merged + w.closed;
              return (
                <div key={w.week} className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground w-14 shrink-0 text-right">{w.week}</span>
                  <div className="flex-1 flex gap-0.5 h-4 rounded overflow-hidden">
                    {w.open > 0 && (
                      <div
                        className="h-full bg-green-500/60"
                        style={{ width: `${(w.open / maxPR) * 100}%` }}
                        title={`${w.open} open`}
                      />
                    )}
                    {w.merged > 0 && (
                      <div
                        className="h-full bg-purple-500/60"
                        style={{ width: `${(w.merged / maxPR) * 100}%` }}
                        title={`${w.merged} merged`}
                      />
                    )}
                    {w.closed > 0 && (
                      <div
                        className="h-full bg-muted-foreground/30"
                        style={{ width: `${(w.closed / maxPR) * 100}%` }}
                        title={`${w.closed} closed`}
                      />
                    )}
                  </div>
                  <span className="text-muted-foreground w-8 text-right tabular-nums">{total}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-green-500/60 shrink-0" />Open</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-purple-500/60 shrink-0" />Merged</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-muted-foreground/30 shrink-0" />Closed</span>
          </div>
        </section>
      </div>

      {/* Top contributors table */}
      <section className="rounded-xl border border-border bg-card p-5">
        <SectionHeader title="Top Contributors" className="mb-5" />
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-2.5 font-medium text-muted-foreground text-xs">Contributor</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Merged PRs</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Open PRs</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden md:table-cell">Issues Closed</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs hidden lg:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.topContributors.map((c) => (
                <tr key={c.handle} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                          {c.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">@{c.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground font-medium tabular-nums">{c.mergedPRs}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums hidden md:table-cell">{c.openPRs}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums hidden md:table-cell">{c.issuesClosed}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{c.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Issue Resolution Rate by category */}
      <section className="rounded-xl border border-border bg-card p-5">
        <SectionHeader title="Issue Resolution Rate by Category" className="mb-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Donut chart */}
          <div className="flex items-center justify-center">
            <div className="relative h-40 w-40">
              <div
                className="h-full w-full rounded-full"
                style={{ background: conicGradient }}
              />
              {/* Center hole */}
              <div className="absolute inset-6 rounded-full bg-card flex items-center justify-center">
                <span className="text-xs font-semibold text-foreground">{totalIssues} total</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {data.issueCategories.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1 text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="font-medium text-foreground">{cat.category}</span>
                  </span>
                  <span className="text-muted-foreground">{cat.resolutionRate}% resolved</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${cat.resolutionRate}%`, backgroundColor: cat.color }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{cat.count} issues</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
