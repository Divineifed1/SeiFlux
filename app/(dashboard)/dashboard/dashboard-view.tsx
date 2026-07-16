'use client';
import { useAuthStore } from '@/lib/store/auth-store';
import { MaintainerDashboard } from './maintainer-dashboard';
import { ContributorDashboard } from './contributor-dashboard';

/**
 * Renders the appropriate dashboard based on the authenticated user's role.
 * Admins and maintainers see the maintainer view; contributors see their own view.
 */
export function DashboardView() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        Unable to load your dashboard. Please sign in again.
      </div>
    );
  }

  if (user.role === 'contributor') {
    return <ContributorDashboard user={user} />;
  }

  return <MaintainerDashboard />;
}