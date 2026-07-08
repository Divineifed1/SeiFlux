import type { Metadata } from 'next';
import * as React from 'react';
import Link from 'next/link';
import {
  Settings,
  Plus,
  Globe,
  ExternalLink,
  ChevronRight,
  Star,
  GitFork,
  Users,
  CheckCircle2,
  AlertCircle,
  FolderKanban,
  ArrowLeft,
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader } from '@/components/design-system/page-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { MetricCard } from '@/components/design-system/metric-card';
import { CreateProjectDialog } from '@/components/dialogs/create-project-dialog';

export const metadata: Metadata = { title: 'Organization' };

// Mock data — replace with real fetch by ID
const ORG = {
  id: '1',
  name: 'SeiSwap Labs',
  slug: 'seiswap-labs',
  description:
    'Building the premier DEX and DeFi infrastructure for the Sei ecosystem. Our mission is to provide the most capital-efficient trading experience on Sei while remaining fully decentralized and permissionless.',
  githubOrg: 'seiswap-labs',
  website: 'https://seiswap.example.com',
  status: 'active',
  memberCount: 6,
  projectCount: 4,
  contributorCount: 31,
  createdAt: '2024-01-15',
};

const PROJECTS = [
  {
    id: '1', name: 'SeiSwap DEX', slug: 'seiswap-dex',
    description: 'Core DEX protocol with concentrated liquidity.',
    status: 'approved' as const, openOpps: 12, contributors: 18,
    stars: 1243, forks: 89, tech: ['Rust', 'TypeScript'],
  },
  {
    id: '2', name: 'SeiSwap SDK', slug: 'seiswap-sdk',
    description: 'TypeScript SDK for SeiSwap protocol integration.',
    status: 'approved' as const, openOpps: 5, contributors: 8,
    stars: 348, forks: 31, tech: ['TypeScript'],
  },
  {
    id: '3', name: 'SeiSwap Subgraph', slug: 'seiswap-subgraph',
    description: 'TheGraph subgraph for on-chain event indexing.',
    status: 'draft' as const, openOpps: 0, contributors: 3,
    stars: 89, forks: 11, tech: ['AssemblyScript', 'GraphQL'],
  },
  {
    id: '4', name: 'SeiSwap Docs', slug: 'seiswap-docs',
    description: 'Protocol documentation and developer guides.',
    status: 'published' as const, openOpps: 2, contributors: 5,
    stars: 44, forks: 8, tech: ['MDX', 'Next.js'],
  },
];

const MEMBERS = [
  { id: '1', name: 'Alex Builder', handle: 'alexbuilder', role: 'owner' },
  { id: '2', name: 'Maria Vasquez', handle: 'maria_v', role: 'admin' },
  { id: '3', name: 'Sam Okonkwo', handle: 'samokonkwo', role: 'member' },
  { id: '4', name: 'Priya Nair', handle: 'priyanair', role: 'member' },
  { id: '5', name: 'Chen Wei', handle: 'chenwei_dev', role: 'member' },
  { id: '6', name: 'Jordan Mills', handle: 'jmills', role: 'member' },
];

const CONNECTED_REPOS = [
  { name: 'seiswap-dex', stars: 1243, synced: true, lastSync: '2 min ago' },
  { name: 'seiswap-sdk', stars: 348, synced: true, lastSync: '5 min ago' },
  { name: 'seiswap-subgraph', stars: 89, synced: false, lastSync: '2h ago' },
];

export default function OrganizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title={ORG.name}
        description={`@${ORG.slug} · ${ORG.projectCount} projects · ${ORG.memberCount} members`}
        breadcrumb={
          <>
            <Link href="/dashboard/organizations" className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Organizations
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{ORG.name}</span>
          </>
        }
        actions={
          <>
            <StatusBadge status={ORG.status} />
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/organizations/${id}/settings`}>
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
            <CreateProjectDialog>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </CreateProjectDialog>
          </>
        }
      />

      {/* Overview metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Projects" value={ORG.projectCount} icon={FolderKanban} accent />
        <MetricCard title="Members" value={ORG.memberCount} icon={Users} />
        <MetricCard
          title="Contributors"
          value={ORG.contributorCount}
          icon={Users}
          change={12}
          changeLabel="this month"
        />
      </div>

      {/* Description + links */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-6">
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-2">About</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{ORG.description}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Links</h2>
            <div className="space-y-2">
              {ORG.website && (
                <a
                  href={ORG.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  Website
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              )}
              {ORG.githubOrg && (
                <a
                  href={`https://github.com/${ORG.githubOrg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects">
            Projects
            <Badge variant="muted" className="ml-1.5 text-[10px] px-1">
              {PROJECTS.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="members">
            Members
            <Badge variant="muted" className="ml-1.5 text-[10px] px-1">
              {MEMBERS.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Projects tab */}
        <TabsContent value="projects" className="mt-4">
          <div className="space-y-3">
            {PROJECTS.map((project) => (
              <div
                key={project.id}
                className="rounded-lg border border-border bg-card p-4 hover:border-border/80 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                    {project.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Link
                        href={`/dashboard/projects/${project.slug}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {project.name}
                      </Link>
                      <StatusBadge status={project.status} />
                      {project.openOpps > 0 && (
                        <Badge variant="info" className="text-[10px]">
                          {project.openOpps} open
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{project.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {project.stars.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" />
                        {project.forks}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.contributors}
                      </span>
                      <div className="flex gap-1 ml-auto">
                        {project.tech.map((t) => (
                          <Badge key={t} variant="muted" className="text-[10px] px-1.5">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="shrink-0">
                    <Link href={`/dashboard/projects/${project.slug}`}>Manage</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Members tab */}
        <TabsContent value="members" className="mt-4">
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
              <p className="text-xs font-medium text-muted-foreground">
                {MEMBERS.length} members
              </p>
              <Button variant="outline" size="sm" className="text-xs h-7">
                <Plus className="h-3.5 w-3.5" />
                Invite member
              </Button>
            </div>
            <div className="divide-y divide-border/50">
              {MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">@{member.handle}</p>
                  </div>
                  <Badge
                    variant={
                      member.role === 'owner'
                        ? 'default'
                        : member.role === 'admin'
                        ? 'info'
                        : 'muted'
                    }
                    className="text-xs capitalize"
                  >
                    {member.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* GitHub tab */}
        <TabsContent value="github" className="mt-4 space-y-4">
          {/* Connection status */}
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-foreground/10 flex items-center justify-center">
                  <GithubIcon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    @{ORG.githubOrg}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    GitHub organization connected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Connected
              </div>
            </div>
          </div>

          {/* Repos */}
          <div className="space-y-2">
            {CONNECTED_REPOS.map((repo) => (
              <div
                key={repo.name}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex-1 min-w-0">
                  <a
                    href={`https://github.com/${ORG.githubOrg}/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground hover:text-primary flex items-center gap-1 w-fit"
                  >
                    {ORG.githubOrg}/{repo.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {repo.stars}
                    </span>
                    <span>Last sync: {repo.lastSync}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {repo.synced ? (
                    <div className="flex items-center gap-1.5 text-xs text-green-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Synced
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-yellow-400">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Pending
                    </div>
                  )}
                  <Button variant="ghost" size="sm" className="text-xs h-7">
                    Sync
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Analytics tab */}
        <TabsContent value="analytics" className="mt-4 space-y-5">
          {/* PR merged trend */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">PR Merged Trend (8 weeks)</h3>
            <div className="flex items-end gap-2 h-28">
              {[3, 5, 2, 8, 6, 9, 4, 7].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-primary/70"
                    style={{ height: `${(val / 9) * 100}%`, minHeight: '4px' }}
                  />
                  <span className="text-[9px] text-muted-foreground">W{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Contributor growth */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Contributor Growth</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">31</p>
              <p className="text-xs text-green-400 mt-1">+12% this month</p>
            </div>
            {/* Issue resolution rate */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Issue Resolution Rate</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">72%</p>
              <p className="text-xs text-green-400 mt-1">+7% vs last month</p>
            </div>
            {/* Open issues */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Open Issues</p>
              <p className="text-2xl font-bold text-foreground tabular-nums">19</p>
              <p className="text-xs text-muted-foreground mt-1">across 4 projects</p>
            </div>
          </div>

          {/* Most active contributors */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Most Active Contributors</h3>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Contributor</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Merged PRs</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Issues Closed</th>
                  </tr>
                </thead>
                <tbody>
                  {MEMBERS.map((m) => (
                    <tr key={m.id} className="border-b border-border/50 last:border-0">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-foreground">{m.name}</p>
                        <p className="text-xs text-muted-foreground">@{m.handle}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {m.id === '1' ? 12 : m.id === '2' ? 8 : m.id === '3' ? 7 : m.id === '4' ? 5 : m.id === '5' ? 4 : 2}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {m.id === '1' ? 15 : m.id === '2' ? 9 : m.id === '3' ? 11 : m.id === '4' ? 7 : m.id === '5' ? 5 : 4}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Weekly activity chart */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Activity</h3>
            <div className="space-y-2.5">
              {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, i) => {
                const vals = [35, 62, 48, 78];
                return (
                  <div key={week} className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-14 shrink-0">{week}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/70"
                        style={{ width: `${vals[i]}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground w-8 text-right">{vals[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
