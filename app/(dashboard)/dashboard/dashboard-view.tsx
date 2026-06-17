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

  if (!user) return null;

  if (user.role === 'contributor') {
    return <ContributorDashboard user={user} />;
  }

  return <MaintainerDashboard />;
}
