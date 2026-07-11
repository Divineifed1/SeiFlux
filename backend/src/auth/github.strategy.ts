import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from './auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const clientID = configService.get<string>('GITHUB_CLIENT_ID')?.trim();
    const clientSecret = configService.get<string>('GITHUB_CLIENT_SECRET')?.trim();
    const callbackURL = configService.get<string>('GITHUB_CALLBACK_URL')?.trim();
    const hasPlaceholderValues =
      !clientID ||
      !clientSecret ||
      !callbackURL ||
      clientID.includes('your_') ||
      clientID.includes('your-') ||
      clientID.includes('replace') ||
      clientSecret.includes('your_') ||
      clientSecret.includes('your-') ||
      clientSecret.includes('replace');

    if (hasPlaceholderValues) {
      console.warn(
        'GitHub OAuth is not configured. Set valid GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_CALLBACK_URL in backend/.env.',
      );
    }

    super({
      clientID: clientID || 'placeholder-client-id',
      clientSecret: clientSecret || 'placeholder-client-secret',
      callbackURL: callbackURL || 'http://localhost:3000/auth/github/callback',
      scope: ['user:email', 'read:org'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return this.authService.validateGithubUser(profile);
  }
}