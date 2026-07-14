'use client';
import { Badge } from '@/components/ui/badge';
import { ApplyDialog } from '@/components/dialogs/apply-dialog';
import { Button } from '@/components/ui/button';

const DIFFICULTY_CONFIG = {
  beginner:     { label: 'Beginner',     className: 'bg-green-500/10 text-green-400 ring-green-500/20' },
  intermediate: { label: 'Intermediate', className: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20' },
  advanced:     { label: 'Advanced',     className: 'bg-red-500/10 text-red-400 ring-red-500/20' },
};

const TYPE_CONFIG = {
  bug:           { label: 'Bug',     variant: 'destructive' as const },
  feature:       { label: 'Feature', variant: 'info' as const },
  documentation: { label: 'Docs',   variant: 'muted' as const },
  design:        { label: 'Design',  variant: 'warning' as const },
  other:         { label: 'Other',   variant: 'muted' as const },
};

interface Issue {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  points: number;
  skills: string[];
  applications: number;
}

interface IssuesListProps {
  issues: Issue[];
  projectName: string;
}

export function IssuesList({ issues, projectName }: IssuesListProps) {
  if (issues.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-10 text-center">
        <p className="text-sm font-medium text-foreground">No issues posted yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Contributors will be able to apply to opportunities as they&apos;re added.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue) => {
        const diffConfig = DIFFICULTY_CONFIG[issue.difficulty as keyof typeof DIFFICULTY_CONFIG];
        const typeConfig = TYPE_CONFIG[issue.type as keyof typeof TYPE_CONFIG];
        return (
          <div
            key={issue.id}
            className="rounded-lg border border-border bg-card p-4 hover:border-border/80 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant={typeConfig?.variant ?? 'muted'} className="text-[10px]">
                    {typeConfig?.label ?? issue.type}
                  </Badge>
                  {diffConfig && (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${diffConfig.className}`}
                    >
                      {diffConfig.label} · {issue.points} pts
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-medium text-foreground mb-2">{issue.title}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {issue.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {issue.applications} applied
                </span>
                <ApplyDialog
                  issueTitle={issue.title}
                  projectName={projectName}
                  skills={issue.skills}
                >
                  <Button size="sm" variant="outline-primary">Apply</Button>
                </ApplyDialog>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
