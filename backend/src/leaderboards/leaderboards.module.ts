import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../entities/application.entity';
import { Wave } from '../entities/wave.entity';
import { LeaderboardsController } from './leaderboards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Wave])],
  controllers: [LeaderboardsController],
})
export class LeaderboardsModule {}
