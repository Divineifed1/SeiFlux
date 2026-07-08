'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrentWave } from '@/lib/hooks/use-waves';
import { Zap, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function formatWaveDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function getWaveStatusLabel(wave: { status: string; startsAt: Date; endsAt: Date }) {
  if (wave.status === 'active') {
    return { label: 'Wave Active', variant: 'success' as const };
  }
  if (wave.status === 'upcoming') {
    return { label: 'Wave Starting Soon', variant: 'warning' as const };
  }
  return { label: 'Wave Ended', variant: 'muted' as const };
}

export function WaveBanner({ className }: { className?: string }) {
  const { data: wave, isLoading, error } = useCurrentWave();

  if (isLoading || error || !wave) {
    return null;
  }

  const status = getWaveStatusLabel(wave);

  return (
    <div className={cn('w-full bg-primary/5 border-b border-primary/10', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">{wave.name}</span>
              <span className="text-[11px] text-muted-foreground">
                {formatWaveDate(wave.startsAt)} — {formatWaveDate(wave.endsAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={status.variant} className="text-[10px]">
              {status.label}
            </Badge>
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1.5" asChild>
              <Link href="/dashboard/issues">
                Explore Issues
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
