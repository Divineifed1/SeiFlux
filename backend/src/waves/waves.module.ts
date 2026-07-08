import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WavesController } from './waves.controller';
import { Wave } from '../entities/wave.entity';
import { Application } from '../entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wave, Application])],
  controllers: [WavesController],
})
export class WavesModule {}
