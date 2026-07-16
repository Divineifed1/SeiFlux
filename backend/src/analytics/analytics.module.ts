import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from '../entities/issue.entity';
import { Application } from '../entities/application.entity';
import { User } from '../entities/user.entity';
import { Wave } from '../entities/wave.entity';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Application, User, Wave])],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
