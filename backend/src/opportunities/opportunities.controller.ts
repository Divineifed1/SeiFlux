import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Opportunity, OpportunityType } from '../entities/opportunity.entity';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(
    @InjectRepository(Opportunity)
    private opportunityRepository: Repository<Opportunity>,
  ) {}

  @Get()
  async findAll(@Query('type') type?: OpportunityType) {
    if (type) {
      return this.opportunityRepository.find({ where: { type } });
    }
    return this.opportunityRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.opportunityRepository.findOne({ where: { id } });
  }
}