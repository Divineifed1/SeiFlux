import type { Metadata } from 'next';
import {
  Building2,
  GitBranch,
  Users,
  Shield,
  BarChart3,
  FolderGit2,
  Search,
  Bell,
  FileText,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Features' };

const FEATURE_SECTIONS = [
  {
    tag: 'For Maintainers',
    tagVariant: 'success' as const,
    title: 'Everything to manage your open-source project',
    description:
      'Tools built for project maintainers who want to grow their contributor community on Sei.',
    features: [
      {
        icon: Building2,
        title: 'Organization onboarding',
        description:
          'Create your organization profile, add a description, logo, and website. Connect multiple repositories under one umbrella.',
      },
      {
        icon: FolderGit2,
        title: 'GitHub sync',
        description:
          'Connect your GitHub organization and automatically import repositories, stars, forks, and open issues.',
      },
      {
        icon: GitBranch,
        title: 'Opportunity publishing',
        description:
          'Post contribution opportunities with skill requirements, difficulty levels, and context. Keep your backlog organized.',
      },
      {
        icon: Users,
        title: 'Contributor management',
        description:
          'Review applications, approve contributors, and track who is working on what across all your projects.',
      },
    ],
  },
  {
    tag: 'For Contributors',
    tagVariant: 'info' as const,
    title: 'Discover and contribute to impactful Sei projects',
    description:
      'A curated directory of quality projects with open contribution slots, making it easy to get started.',
    features: [
      {
        icon: Search,
        title: 'Project discovery',
        description:
          'Browse projects by tech stack, category, or difficulty level. Filter to find the perfect match for your skills.',
      },
      {
        icon: FileText,
        title: 'Application tracking',
        description:
          'Keep track of all your applications in one place. See status updates and communicate with maintainers.',
      },
      {
        icon: Bell,
        title: 'Smart notifications',
        description:
          'Get notified when new opportunities match your skills, when applications are reviewed, or when maintainers message you.',
      },
      {
        icon: BarChart3,
        title: 'Contribution history',
        description:
          'Build your on-platform reputation with a public contribution history that showcases your impact.',
      },
    ],
  },
  {
    tag: 'For Admins',
    tagVariant: 'default' as const,
    title: 'Platform-wide visibility and control',
    description:
      'Admin tools give full visibility into the platform, with controls to maintain quality.',
    features: [
      {
        icon: Shield,
        title: 'Project moderation',
        description:
          'Review and approve or reject project listings before they appear publicly. Ensure quality standards are met.',
      },
      {
        icon: BarChart3,
        title: 'Platform analytics',
        description:
          'View platform-wide statistics: total projects, organizations, contributor counts, and application rates.',
      },
      {
        icon: Users,
        title: 'User management',
        description:
          'Manage user accounts, assign roles, and handle disputes between maintainers and contributors.',
      },
      {
        icon: Zap,
        title: 'Ecosystem health',
        description:
          'Monitor ecosystem growth metrics and identify which projects are driving the most contribution activity.',
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center mb-20">
        <Badge variant="outline" className="mb-4 text-xs">
          Platform Features
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
          Built for the entire
          <br />
          <span className="text-gradient-sei">Sei builder lifecycle</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          SeiFlux provides purpose-built tools for maintainers, contributors,
          and platform administrators.
        </p>
      </div>

      {/* Feature sections */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-24">
        {FEATURE_SECTIONS.map((section) => (
          <div key={section.tag}>
            <div className="mb-10">
              <Badge variant={section.tagVariant} className="mb-3">
                {section.tag}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
                {section.title}
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl">{section.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {section.features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="rounded-xl border border-border bg-card p-5 transition-all hover:border-border/80"
                  >
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-24">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-2">What each role can do</h2>
          <p className="text-sm text-muted-foreground">
            A clear breakdown of permissions across user types.
          </p>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">Capability</th>
                {['Admin', 'Maintainer', 'Contributor'].map((role) => (
                  <th key={role} className="text-center px-4 py-3 font-medium text-muted-foreground">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { cap: 'Browse projects & opportunities', admin: true, maintainer: true, contributor: true },
                { cap: 'Create organization', admin: true, maintainer: true, contributor: false },
                { cap: 'Publish projects', admin: true, maintainer: true, contributor: false },
                { cap: 'Apply to contribute', admin: false, maintainer: false, contributor: true },
                { cap: 'Review applications', admin: true, maintainer: true, contributor: false },
                { cap: 'Moderate listings', admin: true, maintainer: false, contributor: false },
                { cap: 'View platform analytics', admin: true, maintainer: false, contributor: false },
                { cap: 'Manage all users', admin: true, maintainer: false, contributor: false },
              ].map((row) => (
                <tr key={row.cap} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3 text-foreground">{row.cap}</td>
                  {(['admin', 'maintainer', 'contributor'] as const).map((role) => (
                    <td key={role} className="px-4 py-3 text-center">
                      {row[role] ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground/30">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
