import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue, IssueType, DifficultyLevel } from '../entities/issue.entity';

@Controller('issues')
export class IssuesController {
  constructor(
    @InjectRepository(Issue)
    private issueRepository: Repository<Issue>,
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
      title: body.title,
      description: body.description,
      projectId: body.projectId,
      type: body.type,
      difficulty: body.difficulty,
      points: pointsMap[body.difficulty] || 0,
      skills: body.skills || '',
    });

    return this.issueRepository.save(issue);
  }
}
