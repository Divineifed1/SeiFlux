'use client';
import { useMemo } from 'react';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  handle: string;
  points: number;
  issuesCompleted: number;
  mergedPRs: number;
  initials: string;
}

export interface WaveSummary {
  id: string;
  name: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface LeaderboardData {
  waves: WaveSummary[];
  perWave: Record<string, LeaderboardEntry[]>;
  allWaves: LeaderboardEntry[];
}

interface Contributor {
  id: string;
  name: string;
  handle: string;
}

const CONTRIBUTORS: Contributor[] = [
  { id: 'u1', name: 'Dev Contributor', handle: 'dev_contributor' },
  { id: 'u2', name: 'Alex Builder', handle: 'alex_builder' },
  { id: 'u3', name: 'Sarah Kim', handle: 'sarah_builds' },
  { id: 'u4', name: 'Marcus Webb', handle: 'mwebb_eng' },
  { id: 'u5', name: 'Priya Nair', handle: 'priya_builds' },
  { id: 'u6', name: 'Kai Zhang', handle: 'kai_z_dev' },
  { id: 'u7', name: 'Lucas Martin', handle: 'lmartin_dev' },
  { id: 'u8', name: 'Emma Scott', handle: 'emma_scott' },
];

const WAVES: WaveSummary[] = [
  { id: 'wave_7', name: 'Wave 7', status: 'active' },
  { id: 'wave_6', name: 'Wave 6', status: 'completed' },
  { id: 'wave_5', name: 'Wave 5', status: 'completed' },
];

const POINTS_BY_WAVE: Record<string, Record<string, number>> = {
  wave_7: { u1: 620, u2: 540, u3: 410, u4: 260, u5: 330, u6: 180, u7: 90, u8: 70 },
  wave_6: { u1: 540, u2: 480, u3: 360, u4: 300, u5: 220, u6: 150 },
  wave_5: { u1: 410, u2: 520, u3: 300, u4: 250, u5: 180 },
};

function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function buildEntries(pointsMap: Record<string, number>): LeaderboardEntry[] {
  return Object.entries(pointsMap)
    .map(([userId, points]) => {
      const c = CONTRIBUTORS.find((x) => x.id === userId)!;
      return {
        rank: 0,
        userId,
        name: c.name,
        handle: c.handle,
        points,
        issuesCompleted: Math.max(1, Math.round(points / 90)),
        mergedPRs: Math.max(1, Math.round(points / 120)),
        initials: initials(c.name),
      };
    })
    .sort((a, b) => b.points - a.points)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

export function useLeaderboard(): LeaderboardData {
  return useMemo(() => {
    const perWave: Record<string, LeaderboardEntry[]> = {};
    const allPoints: Record<string, number> = {};

    WAVES.forEach((wave) => {
      const map = POINTS_BY_WAVE[wave.id] ?? {};
      perWave[wave.id] = buildEntries(map);
      Object.entries(map).forEach(([userId, pts]) => {
        allPoints[userId] = (allPoints[userId] ?? 0) + pts;
      });
    });

    const allWaves = buildEntries(allPoints);

    return { waves: WAVES, perWave, allWaves };
  }, []);
}
