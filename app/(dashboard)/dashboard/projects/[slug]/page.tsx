import type { Metadata } from 'next';
import * as React from 'react';
import Link from 'next/link';
import {
  Edit,
  Plus,
  Users,
  FileText,
  Star,
  GitFork,
  Globe,
  ExternalLink,
  ArrowLeft,
  ChevronRight,
  Eye,
  Check,
  X,
  Zap,
  Code2,
  Clock,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/design-system/page-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { MetricCard } from '@/components/design-system/metric-card';
import { EmptyState } from '@/components/design-system/empty-state';
import { CreateOpportunityDialog } from '@/components/dialogs/create-opportunity-dialog';
import { formatRelativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Manage Project' };

const PROJECT = {
  id: '1',
  name: 'SeiSwap DEX',
  slug: 'seiswap-dex',
  org: 'SeiSwap Labs',
  orgId: '1',
  description:
    'Decentralized exchange built natively on Sei for ultra-fast, low-cost token swaps with concentrated liquidity.',
  website: 'https://seiswap.example.com',
  github: 'https://github.com/seiswap/seiswap-dex',
  status: 'approved',
  stars: 1243,
  forks: 89,
  contributors: 18,
  openIssues: 12,
  totalApplications: 47,
  tags: ['DeFi', 'AMM', 'Concentrated Liquidity'],
  tech: ['Rust', 'TypeScript', 'React', 'CosmWasm'],
  lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 48),
};

const ISSUES = [
  {
    id: '1', title: 'Implement price impact warnings in swap UI',
    type: 'feature', difficulty: 'intermediate',
    skills: ['React', 'TypeScript'], applications: 3,
    status: 'open', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: '2', title: 'Fix slippage calculation edge case',
    type: 'bug', difficulty: 'beginner',
    skills: ['TypeScript'], applications: 1,
    status: 'open', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: '3', title: 'Improve liquidity position documentation',
    type: 'documentation', difficulty: 'beginner',
    skills: ['Technical Writing'], applications: 0,
    status: 'open', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
  {
    id: '4', title: 'Build position analytics dashboard',
    type: 'feature', difficulty: 'advanced',
    skills: ['React', 'TypeScript', 'Rust'], applications: 5,
    status: 'open', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
  },
  {
    id: '5', title: 'Add multi-hop routing algorithm',
    type: 'feature', difficulty: 'advanced',
    skills: ['Rust', 'CosmWasm'], applications: 2,
    status: 'closed', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
  },
];

const APPLICATIONS = [
  {
    id: '1', applicant: 'Alex Chen', handle: 'alexc_dev',
    opportunity: 'Fix slippage calculation edge case',
    status: 'pending', appliedAt: new Date(Date.now() - 1000 * 60 * 30),
    skills: ['TypeScript'],
  },
  {
    id: '2', applicant: 'Sarah Kim', handle: 'sarah_builds',
    opportunity: 'Build position analytics dashboard',
    status: 'review', appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    skills: ['React', 'TypeScript'],
  },
  {
    id: '3', applicant: 'John Rivera', handle: 'john_dev',
    opportunity: 'Improve liquidity position docs',
    status: 'approved', appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
    skills: ['Technical Writing'],
  },
  {
    id: '4', applicant: 'Maya Patel', handle: 'maya_codes',
    opportunity: 'Implement price impact warnings',
    status: 'rejected', appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    skills: ['React', 'TypeScript'],
  },
];

const DIFFICULTY_CONFIG = {
  beginner:     { label: 'Beginner',     class: 'bg-green-500/10 text-green-400 ring-green-500/20' },
  intermediate: { label: 'Intermediate', class: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20' },
  advanced:     { label: 'Advanced',     class: 'bg-red-500/10 text-red-400 ring-red-500/20' },
};

const TYPE_BADGE: Record<string, 'destructive' | 'info' | 'muted' | 'warning' | 'secondary'> = {
  bug: 'destructive', feature: 'info', documentation: 'muted',
  design: 'warning', other: 'secondary',
};

export default function DashboardProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const openOpps = ISSUES.filter((o) => o.status === 'open').length;
  const pendingApps = APPLICATIONS.filter((a) => a.status === 'pending').length;

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title={PROJECT.name}
        description={`${PROJECT.org} · Updated ${formatRelativeTime(PROJECT.lastUpdated)}`}
        breadcrumb={
          <>
            <Link href="/dashboard/projects" className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Projects
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{PROJECT.name}</span>
          </>
        }
        actions={
          <>
            <StatusBadge status={PROJECT.status} />
            <Button variant="ghost" size="sm" asChild title="View public page">
              <Link href={`/projects/${PROJECT.slug}`} target="_blank">
                <Eye className="h-4 w-4" />
                Preview
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
            <CreateOpportunityDialog projectName={PROJECT.name}>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Add Opportunity
              </Button>
            </CreateOpportunityDialog>
          </>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard title="Contributors" value={PROJECT.contributors} icon={Users} change={12} changeLabel="this month" />
        <MetricCard title="Applications" value={PROJECT.totalApplications} icon={FileText} change={23} changeLabel="this month" accent />
        <MetricCard title="Open Opportunities" value={openOpps} icon={Zap} />
        <MetricCard title="Pending Review" value={pendingApps} icon={FileText} />
      </div>

      {/* GitHub + project links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <GithubIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          <a
            href={PROJECT.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground hover:text-primary flex items-center gap-1.5 flex-1 min-w-0"
          >
            <span className="truncate">{PROJECT.github.replace('https://github.com/', '')}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
          <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
            <Star className="h-3 w-3" />
            {PROJECT.stars.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
          <a
            href={PROJECT.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-foreground hover:text-primary flex items-center gap-1.5 flex-1"
          >
            {PROJECT.website}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
      </div>

      {/* Tags + tech stack */}
      <div className="flex flex-wrap gap-2">
        {PROJECT.tags.map((tag) => (
          <Badge key={tag} variant="default" className="text-xs bg-primary/15 text-primary border-primary/20">
            {tag}
          </Badge>
        ))}
        {PROJECT.tech.map((t) => (
          <Badge key={t} variant="muted" className="text-xs">
            <Code2 className="h-2.5 w-2.5 mr-1" />
            {t}
          </Badge>
        ))}
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="issues">
        <TabsList>
          <TabsTrigger value="issues">
            Issues
            <Badge variant="muted" className="ml-1.5 text-[10px] px-1">
              {openOpps}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="applications">
            Applications
            {pendingApps > 0 && (
              <Badge variant="info" className="ml-1.5 text-[10px] px-1">
                {pendingApps} new
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Issues tab */}
        <TabsContent value="issues" className="mt-4 space-y-3">
          {ISSUES.length === 0 ? (
            <EmptyState
              icon={Zap}
              title="No issues yet"
              description="Publish contribution issues to attract developers to this project."
              action={{ label: 'Create issue' }}
              size="sm"
            />
          ) : (
            ISSUES.map((issue) => {
              const diffConfig = DIFFICULTY_CONFIG[issue.difficulty as keyof typeof DIFFICULTY_CONFIG];
              return (
                <div
                  key={issue.id}
                  className={`rounded-lg border bg-card p-4 transition-colors ${
                    issue.status === 'closed' ? 'opacity-50 border-border/50' : 'border-border hover:border-border/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant={TYPE_BADGE[issue.type] || 'muted'} className="text-[10px]">
                          {issue.type}
                        </Badge>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${diffConfig.class}`}
                        >
                          {diffConfig.label}
                        </span>
                        {issue.status === 'closed' && (
                          <Badge variant="muted" className="text-[10px]">Closed</Badge>
                        )}
                      </div>
                      <h3 className="text-sm font-medium text-foreground mb-2">{issue.title}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {issue.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Added {formatRelativeTime(issue.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {issue.applications} applied
                      </span>
                      {issue.status === 'open' ? (
                        <Button size="sm" variant="outline" className="text-xs h-7 text-destructive border-destructive/30 hover:bg-destructive/10">
                          Close
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="text-xs h-7">
                          Reopen
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        {/* Applications tab */}
        <TabsContent value="applications" className="mt-4">
          {APPLICATIONS.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No applications yet"
              description="Applications will appear here when contributors apply to your issues."
              size="sm"
            />
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Applicant</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Issue</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Applied</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {APPLICATIONS.map((app) => (
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
                            <p className="text-sm font-medium text-foreground">{app.applicant}</p>
                            <p className="text-xs text-muted-foreground">@{app.handle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <p className="text-sm text-foreground line-clamp-1">{app.opportunity}</p>
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
                          <Button variant="ghost" size="icon-sm" title="View profile">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          {app.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                title="Approve"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-destructive hover:bg-destructive/10"
                                title="Reject"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
