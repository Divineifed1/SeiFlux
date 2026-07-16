'use client';
import * as React from 'react';
import { Crown, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/design-system/page-header';
import { LeaderboardList } from '@/components/leaderboard/leaderboard-list';
import { useLeaderboard } from '@/lib/hooks/use-leaderboard';
import { useAuthStore } from '@/lib/store/auth-store';

export default function AdminLeaderboardPage() {
  const { data } = useLeaderboard();
  const allWaves = data?.allWaves || [];
  const user = useAuthStore((s) => s.user);

  if (user?.role !== 'admin') {
    return (
      <div className="space-y-6 max-w-4xl">
        <PageHeader title="All-Waves Leaderboard" description="Aggregated rankings across every contribution wave." />
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <ShieldCheck className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Admin access required</p>
          <p className="text-xs text-muted-foreground mt-1">
            The all-waves leaderboard is only visible to platform administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="All-Waves Leaderboard"
        description="Aggregated contributor rankings across every contribution wave."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Crown className="h-4 w-4" />
            All Waves
          </span>
        }
      />

      <LeaderboardList entries={allWaves} />
    </div>
  );
}
