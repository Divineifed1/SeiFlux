import { Controller, Get, Post, Body, Query, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reward } from '../entities/reward.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';

interface RewardEntry {
  id: string;
  description: string;
  amount: number;
  status: Reward['status'];
  date: string;
  wave?: string;
  issueTitle?: string;
}

interface RewardsSummary {
  totalEarned: number;
  pending: number;
  availableToClaim: number;
  rank: number;
  entries: RewardEntry[];
}

@Controller('rewards')
export class RewardsController {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get()
  async findAll(@Query('userId') userId?: string): Promise<RewardsSummary> {
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;
    const rewards = await this.rewardRepository.find({ where, order: { createdAt: 'DESC' } });

    const entries: RewardEntry[] = rewards.map((r) => ({
      id: r.id,
      description: r.issueTitle ? `Bounty payout — ${r.issueTitle}` : 'Reward payout',
      amount: Number(r.amount),
      status: r.status,
      date: r.createdAt.toISOString(),
      wave: r.waveId,
      issueTitle: r.issueTitle,
    }));

    const totalEarned = rewards
      .filter((r) => r.status === 'paid')
      .reduce((sum, r) => sum + Number(r.amount), 0);
    const pending = rewards
      .filter((r) => r.status !== 'paid')
      .reduce((sum, r) => sum + Number(r.amount), 0);
    const availableToClaim = rewards
      .filter((r) => r.status === 'pending')
      .reduce((sum, r) => sum + Number(r.amount), 0);

    return { totalEarned, pending, availableToClaim, rank: 0, entries };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body: { userId: string; amount: number; issueTitle?: string; prUrl?: string }) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne({ where: { id: body.userId } });
    if (!user) {
      // Handle not found error
      return;
    }

    const reward = this.rewardRepository.create({
      ...body,
      status: 'pending',
    });
    await this.rewardRepository.save(reward);

    const notifications = [
      this.notificationRepository.create({
        type: 'reward_received',
        title: 'Reward Received',
        message: `You have received a reward of ${body.amount} for "${body.issueTitle || 'your contribution'}".`,
        user,
      }),
    ];

    if (body.prUrl) {
      notifications.push(
        this.notificationRepository.create({
          type: 'pr_merged',
          title: 'Pull Request Merged',
          message: `Your PR "${body.prUrl}" has been merged.`,
          user,
        }),
      );
    }

    await this.notificationRepository.save(notifications);

    return reward;
  }

  @UseGuards(JwtAuthGuard)
  @Post('request')
  async request(@Request() req, @Body() body: { userId: string }) {
    if (req.user.id !== body.userId) {
      throw new UnauthorizedException();
    }

    const pending = await this.rewardRepository.find({
      where: { userId: body.userId, status: 'pending' },
    });
    await this.rewardRepository.save(
      pending.map((r) => ({ ...r, status: 'processing' as const })),
    );
    return { message: 'Reward request submitted', count: pending.length };
  }
}