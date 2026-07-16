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

      <ProjectsTable initialProjects={projects} isLoading={isLoading} />
    </div>
  );
}