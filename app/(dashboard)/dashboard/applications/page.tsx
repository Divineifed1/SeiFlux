'use client';
import * as React from 'react';
import Link from 'next/link';
import { Search, FileText, Check, X, Eye, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader } from '@/components/design-system/page-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { MetricCard } from '@/components/design-system/metric-card';
import { formatRelativeTime } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type AppStatus = 'pending' | 'review' | 'approved' | 'rejected';

const INITIAL_APPLICATIONS = [
  {
    id: '1', applicant: 'Alex Chen', handle: 'alexc_dev',
    opportunity: 'Fix slippage calculation edge case', project: 'SeiSwap DEX',
    status: 'pending' as AppStatus, appliedAt: new Date(Date.now() - 1000 * 60 * 30),
    skills: ['TypeScript'],
  },
  {
    id: '2', applicant: 'Sarah Kim', handle: 'sarah_builds',
    opportunity: 'Build position analytics dashboard', project: 'SeiSwap DEX',
    status: 'review' as AppStatus, appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    skills: ['React', 'TypeScript'],
  },
  {
    id: '3', applicant: 'John Rivera', handle: 'john_dev',
    opportunity: 'Improve liquidity position docs', project: 'SeiSwap DEX',
    status: 'approved' as AppStatus, appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    skills: ['Technical Writing'],
  },
  {
    id: '4', applicant: 'Maya Patel', handle: 'maya_codes',
    opportunity: 'Implement price impact warnings', project: 'SeiSwap DEX',
    status: 'rejected' as AppStatus, appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    skills: ['React', 'TypeScript'],
  },
  {
    id: '5', applicant: "Liam O'Brien", handle: 'liam_ob',
    opportunity: 'CosmWasm contract audit helper', project: 'SeiLend Protocol',
    status: 'pending' as AppStatus, appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    skills: ['Rust', 'CosmWasm'],
  },
  {
    id: '6', applicant: 'Amara Osei', handle: 'amara_dev',
    opportunity: 'Add multi-hop routing algorithm', project: 'SeiSwap DEX',
    status: 'review' as AppStatus, appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    skills: ['Rust', 'Algorithms'],
  },
];

type Filter = 'all' | AppStatus;

export default function ApplicationsPage() {
  const [applications, setApplications] = React.useState(INITIAL_APPLICATIONS);
  const [filter, setFilter] = React.useState<Filter>('all');
  const [search, setSearch] = React.useState('');

  const pending = applications.filter((a) => a.status === 'pending').length;
  const approved = applications.filter((a) => a.status === 'approved').length;
  const inReview = applications.filter((a) => a.status === 'review').length;

  const filtered = applications.filter((a) => {
    const matchesFilter = filter === 'all' || a.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      a.applicant.toLowerCase().includes(q) ||
      a.opportunity.toLowerCase().includes(q) ||
      a.project.toLowerCase().includes(q) ||
      a.handle.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  function updateStatus(id: string, status: AppStatus) {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    const app = applications.find((a) => a.id === id);
    if (!app) return;
    if (status === 'approved') {
      toast({
        variant: 'success',
        title: 'Application approved',
        description: `${app.applicant}'s application has been approved.`,
      });
    } else if (status === 'rejected') {
      toast({
        variant: 'destructive',
        title: 'Application rejected',
        description: `${app.applicant}'s application has been rejected.`,
      });
    }
  }

  const FILTERS: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'review', label: 'In Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Applications"
        description="Review and manage contributor applications across your projects."
      />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard title="Total" value={applications.length} icon={FileText} />
        <MetricCard title="Pending Review" value={pending} icon={FileText} accent />
        <MetricCard title="In Review" value={inReview} icon={Users} />
        <MetricCard title="Approved" value={approved} icon={TrendingUp} change={14} changeLabel="vs last week" />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="max-w-xs flex-1 w-full">
          <Input
            placeholder="Search applications..."
            startIcon={<Search />}
            className="h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {f.label}
              {f.value === 'pending' && pending > 0 && filter !== 'pending' && (
                <span className="ml-1 text-primary">({pending})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No applications match your search.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Applicant</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Opportunity</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Applied</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                          {app.applicant.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/dashboard/contributors/1`}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {app.applicant}
                        </Link>
                        <p className="text-xs text-muted-foreground">@{app.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-sm text-foreground line-clamp-1">{app.opportunity}</p>
                    <p className="text-xs text-muted-foreground">{app.project}</p>
                    <div className="flex gap-1 mt-1">
                      {app.skills.map((s) => (
                        <Badge key={s} variant="muted" className="text-[10px] px-1.5">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell text-xs text-muted-foreground">
                    {formatRelativeTime(app.appliedAt)}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Button variant="ghost" size="icon-sm" title="View applicant">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {app.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            title="Approve"
                            onClick={() => updateStatus(app.id, 'approved')}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:bg-destructive/10"
                            title="Reject"
                            onClick={() => updateStatus(app.id, 'rejected')}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      {app.status === 'review' && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                          title="Approve"
                          onClick={() => updateStatus(app.id, 'approved')}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
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
