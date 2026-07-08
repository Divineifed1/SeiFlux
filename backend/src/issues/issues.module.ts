import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssuesController } from './issues.controller';
import { Issue } from '../entities/issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue])],
  controllers: [IssuesController],
})
export class IssuesModule {}
