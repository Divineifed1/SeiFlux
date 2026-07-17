import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';

export const metadata: Metadata = { title: 'Select Account' };

export default function SelectAccountPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <GithubIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">github.com</span>
          </div>
          <h1 className="text-base font-semibold text-foreground">
            Choose an account to continue
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            to SeiFlux
          </p>
        </div>

        {/* Sign in prompt */}
        <div className="px-6 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-4">
            <GithubIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            Sign in with GitHub to see your accounts
          </p>
          <p className="text-xs text-muted-foreground mb-5">
            Your personal account and organizations appear here after you authenticate.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Sign in with GitHub
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-green-400" />
            Authorized by GitHub OAuth
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Not the right account?{' '}
        <Link href="/sign-in" className="text-foreground hover:underline">
          Sign in with a different account
        </Link>
      </p>
    </div>
  );
}
