'use client';
import * as React from 'react';
import { Search, SlidersHorizontal, Star, GitFork, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectSubmissions } from '@/lib/store/project-submissions-store';
import { useProjects } from '@/lib/hooks';

const CATEGORY_TAGS = ['All', 'DeFi', 'NFT', 'Gaming', 'Infrastructure', 'Indexer', 'Oracle', 'Lending'];

export default function ProjectsPage() {
  const submissions = useProjectSubmissions((s) => s.submissions);
  const { data: apiProjects } = useProjects();

  const submittedProjects = submissions
    .filter((p) => p.status === 'approved')
    .map((p) => ({
      id: p.id,
      name: p.name,
      org: p.org,
      slug: p.slug,
      description: p.description,
      tags: p.tags,
      tech: p.tech,
      stars: 0,
      forks: 0,
      contributors: 0,
      open: 0,
      status: 'approved' as const,
    }));

  const fetchedProjects = (apiProjects ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    org: p.organizationId ?? '',
    slug: p.slug,
    description: p.description,
    tags: p.tags ?? [],
    tech: p.tech ?? [],
    stars: p.stars ?? 0,
    forks: p.forks ?? 0,
    contributors: p.contributors ?? 0,
    open: p.openIssues ?? 0,
    status: p.status,
  }));

  const ALL_PROJECTS = [...submittedProjects, ...fetchedProjects];

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-10 border-b border-border/50 mb-8">
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">
            Sei Ecosystem Projects
          </h1>
            <p className="text-sm text-muted-foreground">
              Discover {ALL_PROJECTS.length}+ open-source projects building on the Sei blockchain.
            </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search projects..."
              startIcon={<Search />}
              className="bg-card border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="recent">
              <SelectTrigger className="w-[140px] bg-card border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="stars">Most Stars</SelectItem>
                <SelectItem value="open">Most Open</SelectItem>
                <SelectItem value="contributors">Most Active</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="bg-card">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORY_TAGS.map((tag) => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                tag === 'All'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ALL_PROJECTS.map((project) => (
            <a
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-border/80 hover:shadow-card-hover block"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
                    {project.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {project.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{project.org}</p>
                  </div>
                </div>
                {project.open > 0 && (
                  <Badge variant="info" className="shrink-0 text-[10px]">
                    {project.open} open
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                    {tag}
                  </span>
                ))}
                {project.tech.slice(0, 2).map((t) => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                    {t}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-3">
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
              </div>
            </a>
          ))}
        </div>

        {/* Load more */}
        <div className="mt-10 text-center">
          <Button variant="outline">Load more projects</Button>
        </div>
      </div>
    </div>
  );
}
