'use client';
import * as React from 'react';
import Link from 'next/link';
import { Search, Users, ExternalLink, Star, Loader2 } from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/design-system/page-header';
import { EmptyState } from '@/components/design-system/empty-state';
import { MetricCard } from '@/components/design-system/metric-card';
import { useContributors, useContributorMetrics } from '@/lib/hooks/use-contributors';

export default function ContributorsPage() {
  const { data: contributors = [], isLoading: contributorsLoading } = useContributors();
  const { data: metrics, isLoading: metricsLoading } = useContributorMetrics();
  const [search, setSearch] = React.useState('');

  const filteredContributors = contributors.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.handle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Contributors"
        description="Developers contributing to your projects."
      />

      {metricsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-24 rounded-lg bg-muted animate-pulse" />
          <div className="h-24 rounded-lg bg-muted animate-pulse" />
          <div className="h-24 rounded-lg bg-muted animate-pulse" />
        </div>
      ) : metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard title="Total Contributors" value={metrics.total.value} icon={Users} change={metrics.total.change} changeLabel="this month" />
          <MetricCard title="Active This Month" value={metrics.active.value} icon={Users} accent />
          <MetricCard title="Completed Contributions" value={metrics.completed.value} icon={Star} change={metrics.completed.change} changeLabel="this month" />
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="max-w-xs flex-1">
          <Input
            placeholder="Search contributors..."
            startIcon={<Search />}
            className="h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {contributorsLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredContributors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contributors found"
          description={search ? "No contributors match your search." : "Publish contribution opportunities to attract developers to your projects."}
        />
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Contributor</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Skills</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Activity</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">Reputation</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filteredContributors.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={c.avatar} />
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {c.name.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">@{c.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {c.skills.slice(0, 3).map((s) => (
                        <Badge key={s} variant="muted" className="text-[10px] px-1.5">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        <span className="text-foreground font-medium">{c.activeProjects}</span> active
                      </span>
                      <span>
                        <span className="text-foreground font-medium">{c.completedContribs}</span> done
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden xl:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${c.reputation}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{c.reputation}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <a
                      href={`https://github.com/${c.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}