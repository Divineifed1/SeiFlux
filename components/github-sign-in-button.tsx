'use client';

import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { loginWithGithub } from '@/lib/api/auth-api';

interface GithubSignInButtonProps {
  className?: string;
  label?: string;
}

export function GithubSignInButton({
  className,
  label = 'Sign in with GitHub',
}: GithubSignInButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={() => loginWithGithub()}
    >
      <GithubIcon className="h-4 w-4" />
      {label}
    </Button>
  );
}
