'use client';
import * as React from 'react';
import { Zap, FileText, GitMerge, Trophy, Users } from 'lucide-react';
import { PageHeader } from '@/components/design-system/page-header';
import { SectionHeader } from '@/components/design-system/section-header';
import { MetricCard } from '@/components/design-system/metric-card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ISSUE_STATUS = [
  { label: 'Open', count: 18, color: '#3b82f6' },
  { label: 'In Review', count: 6, color: '#eab308' },
  { label: 'Merged', count: 24, color: '#22c55e' },
  { label: 'Closed', count: 9, color: '#64748b' },
];

const TOP_CONTRIBUTORS = [
  { name: 'Dev Contributor', handle: 'dev_contributor', assigned: 4, merged: 5, points: 620 },
  { name: 'Alex Builder', handle: 'alex_builder', assigned: 3, merged: 4, points: 540 },
  { name: 'Sarah Kim', handle: 'sarah_builds', assigned: 2, merged: 3, points: 410 },
  { name: 'Marcus Webb', handle: 'mwebb_eng', assigned: 1, merged: 2, points: 260 },
];

const PROJECT_HEALTH = [
  { name: 'SeiSwap DEX', open: 8, applications: 14, assigned: 5 },
  { name: 'SeiLend Protocol', open: 6, applications: 9, assigned: 3 },
  { name: 'SeiSwap SDK', open: 4, applications: 5, assigned: 2 },
];

export default function MaintainerAnalyticsPage() {
  const totalIssues = ISSUE_STATUS.reduce((a, c) => a + c.count, 0);

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Analytics"
        description="Contribution and assignment health across your projects."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="Open Issues" value={18} icon={Zap} change={12} changeLabel="vs last wave" accent />
        <MetricCard title="Applications" value={28} icon={FileText} change={9} changeLabel="vs last wave" />
        <MetricCard title="Merged PRs" value={24} icon={GitMerge} change={18} changeLabel="vs last wave" />
        <MetricCard title="Reward Pool" value="9.4K" prefix="" icon={Trophy} description="SEI distributed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-xl border border-border bg-card p-5">
          <SectionHeader title="Issues by status" description="Across all your projects" className="mb-5" />
          <div className="space-y-3">
            {ISSUE_STATUS.map((s) => {
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
            {PROJECT_HEALTH.map((p) => {
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
              {TOP_CONTRIBUTORS.map((c) => (
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
