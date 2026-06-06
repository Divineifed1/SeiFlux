import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Wave } from './wave.entity';
import { CreateWaveDto } from './create-wave.dto';
import { WaveStatus } from './wave-status.enum';

@Injectable()
export class WavesService {
  constructor(
    @InjectRepository(Wave)
    private waveRepository: Repository<Wave>,
  ) {}

  async createWave(createWaveDto: CreateWaveDto): Promise<Wave> {
    const wave = this.waveRepository.create({
      ...createWaveDto,
      startsAt: new Date(createWaveDto.startsAt),
      endsAt: new Date(createWaveDto.endsAt),
    });
    return await this.waveRepository.save(wave);
  }

  async findAll(): Promise<Wave[]> {
    return await this.waveRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Wave> {
    return await this.waveRepository.findOne({ where: { id } });
  }

  async findActive(): Promise<Wave | null> {
    const now = new Date();
    return await this.waveRepository.findOne({
      where: [
        {
          status: WaveStatus.ACTIVE,
          startsAt: LessThanOrEqual(now),
          endsAt: MoreThanOrEqual(now),
        },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: WaveStatus): Promise<Wave> {
    const wave = await this.waveRepository.findOne({ where: { id } });
    if (!wave) {
      throw new Error('Wave not found');
    }
    wave.status = status;
    return await this.waveRepository.save(wave);
  }

  async remove(id: string): Promise<void> {
    await this.waveRepository.delete(id);
  }
}
