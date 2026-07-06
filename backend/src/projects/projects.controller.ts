import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Controller('projects')
export class ProjectsController {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  @Get()
  async findAll() {
    return this.projectRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectRepository.findOne({ where: { id } });
  }

  @Get('by-slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.projectRepository.findOne({ where: { slug } });
  }

  @Post()
  async create(@Body() createProjectDto: Partial<Project>) {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }
}