'use client';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/design-system/page-header';
import { CreateProjectDialog } from '@/components/dialogs/create-project-dialog';
import { ProjectsTable } from './projects-table';
import { useProjects } from '@/lib/hooks/use-projects';
import { useAuthStore } from '@/lib/store/auth-store';

export default function ProjectsPage() {
  const user = useAuthStore((s) => s.user);
  const { data: projects = [], isLoading } = useProjects(user?.id);

  const dashboardProjects = projects.map((p) => ({
    ...p,
    org: p.organizationId || 'Personal',
    openOpps: p.openIssues || 0,
    stars: p.stars || 0,
    forks: p.forks || 0,
    contributors: p.contributors || 0,
    tags: p.tags || [],
    tech: p.tech || [],
  }));

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Projects"
        description="Manage your project listings and contribution opportunities."
        actions={
          <CreateProjectDialog>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </CreateProjectDialog>
        }
      />

      <ProjectsTable initialProjects={dashboardProjects} isLoading={isLoading} />
    </div>
  );
}