'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { loginWithGithub } from '@/lib/api/auth-api';

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGithubLogin = () => {
    loginWithGithub();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary mx-auto mb-3">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your SeiFlux account
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full gap-2.5 mb-4 h-10"
          onClick={handleGithubLogin}
        >
          <GithubIcon className="h-4 w-4" />
          Continue with GitHub
        </Button>

        <div className="relative my-5">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or sign in with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              startIcon={<Mail />}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              startIcon={<Lock />}
              required
            />
          </div>

          <Button type="submit" className="w-full gap-2 h-10" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                Sign in
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Don&apos;t have an account?{' '}
        <Link href="/sign-up" className="text-foreground font-medium hover:underline">
          Sign up
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground/50 mt-2">
        Demo mode: email sign-in works with any credentials
      </p>
    </div>
  );
}