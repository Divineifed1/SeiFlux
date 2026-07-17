'use client';
import Link from 'next/link';
import * as React from 'react';
import {
  ArrowRight,
  Zap,
  FolderGit2,
  Building2,
  Users,
  GitBranch,
  Shield,
  BarChart3,
  Star,
  GitFork,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { useProjects } from '@/lib/hooks';

interface Metric {
  value: string;
  label: string;
}

async function fetchMetrics(): Promise<Metric[]> {
  try {
    const res = await fetch('/api/metrics', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch metrics');
    const data = await res.json();
    return data.metrics;
  } catch {
    return [];
  }
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [metrics, setMetrics] = React.useState<Metric[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchMetrics()
      .then(setMetrics)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-grid opacity-100" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/4 blur-[100px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <Badge variant="outline" className="mb-6 text-xs px-3 py-1 border-border/60 bg-card/40">
          <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2 inline-block" />
          Built for the Sei Ecosystem
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
          Where <span className="text-gradient-sei">Sei builders</span>
          <br />find their contributors
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          SeiFlux is the platform where maintainers onboard their projects and talented
          developers discover meaningful contribution opportunities across the Sei blockchain ecosystem.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="xl" asChild>
            <Link href="/sign-up">
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="xl" variant="outline" asChild>
            <Link href="/projects">Browse projects</Link>
          </Button>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            metrics.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="font-bold text-foreground">{stat.value}</span>
                <span>{stat.label}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Building2, title: 'Organization Management', description: 'Connect your GitHub organization, manage repositories, and showcase your project to the Sei community.' },
  { icon: GitBranch, title: 'Contribution Opportunities', description: 'Post bounties, feature requests, and open issues with skill requirements and difficulty levels.' },
  { icon: Users, title: 'Contributor Discovery', description: 'Find and recruit skilled developers from the Sei ecosystem with verified GitHub profiles.' },
  { icon: Shield, title: 'Moderated Listings', description: 'Every project is reviewed by platform admins to ensure quality and community standards.' },
  { icon: BarChart3, title: 'Activity Analytics', description: 'Track applications, contributor engagement, and project growth with built-in analytics.' },
  { icon: FolderGit2, title: 'GitHub Integration', description: 'Seamlessly sync repositories, issues, and pull requests directly from your GitHub organization.' },
];

function Features() {
  return (
    <section className="py-24 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Platform Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
            Everything you need to build
            <br /><span className="text-muted-foreground font-normal">and grow your project</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-border/80 hover:bg-card/80">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Sample Projects ────────────────────────────────────────────────────────────
function ProjectShowcase() {
  const { data: projects, isLoading } = useProjects();

  return (
    <section className="py-24 border-t border-border/50 bg-card/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Live Projects</p>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Explore the ecosystem</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/projects">View all projects <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ))
          ) : projects && projects.length > 0 ? (
            projects.slice(0, 3).map((project) => (
              <div key={project.id} className="rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-border/80 hover:shadow-card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{project.name}</h3>
                    <p className="text-xs text-muted-foreground">{project.organizationId}</p>
                  </div>
                  <Badge variant="success" className="shrink-0 text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 mr-1" />
                    {project.openIssues ?? 0} open
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(project.tags ?? []).map((tag) => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3" />{(project.stars ?? 0).toLocaleString()}</span>
                  <span className="flex items-center gap-1"><GitFork className="h-3 w-3" />{project.forks ?? 0}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground col-span-full">No projects available yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-24 border-t border-border/50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <div className="relative rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-card p-12 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              {[0,1,2].map((i) => <CheckCircle2 key={i} className="h-4 w-4 text-primary" />)}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">Ready to build on Sei?</h2>
            <p className="text-base text-muted-foreground max-w-lg mx-auto mb-8">
              Join hundreds of projects and thousands of contributors already building the future of Sei.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="xl" asChild>
                <Link href="/sign-up">Start building now <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Root Page (no route group — includes layout inline) ───────────────────────
export default function RootPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Hero />
        <Features />
        <ProjectShowcase />
        <CTA />
      </main>
      <PublicFooter />
    </div>
  );
}
