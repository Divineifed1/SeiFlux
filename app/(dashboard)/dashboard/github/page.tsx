'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  GitBranch, Star, ExternalLink, CheckCircle2, AlertCircle, RefreshCw,
  Plus, Search, Lock, Globe, ChevronRight, ArrowRight,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/design-system/page-header';
import { formatNumber } from '@/lib/utils';

const CONNECTED_REPOS = [
  {
    id: '1', name: 'seiswap-dex', fullName: 'seiswap-labs/seiswap-dex',
    description: 'Main DEX protocol contracts and frontend', stars: 1243, branch: 'main',
    synced: true, lastSync: '2 min ago', openIssues: 14, language: 'TypeScript', visibility: 'public' as const,
  },
  {
    id: '2', name: 'seiswap-sdk', fullName: 'seiswap-labs/seiswap-sdk',
    description: 'TypeScript SDK for SeiSwap integration', stars: 348, branch: 'main',
    synced: true, lastSync: '5 min ago', openIssues: 6, language: 'TypeScript', visibility: 'public' as const,
  },
  {
    id: '3', name: 'seiswap-subgraph', fullName: 'seiswap-labs/seiswap-subgraph',
    description: 'TheGraph subgraph for SeiSwap events', stars: 89, branch: 'main',
    synced: false, lastSync: '2 hours ago', openIssues: 3, language: 'AssemblyScript', visibility: 'public' as const,
  },
];

const CONNECT_STEPS = ['Connect', 'Permissions', 'Install App', 'Success'];

export default function GitHubPage() {
  const [search, setSearch] = React.useState('');
  const [connectStep, setConnectStep] = React.useState(0);
  const [connecting, setConnecting] = React.useState(false);

  const filteredRepos = CONNECTED_REPOS.filter((r) =>
    r.fullName.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleNextStep = async () => {
    if (connectStep < CONNECT_STEPS.length - 1) {
      setConnecting(true);
      await new Promise((r) => setTimeout(r, 600));
      setConnecting(false);
      setConnectStep((s) => s + 1);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="GitHub Integration"
        description="Connect and sync your GitHub repositories with your platform projects."
      />

      <Tabs defaultValue="connection">
        <TabsList>
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="connect-org">Connect Org</TabsTrigger>
        </TabsList>

        {/* ── Connection tab ────────────────────────────────── */}
        <TabsContent value="connection" className="mt-4 space-y-5">
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
        </TabsContent>

        {/* ── Repositories tab ──────────────────────────────── */}
        <TabsContent value="repositories" className="mt-4 space-y-4">
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
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{filteredRepos.length} repos</span>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Add Repository
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs">Repository</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden md:table-cell">Language</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden lg:table-cell">Stats</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs">Sync</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredRepos.map((repo) => (
                  <tr key={repo.id} className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {repo.visibility === 'public'
                          ? <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          : <Lock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        }
                        <div>
                          <a
                            href={`https://github.com/${repo.fullName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1"
                          >
                            {repo.fullName}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <p className="text-xs text-muted-foreground mt-0.5">{repo.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{repo.language}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {formatNumber(repo.stars)}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          {repo.branch}
                        </span>
                        <span>{repo.openIssues} issues</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {repo.synced ? (
                        <div className="flex items-center gap-1.5 text-xs text-green-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Synced</span>
                          <span className="text-muted-foreground ml-1">{repo.lastSync}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-yellow-400">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Pending</span>
                          <span className="text-muted-foreground ml-1">{repo.lastSync}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-7">
                          <RefreshCw className="h-3 w-3" />
                          Sync
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                          <Link href={`/dashboard/github/repositories/${repo.name}`}>
                            View
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* ── Connect Org tab ───────────────────────────────── */}
        <TabsContent value="connect-org" className="mt-4">
          <div className="max-w-lg mx-auto">
            {/* Step indicators */}
            <div className="flex items-center mb-8">
              {CONNECT_STEPS.map((step, i) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      i < connectStep
                        ? 'bg-primary text-primary-foreground'
                        : i === connectStep
                        ? 'bg-primary/15 text-primary ring-2 ring-primary/30'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {i < connectStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`text-[10px] font-medium ${i === connectStep ? 'text-primary' : 'text-muted-foreground'}`}>
                      {step}
                    </span>
                  </div>
                  {i < CONNECT_STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-2 mb-4 transition-colors ${i < connectStep ? 'bg-primary' : 'bg-border'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step content */}
            <div className="rounded-xl border border-border bg-card p-6">
              {connectStep === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-foreground/10 flex items-center justify-center">
                      <GithubIcon className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Connect GitHub Organization</h3>
                      <p className="text-xs text-muted-foreground">Link your GitHub org to sync repositories.</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Organization name or URL</label>
                    <Input placeholder="e.g. my-org or https://github.com/my-org" className="text-sm" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You must be an owner or admin of the GitHub organization to connect it.
                  </p>
                </div>
              )}

              {connectStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Review Permissions</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    SEI Builders Hub will request the following permissions from your organization:
                  </p>
                  <div className="space-y-3">
                    {[
                      { perm: 'Read access to code', desc: 'View repository contents and metadata', granted: true },
                      { perm: 'Read access to issues', desc: 'View issues and labels', granted: true },
                      { perm: 'Read access to pull requests', desc: 'View PR status and reviews', granted: true },
                      { perm: 'Write access to webhooks', desc: 'Receive real-time repository events', granted: true },
                    ].map((item) => (
                      <div key={item.perm} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-foreground">{item.perm}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {connectStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Install GitHub App</h3>
                  <p className="text-xs text-muted-foreground">
                    Install the SEI Builders Hub GitHub App on your organization to enable repository syncing and webhook events.
                  </p>
                  <div className="rounded-lg border border-border p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-foreground/10 flex items-center justify-center shrink-0">
                      <GithubIcon className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">SEI Builders Hub</p>
                      <p className="text-xs text-muted-foreground">GitHub App · by Sei Network</p>
                    </div>
                    <Badge variant="success" className="text-xs shrink-0">Verified</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Clicking &quot;Install App&quot; will open GitHub to authorize the installation. Return here after completing the installation.
                  </p>
                </div>
              )}

              {connectStep === 3 && (
                <div className="text-center py-4 space-y-3">
                  <div className="h-14 w-14 rounded-full bg-green-500/15 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-7 w-7 text-green-400" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">Organization Connected!</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Your GitHub organization has been connected. Repositories will sync automatically.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => setConnectStep(0)}>
                      Connect Another
                    </Button>
                    <Button size="sm" asChild>
                      <Link href="/dashboard/github?tab=repositories">
                        View Repositories
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            {connectStep < 3 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConnectStep((s) => Math.max(0, s - 1))}
                  disabled={connectStep === 0}
                >
                  Back
                </Button>
                <Button size="sm" onClick={handleNextStep} disabled={connecting}>
                  {connecting ? (
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />
                  ) : null}
                  {connectStep === 2 ? 'Install App' : 'Next'}
                  {!connecting && <ArrowRight className="h-3.5 w-3.5 ml-1.5" />}
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
