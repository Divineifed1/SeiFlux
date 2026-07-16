import { Controller, Get, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';
import { Wave } from '../entities/wave.entity';

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

function initials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

@Controller('leaderboards')
export class LeaderboardsController {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Wave)
    private waveRepository: Repository<Wave>,
  ) {}

  @Get('waves')
  async listWaves() {
    return this.waveRepository.find({ order: { startsAt: 'DESC' } });
  }

  @Get('wave/:id')
  async byWave(@Param('id') id: string): Promise<LeaderboardEntry[]> {
    return this.compute(id);
  }

  @Get('all')
  async all(@Query('waveId') waveId?: string): Promise<LeaderboardEntry[]> {
    return this.compute(waveId);
  }

  private async compute(waveId?: string): Promise<LeaderboardEntry[]> {
    const where: Record<string, unknown> = {
      status: 'merged',
    };
    if (waveId) where.waveId = waveId;
    // Approved applications also count as completed/earning points.
    const [merged, approved] = await Promise.all([
      this.applicationRepository.find({
        where: { ...where, status: 'merged' },
        relations: ['issue', 'applicant', 'wave'],
      }),
      this.applicationRepository.find({
        where: { ...where, status: 'approved' },
        relations: ['issue', 'applicant', 'wave'],
      }),
    ]);
    const all = [...merged, ...approved];

    const byUser = new Map<string, LeaderboardEntry>();
    for (const app of all) {
      const user = app.applicant;
      if (!user) continue;
      const points = app.issue?.points ?? 0;
      const existing =
        byUser.get(user.id) ??
        ({
          rank: 0,
          userId: user.id,
          name: user.name,
          handle: user.githubUsername ?? app.applicantHandle,
          points: 0,
          issuesCompleted: 0,
          mergedPRs: 0,
          initials: initials(user.name),
        } as LeaderboardEntry);
      existing.points += points;
      existing.issuesCompleted += 1;
      if (app.status === 'merged') existing.mergedPRs += 1;
      byUser.set(user.id, existing);
    }

    return [...byUser.values()]
      .sort((a, b) => b.points - a.points)
      .map((e, i) => ({ ...e, rank: i + 1 }));
  }
}
