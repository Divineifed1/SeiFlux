import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Building2, Globe, ExternalLink, Users } from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/design-system/page-header';
import { StatusBadge } from '@/components/design-system/status-badge';
import { EmptyState } from '@/components/design-system/empty-state';
import { CreateOrganizationDialog } from '@/components/dialogs/create-organization-dialog';

export const metadata: Metadata = { title: 'Organizations' };

const ORGS = [
  {
    id: '1',
    name: 'SeiSwap Labs',
    slug: 'seiswap-labs',
    description: 'Building the premier DEX and DeFi infrastructure for the Sei ecosystem.',
    githubOrg: 'seiswap-labs',
    website: 'https://seiswap.example.com',
    projectCount: 4,
    memberCount: 6,
    status: 'active' as const,
  },
  {
    id: '2',
    name: 'SeiFinance',
    slug: 'seifinance',
    description: 'Decentralized lending, borrowing, and yield optimization on Sei.',
    githubOrg: 'seifinance',
    website: 'https://seifinance.example.com',
    projectCount: 3,
    memberCount: 4,
    status: 'active' as const,
  },
  {
    id: '3',
    name: 'SeiGames',
    slug: 'seigames',
    description: "On-chain gaming experiences powered by Sei's high-throughput architecture.",
    githubOrg: null,
    website: null,
    projectCount: 1,
    memberCount: 2,
    status: 'pending' as const,
  },
];

export default function OrganizationsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Organizations"
        description="Manage your organizations and connected projects."
        actions={
          <CreateOrganizationDialog>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              New Organization
            </Button>
          </CreateOrganizationDialog>
        }
      />

      {ORGS.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No organizations yet"
          description="Create your first organization to start onboarding projects to the Sei ecosystem."
          action={{ label: 'Create organization' }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {ORGS.map((org) => (
            <div
              key={org.id}
              className="rounded-xl border border-border bg-card p-5 hover:border-border/80 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-base font-black text-primary shrink-0 border border-primary/10">
                    {org.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Link
                        href={`/dashboard/organizations/${org.id}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        {org.name}
                      </Link>
                      <StatusBadge status={org.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {org.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {org.projectCount} project{org.projectCount !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {org.memberCount} member{org.memberCount !== 1 ? 's' : ''}
                      </span>
                      {org.githubOrg && (
                        <a
                          href={`https://github.com/${org.githubOrg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                        >
                          <GithubIcon className="h-3.5 w-3.5" />
                          @{org.githubOrg}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                      {org.website && (
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                        >
                          <Globe className="h-3.5 w-3.5" />
                          Website
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!org.githubOrg && (
                    <Button variant="outline" size="sm" className="text-xs gap-1.5">
                      <GithubIcon className="h-3.5 w-3.5" />
                      Connect GitHub
                    </Button>
                  )}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/organizations/${org.id}`}>Manage</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
