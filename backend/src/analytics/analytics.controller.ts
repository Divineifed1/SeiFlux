import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue } from '../entities/issue.entity';
import { Application } from '../entities/application.entity';
import { User } from '../entities/user.entity';
import { Wave } from '../entities/wave.entity';

export type AnalyticsPeriod = '7d' | '30d' | '90d';

interface TopContributor {
  name: string;
  handle: string;
  mergedPRs: number;
  openPRs: number;
  issuesClosed: number;
  joinedAt: string;
}

interface IssueCategory {
  category: string;
  count: number;
  resolutionRate: number;
  color: string;
}

interface AnalyticsData {
  period: AnalyticsPeriod;
  activeContributors: number;
  activeContributorsChange: number;
  openPRs: number;
  openPRsChange: number;
  mergedPRs: number;
  mergedPRsChange: number;
  issueResolutionRate: number;
  issueResolutionRateChange: number;
  topContributors: TopContributor[];
  issueCategories: IssueCategory[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'good-first-issue': '#22c55e',
  bounty: '#eab308',
  documentation: '#3b82f6',
  'bug-fix': '#ef4444',
  feature: '#a855f7',
};

@Controller('analytics')
export class AnalyticsController {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wave)
    private waveRepository: Repository<Wave>,
  ) {}

  @Get()
  async getAnalytics(@Query('period') period: AnalyticsPeriod = '30d'): Promise<AnalyticsData> {
    const [issues, applications, users, waves] = await Promise.all([
      this.issueRepository.find(),
      this.applicationRepository.find({ relations: ['applicant', 'wave'] }),
      this.userRepository.find(),
      this.waveRepository.find({ order: { startsAt: 'DESC' } }),
    ]);

    const contributors = applications
      .map((a) => a.applicant)
      .filter((u, i, arr) => u && arr.findIndex((x) => x?.id === u?.id) === i);

    const merged = applications.filter((a) => a.status === 'merged').length;
    const open = applications.filter((a) => a.status === 'pending' || a.status === 'review').length;
    const closedIssues = issues.filter((i) => i.status === 'closed').length;
    const resolutionRate = issues.length ? Math.round((closedIssues / issues.length) * 100) : 0;

    const byContributor = new Map<string, TopContributor>();
    for (const a of applications) {
      const u = a.applicant;
      if (!u) continue;
      const entry =
        byContributor.get(u.id) ??
        ({
          name: u.name,
          handle: u.githubUsername ?? a.applicantHandle,
          mergedPRs: 0,
          openPRs: 0,
          issuesClosed: 0,
          joinedAt: u.createdAt.toISOString().slice(0, 10),
        } as TopContributor);
      if (a.status === 'merged') entry.mergedPRs += 1;
      if (a.status === 'pending' || a.status === 'review') entry.openPRs += 1;
      byContributor.set(u.id, entry);
    }
    const topContributors = [...byContributor.values()]
      .sort((a, b) => b.mergedPRs - a.mergedPRs)
      .slice(0, 6);

    const categories = new Map<string, { count: number; closed: number }>();
    for (const i of issues) {
      const c = categories.get(i.type) ?? { count: 0, closed: 0 };
      c.count += 1;
      if (i.status === 'closed') c.closed += 1;
      categories.set(i.type, c);
    }
    const issueCategories: IssueCategory[] = [...categories.entries()].map(([category, v]) => ({
      category,
      count: v.count,
      resolutionRate: v.count ? Math.round((v.closed / v.count) * 100) : 0,
      color: CATEGORY_COLORS[category] ?? '#64748b',
    }));

    return {
      period,
      activeContributors: contributors.length,
      activeContributorsChange: 0,
      openPRs: open,
      openPRsChange: 0,
      mergedPRs: merged,
      mergedPRsChange: 0,
      issueResolutionRate: resolutionRate,
      issueResolutionRateChange: 0,
      topContributors,
      issueCategories,
    };
  }
}
