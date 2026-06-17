import type { Metadata } from 'next';
import { GitBranch, Star, ExternalLink, CheckCircle2, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/design-system/page-header';
import { EmptyState } from '@/components/design-system/empty-state';
import { formatNumber } from '@/lib/utils';

export const metadata: Metadata = { title: 'GitHub Integration' };

const CONNECTED_REPOS = [
  {
    id: '1', name: 'seiswap-dex', fullName: 'seiswap-labs/seiswap-dex',
    description: 'Main DEX protocol contracts and frontend', stars: 1243, branch: 'main',
    synced: true, lastSync: '2 min ago', openIssues: 14,
  },
  {
    id: '2', name: 'seiswap-sdk', fullName: 'seiswap-labs/seiswap-sdk',
    description: 'TypeScript SDK for SeiSwap integration', stars: 348, branch: 'main',
    synced: true, lastSync: '5 min ago', openIssues: 6,
  },
  {
    id: '3', name: 'seiswap-subgraph', fullName: 'seiswap-labs/seiswap-subgraph',
    description: 'TheGraph subgraph for SeiSwap events', stars: 89, branch: 'main',
    synced: false, lastSync: '2 hours ago', openIssues: 3,
  },
];

export default function GitHubPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="GitHub Integration"
        description="Connect and sync your GitHub repositories with your platform projects."
      />

      {/* Connection card */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center">
              <GithubIcon className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">GitHub Connected</p>
              <p className="text-xs text-muted-foreground">
                @seiswap-labs · {CONNECTED_REPOS.length} repositories synced
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Connected
            </div>
            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
              Disconnect
            </Button>
          </div>
        </div>
      </div>

      {/* Permissions card */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          OAuth Permissions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Read repos', granted: true },
            { label: 'Read org info', granted: true },
            { label: 'Read issues', granted: true },
            { label: 'Write webhooks', granted: true },
            { label: 'Read pull requests', granted: true },
            { label: 'Write deployments', granted: false },
          ].map((perm) => (
            <div key={perm.label} className="flex items-center gap-2 text-xs">
              {perm.granted ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
              )}
              <span className={perm.granted ? 'text-foreground' : 'text-muted-foreground/50'}>
                {perm.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Repos list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Connected Repositories</h2>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Repository
          </Button>
        </div>

        <div className="space-y-3">
          {CONNECTED_REPOS.map((repo) => (
            <div
              key={repo.id}
              className="rounded-lg border border-border bg-card p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <a
                    href={`https://github.com/${repo.fullName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {repo.fullName}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{repo.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {formatNumber(repo.stars)}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitBranch className="h-3 w-3" />
                    {repo.branch}
                  </span>
                  <span>{repo.openIssues} open issues</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                {repo.synced ? (
                  <div className="flex items-center gap-1.5 text-xs text-green-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Synced
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-yellow-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Sync pending
                  </div>
                )}
                <span className="text-[10px] text-muted-foreground">{repo.lastSync}</span>
              </div>

              <Button variant="ghost" size="sm" className="shrink-0 gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                Sync
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook log */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Recent Webhook Events</h2>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="divide-y divide-border/50">
            {[
              { event: 'push', repo: 'seiswap-dex', time: '2 min ago', status: 'delivered' },
              { event: 'issues.opened', repo: 'seiswap-dex', time: '1h ago', status: 'delivered' },
              { event: 'pull_request.merged', repo: 'seiswap-sdk', time: '3h ago', status: 'delivered' },
              { event: 'release.published', repo: 'seiswap-dex', time: '1d ago', status: 'delivered' },
            ].map((event, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 text-xs">
                <Badge variant="muted" className="text-[10px] font-mono shrink-0">{event.event}</Badge>
                <span className="text-muted-foreground flex-1">{event.repo}</span>
                <span className="text-muted-foreground">{event.time}</span>
                <div className="flex items-center gap-1 text-green-400">
                  <CheckCircle2 className="h-3 w-3" />
                  {event.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
