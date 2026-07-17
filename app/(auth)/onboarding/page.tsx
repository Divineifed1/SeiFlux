'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Code2,
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const STEPS = ['Role', 'Profile', 'Done'];

type Role = 'maintainer' | 'contributor';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [role, setRole] = React.useState<Role | null>(null);

  function finishOnboarding() {
    router.push('/sign-in');
  }

  const ROLES = [
    {
      id: 'maintainer' as Role,
      icon: Building2,
      title: 'Project Maintainer',
      description: 'I manage open-source projects and want to attract contributors from the Sei community.',
      badge: 'For project owners',
    },
    {
      id: 'contributor' as Role,
      icon: Code2,
      title: 'Contributor',
      description: 'I\'m a developer looking to contribute to Sei ecosystem projects and grow my Web3 skills.',
      badge: 'For developers',
    },
  ];

  return (
    <div className="w-full max-w-lg">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                  i < step
                    ? 'bg-primary text-primary-foreground'
                    : i === step
                    ? 'bg-primary/20 text-primary ring-1 ring-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  i === step ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('h-px flex-1 max-w-[40px]', i < step ? 'bg-primary' : 'bg-border')} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
        {/* Step 0: Role selection */}
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-foreground mb-1">How will you use the platform?</h1>
              <p className="text-sm text-muted-foreground">
                Choose your primary role. You can change this later.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {ROLES.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id)}
                    className={cn(
                      'w-full rounded-xl border p-4 text-left transition-all duration-150',
                      role === r.id
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-border bg-card hover:border-border/80 hover:bg-accent/30'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg shrink-0',
                          role === r.id ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-foreground">{r.title}</p>
                          {role === r.id && (
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-2.5 w-2.5 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{r.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              className="w-full gap-2"
              disabled={!role}
              onClick={() => setStep(1)}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 1: Profile setup */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-foreground mb-1">
                {role === 'maintainer' ? 'Set up your profile' : 'Tell us about yourself'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {role === 'maintainer'
                  ? 'This helps contributors find and trust your organization.'
                  : 'Help maintainers understand your background and skills.'}
              </p>
            </div>

            <form className="space-y-4">
              {role === 'maintainer' ? (
                <>
                  <div className="space-y-1.5">
                    <Label>Organization name</Label>
                    <Input placeholder="SeiSwap Labs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Website</Label>
                    <Input placeholder="https://your-project.com" type="url" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Short description</Label>
                    <Textarea
                      placeholder="Describe what you're building on Sei..."
                      className="resize-none h-20"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label>GitHub username</Label>
                    <Input placeholder="your-github-handle" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Bio</Label>
                    <Textarea
                      placeholder="Tell maintainers about your background and what you're looking for..."
                      className="resize-none h-20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Primary skills</Label>
                    <Input placeholder="e.g. Rust, TypeScript, Solidity" />
                    <p className="text-[10px] text-muted-foreground">Comma separated</p>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => setStep(0)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  className="flex-1 gap-2"
                  onClick={() => { finishOnboarding(); setStep(2); }}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Done */}
        {step === 2 && (
          <div className="text-center py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 mx-auto mb-5">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">
              You&apos;re all set!
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              {role === 'maintainer'
                ? 'Your account is ready. Start by creating your first organization and project.'
                : 'Your profile is ready. Start exploring projects and finding contribution opportunities.'}
            </p>

            <div className="space-y-2.5">
              <Button
                className="w-full gap-2"
                onClick={() => router.push('/sign-in')}
              >
                {role === 'maintainer' ? (
                  <>
                    <Building2 className="h-4 w-4" />
                    Continue to sign in
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    Continue to sign in
                  </>
                )}
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/projects">Browse projects first</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
