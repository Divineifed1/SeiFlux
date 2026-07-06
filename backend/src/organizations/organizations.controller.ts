import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';

@Controller('organizations')
export class OrganizationsController {
  constructor(
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
  ) {}

  @Get()
  async findAll() {
    return this.organizationRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.organizationRepository.findOne({ where: { id } });
  }

  @Post()
  async create(@Body() createOrganizationDto: Partial<Organization>) {
    const org = this.organizationRepository.create(createOrganizationDto);
    return this.organizationRepository.save(org);
  }
}