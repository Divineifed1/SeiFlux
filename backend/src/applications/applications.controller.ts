import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';

@Controller('applications')
export class ApplicationsController {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  @Get()
  async findAll(@Query('waveId') waveId?: string, @Query('issueId') issueId?: string) {
    const where: Record<string, unknown> = {};
    if (waveId) where.waveId = waveId;
    if (issueId) where.issueId = issueId;
    return this.applicationRepository.find({ where, order: { appliedAt: 'DESC' } });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.applicationRepository.findOne({ where: { id } });
  }

  @Post()
  async create(@Body() body: { issueId: string; contributorId?: string; waveId?: string; coverLetter?: string; githubProfile?: string }) {
    const application = this.applicationRepository.create({
      issueId: body.issueId,
      contributorId: body.contributorId,
      waveId: body.waveId,
      coverLetter: body.coverLetter,
      githubProfile: body.githubProfile,
      status: 'pending',
      appliedAt: new Date(),
    });
    return this.applicationRepository.save(application);
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    await this.applicationRepository.update(id, { status: 'approved' });
    return { message: 'Application approved' };
  }

  @Post(':id/reject')
  async reject(@Param('id') id: string) {
    await this.applicationRepository.update(id, { status: 'rejected', closedAt: new Date() });
    return { message: 'Application rejected' };
  }

  @Post(':id/merge')
  async merge(@Param('id') id: string) {
    await this.applicationRepository.update(id, { status: 'merged' });
    return { message: 'Application merged' };
  }

  @Post(':id/close')
  async close(@Param('id') id: string) {
    await this.applicationRepository.update(id, { status: 'closed', closedAt: new Date() });
    return { message: 'Application closed' };
  }
}
