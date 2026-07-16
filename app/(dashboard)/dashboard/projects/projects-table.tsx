'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Star, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/design-system/status-badge';
import { formatNumber } from '@/lib/utils';

export type DashboardProject = {
  id: string;
  name: string;
  org: string;
  slug: string;
  description: string;
  tags: string[];
  tech: string[];
  stars: number;
  forks: number;
  contributors: number;
  openOpps: number;
  status: 'approved' | 'pending' | 'draft' | 'rejected' | 'suspended';
};

interface ProjectsTableProps {
  initialProjects: DashboardProject[];
  isLoading: boolean;
}

export function ProjectsTable({ initialProjects, isLoading }: ProjectsTableProps) {
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'draft' | 'rejected'>('all');

  const filteredProjects = useMemo(() => {
    if (filter === 'all') {
      return initialProjects;
    }
    return initialProjects.filter((p) => p.status === filter);
  }, [initialProjects, filter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="max-w-xs flex-1">
          <input
            className="h-8 w-full rounded border border-border bg-background px-3 text-xs text-foreground outline-none transition focus:border-primary"
            placeholder="Search projects..."
          />
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {(['all', 'approved', 'pending', 'draft', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
          <span className="text-xs text-muted-foreground ml-2">{filteredProjects.length} projects</span>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-sm font-medium text-foreground">No projects yet</p>
          <p className="text-xs text-muted-foreground mt-1">Create your first project listing to attract contributors to your Sei project.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Tags</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Stats</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{project.name}</p>
                        <p className="text-xs text-muted-foreground">{project.org}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((t) => (
                        <Badge key={t} variant="muted" className="text-[10px] px-1.5">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {formatNumber(project.stars)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {project.contributors}
                      </span>
                      {project.openOpps > 0 && (
                        <Badge variant="info" className="text-[10px]">
                          {project.openOpps} open
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Button variant="ghost" size="icon-sm" asChild title="View public page">
                        <Link href={`/projects/${project.slug}`} target="_blank">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-7" asChild>
                        <Link href={`/dashboard/projects/${project.slug}`}>Manage</Link>
                      </Button>
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