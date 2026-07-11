'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  Search, Star, GitFork, Users, Zap, Filter, X, SlidersHorizontal,
  BookOpen, Wrench, Gamepad2, BarChart2, CircuitBoard, Globe, Landmark,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/design-system/page-header';
import { MetricCard } from '@/components/design-system/metric-card';
import { EmptyState } from '@/components/design-system/empty-state';
import { useProjects } from '@/lib/hooks/use-projects';
import { useIssues } from '@/lib/hooks/use-issues';
import { useContributors } from '@/lib/hooks/use-contributors';
import { cn } from '@/lib/utils';

// ─── Filter constants ──────────────────────────────────────────────────────────

const CATEGORY_FILTERS = [
  { label: 'All', value: 'all', icon: Globe },
  { label: 'DeFi', value: 'DeFi', icon: BarChart2 },
  { label: 'NFT', value: 'NFT', icon: CircuitBoard },
  { label: 'Gaming', value: 'Gaming', icon: Gamepad2 },
  { label: 'Infrastructure', value: 'Infrastructure', icon: Wrench },
  { label: 'Tooling', value: 'Tooling', icon: SlidersHorizontal },
  { label: 'DAO', value: 'DAO', icon: Landmark },
  { label: 'Docs', value: 'documentation', icon: BookOpen },
];

const LANGUAGE_FILTERS = ['All', 'Rust', 'TypeScript', 'CosmWasm', 'Go', 'Solidity', 'Next.js'];

const DIFFICULTY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

const SORT_OPTIONS = [
  { label: 'Most Active', value: 'active' },
  { label: 'Most Stars', value: 'stars' },
  { label: 'Most Contributors', value: 'contributors' },
  { label: 'Newest', value: 'newest' },
  { label: 'Most Issues', value: 'issues' },
];

const RECOMMENDED_TAGS = [
  'good-first-issue', 'bounty', 'Rust', 'CosmWasm', 'DeFi', 'NFT', 'documentation',
];

// ─── Project card ──────────────────────────────────────────────────────────────

interface DiscoverProject {
  id: string;
  name: string;
  organizationName: string;
  description: string;
  tags: string[];
  techStack: string[];
  stars: number;
  forks: number;
  contributors: number;
  openIssues: number;
  slug: string;
  status: string;
}

function ProjectCard({ project }: { project: DiscoverProject }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 hover:border-border/70 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <Link
            href={`/dashboard/projects/${project.slug}`}
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 group-hover:text-primary"
          >
            {project.name}
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">{project.organizationName}</p>
        </div>
        {project.openIssues > 0 && (
          <Badge variant="success" className="text-[10px] shrink-0">
            {project.openIssues} open
          </Badge>
        )}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {(project.tags ?? []).map((tag) => (
          <Badge key={tag} variant="info" className="text-[10px] px-1.5">{tag}</Badge>
        ))}
        {project.techStack.slice(0, 3).map((tech) => (
          <Badge key={tech} variant="muted" className="text-[10px] px-1.5">{tech}</Badge>
        ))}
        {project.techStack.length > 3 && (
          <Badge variant="muted" className="text-[10px] px-1.5">+{project.techStack.length - 3}</Badge>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Star className="h-3 w-3" />{project.stars}</span>
          <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{project.forks}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{project.contributors}</span>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
          <Link href={`/dashboard/projects/${project.slug}`}>View</Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function DiscoverPage() {
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [language, setLanguage] = React.useState('All');
  const [difficulty, setDifficulty] = React.useState('all');
  const [sort, setSort] = React.useState('active');
  const [hasBounty, setHasBounty] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [activeView, setActiveView] = React.useState<'projects' | 'issues' | 'contributors'>('projects');

  const { data: projects = [], isLoading: projectsLoading } = useProjects();
  const { data: opportunities = [], isLoading: issuesLoading } = useIssues();
  const { data: contributors = [], isLoading: contribsLoading } = useContributors();

  const isLoading = projectsLoading || issuesLoading || contribsLoading;

  const filteredProjects = React.useMemo(() => {
    let out = [...projects];

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.organizationId ?? '').toLowerCase().includes(q) ||
          (p.tech ?? []).some((t) => t.toLowerCase().includes(q)) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (category !== 'all') {
      out = out.filter((p) => (p.tags ?? []).some((t) => t.toLowerCase() === category.toLowerCase()));
    }

    if (language !== 'All') {
      out = out.filter((p) => (p.tech ?? []).some((t) => t.toLowerCase() === language.toLowerCase()));
    }

    if (activeTag) {
      const tag = activeTag;
      out = out.filter(
        (p) =>
          (p.tags ?? []).some((t) => t.toLowerCase().includes(tag.toLowerCase())) ||
          (p.tech ?? []).some((t) => t.toLowerCase().includes(tag.toLowerCase())),
      );
    }

    if (sort === 'stars') out = out.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
    else if (sort === 'contributors') out = out.sort((a, b) => (b.contributors ?? 0) - (a.contributors ?? 0));
    else if (sort === 'issues') out = out.sort((a, b) => (b.openIssues ?? 0) - (a.openIssues ?? 0));
    else if (sort === 'newest') out = out.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

    return out;
  }, [projects, search, category, language, activeTag, sort]);

  // ── filter issues ──
  const filteredIssues = React.useMemo(() => {
    let out = [...opportunities];

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          o.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }

    if (difficulty !== 'all') {
      out = out.filter((o) => o.difficulty === difficulty);
    }

    if (hasBounty) {
      out = out.filter((o) => !!o.bountyAmount);
    }

    return out.filter((o) => o.status === 'open');
  }, [opportunities, search, difficulty, hasBounty]);

  // ── filter contributors ──
  const filteredContribs = React.useMemo(() => {
    let out = [...contributors];

    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          (c.bio ?? '').toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }

    if (language !== 'All') {
      out = out.filter((c) => c.skills.some((s) => s.toLowerCase() === language.toLowerCase()));
    }

    return out;
  }, [contributors, search, language]);

  const hasActiveFilters = category !== 'all' || language !== 'All' || difficulty !== 'all' || hasBounty || !!activeTag;

  function clearFilters() {
    setCategory('all');
    setLanguage('All');
    setDifficulty('all');
    setHasBounty(false);
    setActiveTag(null);
  }

  const displayedProjects = React.useMemo<DiscoverProject[]>(() => filteredProjects.map((p) => ({
    id: p.id,
    name: p.name,
    organizationName: p.organizationId ?? '',
    description: p.description,
    tags: p.tags ?? [],
    techStack: p.tech ?? [],
    stars: p.stars ?? 0,
    forks: p.forks ?? 0,
    contributors: p.contributors ?? 0,
    openIssues: p.openIssues ?? 0,
    slug: p.slug,
    status: p.status,
  })), [filteredProjects]);

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Discover"
        description="Find open-source projects, opportunities, and contributors in the Sei ecosystem."
      />

      {/* Stats row */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard title="Projects" value={projects.length} icon={CircuitBoard} accent />
          <MetricCard title="Open Opportunities" value={opportunities.filter((o) => o.status === 'open').length} icon={Zap} />
          <MetricCard title="Contributors" value={contributors.length} icon={Users} />
          <MetricCard title="With Bounties" value={opportunities.filter((o) => !!o.bountyAmount).length} icon={Star} />
        </div>
      )}

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects, opportunities, contributors, technologies…"
          className="w-full pl-9 pr-4 py-3 text-sm rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Recommended tags */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground shrink-0">Quick filters:</span>
        {RECOMMENDED_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={cn(
              'px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors',
              activeTag === tag
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-border/60 hover:bg-muted',
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* View tabs + filter toggle */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted">
          {(['projects', 'issues', 'contributors'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={cn(
                'px-4 py-1.5 rounded-md text-xs font-medium transition-colors capitalize',
                activeView === v
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {v === 'projects' ? `Projects (${filteredProjects.length})`
                : v === 'issues' ? `Issues (${filteredIssues.length})`
                : `Contributors (${filteredContribs.length})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
              Clear filters
            </button>
          )}
          <Button
            variant="outline"
            size="sm"
            className={cn('gap-1.5 text-xs h-8', showFilters && 'border-primary/40 text-primary')}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {hasActiveFilters && (
              <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center">
                {[category !== 'all', language !== 'All', difficulty !== 'all', hasBounty, !!activeTag].filter(Boolean).length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
          {/* Category */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_FILTERS.map(({ label, value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    category === value
                      ? 'bg-primary/15 text-primary border-primary/30'
                      : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Language */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Language / Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGE_FILTERS.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                      language === lang
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Difficulty</p>
              <div className="flex flex-wrap gap-1.5">
                {DIFFICULTY_FILTERS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setDifficulty(value)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                      difficulty === value
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bounty toggle */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Bounty</p>
              <button
                onClick={() => setHasBounty(!hasBounty)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                  hasBounty
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                    : 'border-border text-muted-foreground hover:bg-muted',
                )}
              >
                <Star className="h-3.5 w-3.5" />
                Has Bounty
              </button>
            </div>
          </div>

          {/* Sort (projects only) */}
          {activeView === 'projects' && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sort by</p>
              <div className="flex flex-wrap gap-1.5">
                {SORT_OPTIONS.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setSort(value)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors',
                      sort === value
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : activeView === 'projects' ? (
        displayedProjects.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No projects found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )
      ) : activeView === 'issues' ? (
        filteredIssues.length === 0 ? (
          <EmptyState
            icon={Zap}
            title="No issues found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="space-y-3">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="rounded-xl border border-border bg-card p-5 hover:border-border/70 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge
                        variant={
                          issue.type === 'good-first-issue' ? 'success'
                            : issue.type === 'bounty' ? 'warning'
                            : issue.type === 'documentation' ? 'info'
                            : issue.type === 'bug-fix' ? 'destructive'
                            : 'muted'
                        }
                        className="text-[10px] capitalize"
                      >
                        {issue.type.replace(/-/g, ' ')}
                      </Badge>
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border',
                        issue.difficulty === 'beginner' ? 'text-green-400 bg-green-500/10 border-green-500/20'
                          : issue.difficulty === 'intermediate' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                          : 'text-red-400 bg-red-500/10 border-red-500/20',
                      )}>
                        {issue.difficulty} · {issue.points} pts
                      </span>
                      {issue.bountyAmount && (
                        <Badge variant="warning" className="text-[10px]">
                          {issue.bountyAmount} {issue.bountyToken}
                        </Badge>
                      )}
                    </div>
                    <Link
                      href={`/dashboard/issues/${issue.id}`}
                      className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {issue.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{issue.projectName} · {issue.organizationName}</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs h-7 shrink-0" asChild>
                    <Link href={`/dashboard/issues/${issue.id}`}>Apply</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {issue.skills.slice(0, 5).map((skill) => (
                    <Badge key={skill} variant="muted" className="text-[10px] px-1.5">{skill}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        filteredContribs.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No contributors found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContribs.map((contrib) => (
              <div key={contrib.id} className="rounded-xl border border-border bg-card p-5 hover:border-border/70 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                    {contrib.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{contrib.name}</p>
                    <p className="text-xs text-muted-foreground">@{contrib.handle}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-bold text-primary">{contrib.reputation}</p>
                    <p className="text-[10px] text-muted-foreground">rep</p>
                  </div>
                </div>
                {contrib.bio && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{contrib.bio}</p>
                )}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {contrib.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="muted" className="text-[10px] px-1.5">{skill}</Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{contrib.completedContribs} contributions</span>
                  <Button variant="outline" size="sm" className="h-6 text-[10px] px-2" asChild>
                    <Link href={`/dashboard/contributors/${contrib.id}`}>Profile</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
