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
  async findAll(
    @Query('opportunityId') opportunityId?: string,
    @Query('applicantId') applicantId?: string,
    @Query('status') status?: string,
  ) {
    const where: Record<string, unknown> = {};
    if (opportunityId) where.opportunityId = opportunityId;
    if (applicantId) where.applicantId = applicantId;
    if (status) where.status = status;
    return this.applicationRepository.find({ where, order: { appliedAt: 'DESC' } });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.applicationRepository.findOne({ where: { id } });
  }

  @Post()
  async create(@Body() body: { opportunityId: string; applicantName: string; applicantHandle: string; message?: string }) {
    const application = this.applicationRepository.create({
      opportunityId: body.opportunityId,
      applicantName: body.applicantName,
      applicantHandle: body.applicantHandle,
      message: body.message,
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
    await this.applicationRepository.update(id, { status: 'rejected' });
    return { message: 'Application rejected' };
  }

  @Post(':id/merge')
  async merge(@Param('id') id: string) {
    await this.applicationRepository.update(id, { status: 'merged' });
    return { message: 'Application merged' };
  }

  @Post(':id/close')
  async close(@Param('id') id: string) {
    await this.applicationRepository.update(id, { status: 'closed' });
    return { message: 'Application closed' };
  }
}
