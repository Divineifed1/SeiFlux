import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue, IssueType, DifficultyLevel } from '../entities/issue.entity';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';

@Controller('issues')
export class IssuesController {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  @Get()
  async findAll(@Query('type') type?: IssueType) {
    if (type) {
      return this.issueRepository.find({ where: { type } });
    }
    return this.issueRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.issueRepository.findOne({ where: { id } });
  }

  @Post()
  async create(@Body() body: { title: string; description: string; projectId: string; type: IssueType; difficulty: DifficultyLevel; skills?: string }) {
    const pointsMap: Record<DifficultyLevel, number> = {
      beginner: 50,
      intermediate: 75,
      advanced: 100,
    };

    const issue = this.issueRepository.create({
      ...body,
      points: pointsMap[body.difficulty] || 0,
    });

    return this.issueRepository.save(issue);
  }

  @Post(':id/apply')
  async apply(@Param('id') id: string, @Body() { applicantId }: { applicantId: string }) {
    const issue = await this.issueRepository.findOne({ where: { id } });
    const project = await this.projectRepository.findOne({ where: { id: issue.projectId }, relations: ['maintainers'] });
    const applicant = await this.userRepository.findOne({ where: { id: applicantId } });

    if (!issue || !project || !applicant) {
      // Handle not found error
      return;
    }

    const notifications = project.maintainers.map(maintainer =>
      this.notificationRepository.create({
        type: 'issue_application',
        title: 'New Issue Application',
        message: `${applicant.name} applied for the issue "${issue.title}"`,
        user: maintainer,
      }),
    );

    await this.notificationRepository.save(notifications);

    return { message: 'Application submitted successfully' };
  }
}