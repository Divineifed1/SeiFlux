'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, User, ArrowRight, CheckCircle2, Lock, Eye, EyeOff } from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuthStore, MOCK_CONTRIBUTOR } from '@/lib/store/auth-store';
import { toast } from '@/hooks/use-toast';

const BENEFITS = [
  'Browse 120+ Sei ecosystem projects',
  'Apply to contribution opportunities',
  'Build your on-chain reputation',
];

export default function SignUpPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate async registration
    await new Promise((r) => setTimeout(r, 800));
    document.cookie = 'sei_auth_token=mock_token; path=/; max-age=86400';
    login(MOCK_CONTRIBUTOR);
    toast({
      variant: 'success',
      title: 'Account created!',
      description: "Welcome to SEI Builders Hub. Let's set up your profile.",
    });
    router.push('/onboarding');
  };

  return (
    <div className="w-full max-w-sm">
      {/* Benefits */}
      <div className="mb-6 space-y-1.5">
        {BENEFITS.map((b) => (
          <div key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
            {b}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-foreground mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Join the SEI Builders Hub community
          </p>
        </div>

        {/* GitHub OAuth */}
        <Button variant="outline" className="w-full gap-2.5 mb-4 h-10" asChild>
          <Link href="/select-account">
            <GithubIcon className="h-4 w-4" />
            Continue with GitHub
          </Link>
        </Button>

        <div className="relative my-5">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or sign up with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Alex Builder"
              autoComplete="name"
              startIcon={<User />}
              required
            />
          </div>

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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                startIcon={<Lock />}
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full gap-2 h-10" disabled={isLoading}>
            {isLoading ? (
              <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            ) : (
              <>
                Create account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-center text-[10px] text-muted-foreground">
            Demo mode — any input will create an account.
          </p>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-foreground font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
