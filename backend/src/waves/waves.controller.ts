import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wave } from '../entities/wave.entity';
import { Application } from '../entities/application.entity';

@Controller('waves')
export class WavesController {
  constructor(
    @InjectRepository(Wave)
    private waveRepository: Repository<Wave>,
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  @Get()
  async findAll() {
    return this.waveRepository.find({ order: { createdAt: 'DESC' } });
  }

  @Get('current')
  async findCurrent() {
    return this.waveRepository.findOne({
      where: [
        { status: 'active' },
        { status: 'upcoming' },
      ],
      order: { startsAt: 'DESC' },
    });
  }

  @Post()
  async create(@Body() body: { name: string; startsAt: string }) {
    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(startsAt);
    endsAt.setDate(endsAt.getDate() + 8);

    const wave = this.waveRepository.create({
      name: body.name,
      startsAt,
      endsAt,
      status: 'upcoming',
    });

    return this.waveRepository.save(wave);
  }

  @Post(':id/close')
  async closeWave(@Param('id') id: string) {
    const wave = await this.waveRepository.findOne({ where: { id } });
    if (!wave) {
      return { message: 'Wave not found' };
    }

    wave.status = 'completed';
    await this.waveRepository.save(wave);

    const nextWave = await this.waveRepository.findOne({
      where: { status: 'upcoming' },
      order: { startsAt: 'ASC' },
    });

    if (nextWave) {
      const pendingApplications = await this.applicationRepository.find({
        where: { waveId: id, status: 'pending' },
      });

      for (const app of pendingApplications) {
        const rolledOver = this.applicationRepository.create({
          ...app,
          id: undefined,
          waveId: nextWave.id,
          rolledOverAt: new Date(),
          status: 'pending',
        });
        await this.applicationRepository.save(rolledOver);
      }
    }

    return { message: 'Wave closed', waveId: id };
  }

  @Put(':id')
  async updateWave(@Param('id') id: string, @Body() body: { name?: string; startsAt?: string; endsAt?: string; status?: string }) {
    const wave = await this.waveRepository.findOne({ where: { id } });
    if (!wave) {
      return { message: 'Wave not found' };
    }

    if (body.name) wave.name = body.name;
    if (body.startsAt) wave.startsAt = new Date(body.startsAt);
    if (body.endsAt) wave.endsAt = new Date(body.endsAt);
    if (body.status) wave.status = body.status as Wave['status'];

    await this.waveRepository.save(wave);
    return wave;
  }

  @Delete(':id')
  async deleteWave(@Param('id') id: string) {
    await this.waveRepository.delete(id);
    return { message: 'Wave deleted' };
  }
}
