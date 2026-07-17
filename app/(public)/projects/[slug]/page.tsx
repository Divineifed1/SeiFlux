'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  Star,
  GitFork,
  Users,
  Globe,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Zap,
  Code2,
  ChevronRight,
  Clock,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/design-system/status-badge';
import { GithubIcon } from '@/components/ui/github-icon';
import { IssuesList } from './issues-list';
import { useProjectSubmissions } from '@/lib/store/project-submissions-store';
import { useProject, useIssues } from '@/lib/hooks';

export default function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const submissions = useProjectSubmissions((s) => s.submissions);
  const submission = submissions.find((p) => p.slug === slug) || null;

  const { data: apiProject, isLoading: projectLoading } = useProject(slug);
  const { data: allIssues, isLoading: issuesLoading } = useIssues();

  const project = submission
    ? {
        id: submission.slug,
        name: submission.name,
        slug: submission.slug,
        org: submission.org,
        description: submission.description,
        longDescription: submission.description,
        tags: submission.tags,
        tech: submission.tech,
        stars: 0,
        forks: 0,
        contributors: 0,
        openOpportunities: 0,
        status: submission.status,
        website: undefined,
        github: submission.repoUrl,
      }
    : apiProject
      ? {
          id: apiProject.id,
          name: apiProject.name,
          slug: apiProject.slug,
          org: apiProject.organizationId ?? '',
          description: apiProject.description,
          longDescription: apiProject.description,
          tags: apiProject.tags ?? [],
          tech: apiProject.tech ?? [],
          stars: apiProject.stars ?? 0,
          forks: apiProject.forks ?? 0,
          contributors: apiProject.contributors ?? 0,
          openOpportunities: apiProject.openIssues ?? 0,
          status: apiProject.status,
          website: undefined,
          github: undefined,
        }
      : null;

  const isApproved = !submission || submission.status === 'approved';
  const issues = React.useMemo(() => {
    if (!allIssues || !project) return [];
    return allIssues.filter((issue) => issue.projectId === project.id);
  }, [allIssues, project]);

  if (projectLoading) {
    return (
      <div className="pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center py-20">
          <p className="text-sm text-muted-foreground">Project not found.</p>
          <Button asChild className="mt-4">
            <Link href="/projects">Back to projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground py-4 mb-2">
          <Link
            href="/projects"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Projects
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{project.name}</span>
        </div>

        {submission && !isApproved && (
          <div className="mb-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-start gap-3">
            <Clock className="h-4 w-4 text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                This project is {submission.status}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {submission.status === 'pending'
                  ? 'It is awaiting admin review and will appear publicly once approved.'
                  : 'It was not approved and is not publicly listed.'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Main content */}
          <div>
            {/* Project header */}
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center text-xl font-black text-muted-foreground shrink-0">
                  {project.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
                    <StatusBadge status={project.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{project.org}</p>
                </div>
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="text-xs bg-primary/15 text-primary border-primary/20"
                  >
                    {tag}
                  </Badge>
                ))}
                {project.tech.map((t) => (
                  <Badge key={t} variant="muted" className="text-xs">
                    <Code2 className="h-2.5 w-2.5 mr-1" />
                    {t}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4" />
                  <strong className="text-foreground">{project.stars.toLocaleString()}</strong> stars
                </span>
                <span className="flex items-center gap-1.5">
                  <GitFork className="h-4 w-4" />
                  <strong className="text-foreground">{project.forks}</strong> forks
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <strong className="text-foreground">{project.contributors}</strong> contributors
                </span>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Tabs */}
              <Tabs defaultValue="issues">
                <TabsList className="mb-6">
                  <TabsTrigger value="issues">
                    Issues{' '}
                    <Badge variant="muted" className="ml-1.5 text-[10px] px-1">
                      {issues.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>

                <TabsContent value="issues">
                  {issuesLoading ? (
                    <div className="flex items-center justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <IssuesList
                      issues={issues}
                      projectName={project.name}
                    />
                  )}
                </TabsContent>

                <TabsContent value="about">
                  <div className="prose prose-sm prose-invert max-w-none">
                    {project.longDescription.split('\n\n').map((para, i) => (
                      <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {para.trim()}
                      </p>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* CTA */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm font-semibold text-foreground mb-1">
                 {project.openOpportunities} open issues
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Join {project.contributors} contributors already building this project.
              </p>
              <Button className="w-full" asChild>
                <Link href="/sign-up">
                  <Zap className="h-4 w-4" />
                  Start contributing
                </Link>
              </Button>
            </div>

            {/* Links */}
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Links
              </p>
              <div className="space-y-2">
                {project.website && (
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <GithubIcon className="h-4 w-4" />
                    GitHub
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </a>
                )}
                <a
                  href="#"
                  className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Documentation
                </a>
              </div>
            </div>

            {/* Tech stack */}
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <Badge key={t} variant="muted" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}