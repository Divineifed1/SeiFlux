'use client';
import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, ChevronRight, RefreshCw, Star, GitFork, AlertCircle,
  Users, GitPullRequest, CheckCircle2, XCircle, GitMerge,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/design-system/page-header';
import { MetricCard } from '@/components/design-system/metric-card';
import { useGithubRepo } from '@/lib/hooks/use-github';
import { formatNumber } from '@/lib/utils';
import { Search } from 'lucide-react';

export default function RepoDetailPage() {
  const params = useParams<{ name: string }>();
  const name = params.name;
  const { data: repo, isLoading } = useGithubRepo(name);
  const [issueSearch, setIssueSearch] = React.useState('');
  const [issueFilter, setIssueFilter] = React.useState<'all' | 'open' | 'closed'>('all');

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="h-16 rounded-lg bg-muted animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!repo) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm">Repository not found.</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link href="/dashboard/github">Back to GitHub</Link>
        </Button>
      </div>
    );
  }

  const maxCommits = Math.max(...repo.activity.map((w) => w.commits), 1);

  const filteredIssues = repo.issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(issueSearch.toLowerCase());
    const matchesFilter = issueFilter === 'all' || issue.state === issueFilter;
    return matchesSearch && matchesFilter;
  });

  const prStateIcon = (state: string) => {
    if (state === 'open') return <GitPullRequest className="h-3.5 w-3.5 text-green-400" />;
    if (state === 'merged') return <GitMerge className="h-3.5 w-3.5 text-purple-400" />;
    return <XCircle className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  const prStateBadge = (state: string) => {
    if (state === 'open') return <Badge variant="success" className="text-[10px]">Open</Badge>;
    if (state === 'merged') return <Badge variant="info" className="text-[10px]" style={{ borderColor: 'rgba(168,85,247,0.2)', backgroundColor: 'rgba(168,85,247,0.15)', color: 'rgb(192,132,252)' }}>Merged</Badge>;
    return <Badge variant="muted" className="text-[10px]">Closed</Badge>;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title={repo.name}
        description={repo.description}
        breadcrumb={
          <>
            <Link href="/dashboard/github" className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              GitHub
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/dashboard/github/repositories" className="hover:text-foreground">
              Repositories
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{repo.name}</span>
          </>
        }
        actions={
          <Button size="sm" variant="outline" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            Sync Now
          </Button>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <MetricCard title="Stars" value={repo.stars} icon={Star} accent />
        <MetricCard title="Forks" value={repo.forks} icon={GitFork} />
        <MetricCard title="Open Issues" value={repo.openIssues} icon={AlertCircle} />
        <MetricCard title="Contributors" value={repo.contributors} icon={Users} />
        <MetricCard title="Open PRs" value={repo.openPRs} icon={GitPullRequest} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">
            Issues
            <Badge variant="muted" className="ml-1.5 text-[10px] px-1">{repo.openIssues}</Badge>
          </TabsTrigger>
          <TabsTrigger value="prs">Pull Requests</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-5">
            {/* Left: recent commits */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Recent Commits</h3>
              <div className="space-y-3">
                {repo.recentCommits.map((commit) => (
                  <div key={commit.sha} className="flex items-start gap-3">
                    <code className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                      {commit.sha}
                    </code>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate">{commit.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        @{commit.author} · {commit.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: language bar + top contributors */}
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Languages</h3>
                <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-3">
                  {repo.languages.map((l) => (
                    <div
                      key={l.lang}
                      className="h-full rounded-sm"
                      style={{ width: `${l.pct}%`, backgroundColor: l.lang === 'TypeScript' ? '#3b82f6' : l.lang === 'Rust' ? '#ef4444' : l.lang === 'CSS' ? '#a855f7' : l.lang === 'AssemblyScript' ? '#f97316' : '#6b7280' }}
                    />
                  ))}
                </div>
                <div className="space-y-1.5">
                  {repo.languages.map((l) => (
                    <div key={l.lang} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{l.lang}</span>
                      <span className="font-medium tabular-nums">{l.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Top Contributors</h3>
                <div className="space-y-2">
                  {repo.contributorList.slice(0, 4).map((c) => (
                    <div key={c.login} className="flex items-center gap-2.5">
                      <Avatar className="h-6 w-6 shrink-0">
                        <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                          {c.login.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-foreground flex-1 truncate">@{c.login}</span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">{c.commits} commits</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Issues */}
        <TabsContent value="issues" className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 max-w-xs">
              <Input
                placeholder="Search issues…"
                startIcon={<Search />}
                className="h-8 text-xs"
                value={issueSearch}
                onChange={(e) => setIssueSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-1 ml-auto">
              {(['all', 'open', 'closed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setIssueFilter(f)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors capitalize ${
                    issueFilter === f
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border/50">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="flex items-start gap-3 px-5 py-4 hover:bg-muted/20 transition-colors">
                  {issue.state === 'open'
                    ? <AlertCircle className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                    : <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">#{issue.number}</span>
                      <span className="text-sm text-foreground">{issue.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {issue.labels.map((label) => (
                        <Badge key={label} variant="muted" className="text-[10px] px-1.5">{label}</Badge>
                      ))}
                      {issue.assignee && (
                        <span className="text-[10px] text-muted-foreground">@{issue.assignee}</span>
                      )}
                      <span className="text-[10px] text-muted-foreground ml-auto">{issue.updatedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredIssues.length === 0 && (
                <div className="px-5 py-10 text-center text-sm text-muted-foreground">No issues found.</div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Pull Requests */}
        <TabsContent value="prs" className="mt-4">
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border/50">
              {repo.pullRequests.map((pr) => (
                <div key={pr.id} className="flex items-center gap-3 px-5 py-4 hover:bg-muted/20 transition-colors">
                  {prStateIcon(pr.state)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{pr.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">#{pr.number} by @{pr.author} · {pr.createdAt}</p>
                  </div>
                  {prStateBadge(pr.state)}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Contributors */}
        <TabsContent value="contributors" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {repo.contributorList.map((contributor) => (
              <div
                key={contributor.login}
                className="rounded-xl border border-border bg-card p-4 flex items-center gap-4"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {contributor.login.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">@{contributor.login}</p>
                  <p className="text-xs text-muted-foreground">{contributor.commits} commits</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    +{formatNumber(contributor.additions)} / -{formatNumber(contributor.deletions)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Activity */}
        <TabsContent value="activity" className="mt-4 space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Commit Activity (8 Weeks)</h3>
            <div className="flex items-end gap-2 h-32">
              {repo.activity.map((week) => (
                <div key={week.week} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-primary/70 hover:bg-primary transition-colors"
                    style={{ height: `${(week.commits / maxCommits) * 100}%`, minHeight: '2px' }}
                    title={`${week.commits} commits`}
                  />
                  <span className="text-[9px] text-muted-foreground">{week.week.replace('Week ', 'W')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Weekly PR Activity</h3>
            <div className="space-y-3">
              {repo.activity.map((week) => (
                <div key={week.week} className="flex items-center gap-3 text-xs">
                  <span className="text-muted-foreground w-14 shrink-0">{week.week}</span>
                  <div className="flex-1 flex items-center gap-1.5">
                    <div className="flex items-center gap-1 w-20">
                      <div
                        className="h-2 rounded-full bg-green-500/60"
                        style={{ width: `${(week.prsOpened / 8) * 100}%`, minWidth: week.prsOpened ? '4px' : '0' }}
                      />
                      <span className="text-muted-foreground">{week.prsOpened} opened</span>
                    </div>
                    <div className="flex items-center gap-1 w-20">
                      <div
                        className="h-2 rounded-full bg-purple-500/60"
                        style={{ width: `${(week.prsMerged / 8) * 100}%`, minWidth: week.prsMerged ? '4px' : '0' }}
                      />
                      <span className="text-muted-foreground">{week.prsMerged} merged</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
