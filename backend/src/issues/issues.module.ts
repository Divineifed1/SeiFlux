import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IssuesController } from './issues.controller';
import { Issue } from '../entities/issue.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue, Notification, User, Project])],
  controllers: [IssuesController],
})
export class IssuesModule {}
