import * as React from 'react';
import Link from 'next/link';
import { Star, GitFork, Users, ExternalLink } from 'lucide-react';
import { cn, formatNumber } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from './status-badge';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  className?: string;
  showStatus?: boolean;
}

export function ProjectCard({ project, className, showStatus = false }: ProjectCardProps) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-200 hover:border-border/80 hover:shadow-card-hover',
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0 text-sm font-bold text-muted-foreground">
              {project.title.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <Link
                href={`/projects/${project.slug}`}
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {project.title}
              </Link>
              {project.organization && (
                <p className="text-xs text-muted-foreground">{project.organization.name}</p>
              )}
            </div>
          </div>
          {showStatus && <StatusBadge status={project.status} />}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {project.description}
        </p>

        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="muted" className="text-2xs px-1.5 py-0">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="muted" className="text-2xs px-1.5 py-0">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {formatNumber(project.starCount)}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-3 w-3" />
            {formatNumber(project.forkCount)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {project.contributorCount}
          </span>
          {project.openIssues > 0 && (
            <Badge variant="info" className="ml-auto text-2xs">
              {project.openIssues} open
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
