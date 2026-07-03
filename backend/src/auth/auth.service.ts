import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateGithubUser(githubProfile: any): Promise<User> {
    const { id, emails, displayName, photos, username } = githubProfile;

    let user = await this.userRepository.findOne({ where: { githubId: id } });

    if (!user) {
      user = this.userRepository.create({
        githubId: id,
        email: emails[0].value,
        name: displayName || username,
        avatar: photos?.[0]?.value,
        githubUsername: username,
        role: 'contributor',
      });
      await this.userRepository.save(user);
    }

    return user;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      githubUsername: user.githubUsername,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        githubUsername: user.githubUsername,
      },
    };
  }

  async validateUser(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}