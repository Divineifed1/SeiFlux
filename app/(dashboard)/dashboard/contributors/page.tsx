import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Users, ExternalLink, Star } from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHeader } from '@/components/design-system/page-header';
import { EmptyState } from '@/components/design-system/empty-state';
import { MetricCard } from '@/components/design-system/metric-card';

export const metadata: Metadata = { title: 'Contributors' };

const CONTRIBUTORS = [
  {
    id: '1', name: 'Alex Chen', handle: 'alexc_dev', avatar: '',
    skills: ['Rust', 'TypeScript', 'React'],
    activeProjects: 2, completedContribs: 7, reputation: 94, github: 'alexc_dev',
  },
  {
    id: '2', name: 'Sarah Kim', handle: 'sarah_builds', avatar: '',
    skills: ['Solidity', 'ethers.js', 'React'],
    activeProjects: 1, completedContribs: 12, reputation: 87, github: 'sarah_builds',
  },
  {
    id: '3', name: 'John Rivera', handle: 'john_dev', avatar: '',
    skills: ['Go', 'PostgreSQL', 'Docker'],
    activeProjects: 3, completedContribs: 5, reputation: 72, github: 'john_dev',
  },
  {
    id: '4', name: 'Maya Patel', handle: 'maya_codes', avatar: '',
    skills: ['Python', 'TypeScript', 'CosmWasm'],
    activeProjects: 1, completedContribs: 9, reputation: 81, github: 'maya_codes',
  },
  {
    id: '5', name: "Liam O'Brien", handle: 'liam_ob', avatar: '',
    skills: ['Rust', 'CosmWasm', 'Move'],
    activeProjects: 2, completedContribs: 3, reputation: 65, github: 'liam_ob',
  },
];

export default function ContributorsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Contributors"
        description="Developers contributing to your projects."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Total Contributors" value={47} icon={Users} change={23} changeLabel="this month" />
        <MetricCard title="Active This Month" value={31} icon={Users} accent />
        <MetricCard title="Completed Contributions" value={128} icon={Star} change={8} changeLabel="this month" />
      </div>

      <div className="flex items-center gap-3">
        <div className="max-w-xs flex-1">
          <Input
            placeholder="Search contributors..."
            startIcon={<Search />}
            className="h-8 text-xs"
          />
        </div>
      </div>

      {CONTRIBUTORS.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contributors yet"
          description="Publish contribution opportunities to attract developers to your projects."
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
              {CONTRIBUTORS.map((c) => (
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
