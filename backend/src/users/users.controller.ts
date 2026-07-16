import { Controller, Get, Post, Body, Param, Query, Put, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Notification } from '../entities/notification.entity';
import { Project } from '../entities/project.entity';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  @Get()
  async findAll(@Query('role') role?: UserRole) {
    if (role) {
      return this.userRepository.find({ where: { role } });
    }
    return this.userRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  @Post()
  async create(@Body() body: { name: string; role: UserRole }) {
    const user = this.userRepository.create(body);
    await this.userRepository.save(user);

    if (body.role === 'contributor') {
      const projects = await this.projectRepository.find({ relations: ['maintainers'] });
      const notifications = [];

      for (const project of projects) {
        for (const maintainer of project.maintainers) {
          notifications.push(
            this.notificationRepository.create({
              type: 'new_contributor',
              title: 'New Contributor',
              message: `${user.name} has joined as a contributor.`,
              user: maintainer,
            }),
          );
        }
      }

      await this.notificationRepository.save(notifications);
    }

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/wallet')
  async updateWallet(@Request() req, @Param('id') id: string, @Body() body: { walletAddress: string }) {
    if (req.user.id !== id) {
      throw new UnauthorizedException();
    }
    await this.userRepository.update(id, { walletAddress: body.walletAddress });
    return { message: 'Wallet address updated successfully' };
  }
}