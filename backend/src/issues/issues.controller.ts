import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Issue, IssueType } from '../entities/issue.entity';

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
}
