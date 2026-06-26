'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  Star, ExternalLink, CheckCircle2, AlertCircle, RefreshCw, Plus,
  GitBranch, Search, Globe, Lock, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/design-system/page-header';
import { useGithubRepos } from '@/lib/hooks/use-github';
import { formatNumber } from '@/lib/utils';

export default function RepositoriesPage() {
  const { data: repos = [], isLoading } = useGithubRepos();
  const [search, setSearch] = React.useState('');

  const filtered = repos.filter((r) =>
    r.fullName.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Repositories"
        description="All GitHub repositories connected to SeiFlux."
        breadcrumb={
          <>
            <Link href="/dashboard/github" className="hover:text-foreground">GitHub</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Repositories</span>
          </>
        }
        actions={
          <Button size="sm" variant="outline" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Repository
          </Button>
        }
      />

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-xs">
          <Input
            placeholder="Search repositories…"
            startIcon={<Search />}
            className="h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} repos</span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((repo) => (
            <div key={repo.id} className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {repo.visibility === 'public'
                    ? <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    : <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  }
                  <a
                    href={repo.url}
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
                  <Badge variant="muted" className="text-[10px] px-1.5">{repo.language}</Badge>
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

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7">
                  <RefreshCw className="h-3 w-3" />
                  Sync
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                  <Link href={`/dashboard/github/repositories/${repo.name}`}>
                    View <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
