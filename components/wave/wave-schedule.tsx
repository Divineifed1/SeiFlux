'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Zap, Clock } from 'lucide-react';
import { useWaves } from '@/lib/hooks/use-waves';
import { WaveCard } from '@/components/wave/wave-card';

function formatWaveDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function WaveSchedule({ className }: { className?: string }) {
  const { data: waves = [], isLoading } = useWaves();

  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (waves.length === 0) {
    return (
      <Card className={cn('border-dashed', className)}>
        <CardContent className="py-8 text-center">
          <div className="mx-auto h-10 w-10 rounded-lg bg-muted flex items-center justify-center mb-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No waves scheduled</p>
          <p className="text-xs text-muted-foreground mt-1">Waves will appear here once created by admins.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {waves.slice(0, 6).map((wave) => (
        <WaveCard key={wave.id} wave={wave} />
      ))}
    </div>
  );
}
