'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { LeaderboardEntry } from '@/lib/hooks/use-leaderboard';

const RANK_STYLES: Record<number, string> = {
  1: 'bg-yellow-500/15 text-yellow-400 ring-yellow-500/30',
  2: 'bg-muted text-muted-foreground ring-border',
  3: 'bg-amber-700/15 text-amber-500 ring-amber-700/30',
};

export function LeaderboardList({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs w-16">#</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs">Contributor</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden sm:table-cell">Issues</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground text-xs hidden sm:table-cell">Merged</th>
            <th className="text-right px-5 py-3 font-medium text-muted-foreground text-xs">Points</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr
              key={e.userId}
              className={cn(
                'border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors',
                e.rank <= 3 && 'bg-primary/[0.03]'
              )}
            >
              <td className="px-5 py-3">
                {e.rank <= 3 ? (
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ring-1 ring-inset',
                      RANK_STYLES[e.rank]
                    )}
                  >
                    {e.rank}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground tabular-nums">{e.rank}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                      {e.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{e.name}</p>
                    <p className="text-[10px] text-muted-foreground">@{e.handle}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums hidden sm:table-cell">
                {e.issuesCompleted}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums hidden sm:table-cell">
                {e.mergedPRs}
              </td>
              <td className="px-5 py-3 text-right">
                <Badge variant="muted" className="text-xs tabular-nums">{e.points} pts</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
