'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Calendar, Clock } from 'lucide-react';
import type { Wave } from '@/types';

function formatWaveDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function getDaysRemaining(wave: Wave): number {
  const now = new Date();
  const end = new Date(wave.endsAt);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'muted' | 'destructive' }> = {
  upcoming: { label: 'Upcoming', variant: 'warning' },
  active: { label: 'Active', variant: 'success' },
  completed: { label: 'Completed', variant: 'muted' },
};

export function WaveCard({ wave, className }: { wave: Wave; className?: string }) {
  const daysRemaining = getDaysRemaining(wave);
  const status = STATUS_CONFIG[wave.status] || STATUS_CONFIG.upcoming;

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">{wave.name}</CardTitle>
              <Badge variant={status.variant} className="text-[10px] mt-0.5">
                {status.label}
              </Badge>
            </div>
          </div>
          {wave.status === 'active' && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {daysRemaining}d left
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatWaveDate(wave.startsAt)}
          </span>
          <span className="text-border">→</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatWaveDate(wave.endsAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
