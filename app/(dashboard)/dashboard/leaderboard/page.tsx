'use client';
import * as React from 'react';
import { Medal, Trophy } from 'lucide-react';
import { PageHeader } from '@/components/design-system/page-header';
import { useLeaderboard } from '@/lib/hooks/use-leaderboard';
import { LeaderboardList } from '@/components/leaderboard/leaderboard-list';
import { cn } from '@/lib/utils';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'muted'> = {
  active: 'success',
  completed: 'muted',
  upcoming: 'warning',
};

export default function LeaderboardPage() {
  const { data, isLoading } = useLeaderboard();

  const { waves = [], perWave = {} } = data || {};

  const activeWave = waves.find((w) => w.status === 'active') ?? waves[0];
  const [selectedWaveId, setSelectedWaveId] = React.useState(activeWave?.id);

  React.useEffect(() => {
    if (activeWave && !selectedWaveId) {
      setSelectedWaveId(activeWave.id);
    }
  }, [activeWave, selectedWaveId]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper skeleton loader
  }

  const entries = selectedWaveId ? perWave[selectedWaveId] ?? [] : [];
  const selectedWave = waves.find((w) => w.id === selectedWaveId);
  const top = entries[0];

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Leaderboard"
        description="Top contributors ranked by points earned from issue contributions."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Medal className="h-4 w-4" />
            {selectedWave?.name || 'Select a wave'}
          </span>
        }
      />

      {/* Wave selector */}
      <div className="flex flex-wrap items-center gap-2">
        {waves.map((wave) => (
          <button
            key={wave.id}
            onClick={() => setSelectedWaveId(wave.id)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors',
              wave.id === selectedWaveId
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border hover:text-foreground'
            )}
          >
            {wave.name}
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                wave.status === 'active' ? 'bg-green-400' : wave.status === 'upcoming' ? 'bg-yellow-400' : 'bg-muted-foreground'
              )}
            />
          </button>
        ))}
      </div>

      {/* Wave champion */}
      {top && (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Trophy className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {selectedWave?.name || 'Wave'} champion
            </p>
            <p className="text-lg font-bold text-foreground truncate">{top.name}</p>
            <p className="text-xs text-muted-foreground">@{top.handle} · {top.points} points</p>
          </div>
        </div>
      )}

      <LeaderboardList entries={entries} />
    </div>
  );
}