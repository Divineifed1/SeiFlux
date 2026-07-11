'use client';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { GithubSignInButton } from '@/components/github-sign-in-button';

export default function SignInPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary mx-auto mb-3">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your SeiFlux account with GitHub.
          </p>
        </div>

        <GithubSignInButton className="w-full gap-2.5 mb-4 h-10 justify-center" />

        <p className="text-sm text-muted-foreground text-center">
          GitHub is the only supported authentication method. This will create or sign in to your SeiFlux account.
        </p>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        New here?{' '}
        <Link href="/sign-up" className="text-foreground font-medium hover:underline">
          Sign up with GitHub
        </Link>
      </p>
    </div>
  );
}
