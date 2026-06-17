import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, User, ChevronRight, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const metadata: Metadata = { title: 'Select Account' };

const ACCOUNTS = [
  {
    id: '1',
    type: 'personal',
    name: 'Alex Builder',
    login: 'alexbuilder',
    avatar: '',
    email: 'alex@example.com',
  },
];

const ORGS = [
  {
    id: '1',
    name: 'SeiSwap Labs',
    login: 'seiswap-labs',
    avatar: '',
    role: 'owner',
  },
  {
    id: '2',
    name: 'SeiData',
    login: 'seidata',
    avatar: '',
    role: 'member',
  },
];

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
            to SEI Builders Hub
          </p>
        </div>

        {/* Personal account */}
        <div className="px-3 py-2">
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Personal
          </p>
          {ACCOUNTS.map((account) => (
            <Link
              key={account.id}
              href="/onboarding"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={account.avatar} />
                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                  {account.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{account.name}</p>
                <p className="text-xs text-muted-foreground">@{account.login}</p>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-muted-foreground/50" />
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        <Separator />

        {/* Organizations */}
        <div className="px-3 py-2">
          <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Organizations
          </p>
          {ORGS.map((org) => (
            <Link
              key={org.id}
              href="/onboarding"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{org.name}</p>
                <p className="text-xs text-muted-foreground">@{org.login}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="muted" className="text-[10px] px-1.5">
                  {org.role}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          ))}
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
