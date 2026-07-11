'use client';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { GithubSignInButton } from '@/components/github-sign-in-button';

const BENEFITS = [
  'Browse 120+ Sei ecosystem projects',
  'Apply to contribution opportunities',
  'Build your on-chain reputation',
];

export default function SignUpPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 space-y-1.5">
        {BENEFITS.map((b) => (
          <div key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
            {b}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-foreground mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Join the SeiFlux community using GitHub.
          </p>
        </div>

        <GithubSignInButton
          className="w-full gap-2.5 mb-4 h-10 justify-center"
          label="Continue with GitHub"
        />

        <p className="text-sm text-muted-foreground text-center">
          GitHub is the only supported authentication method. Sign in or sign up with your GitHub account.
        </p>
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
