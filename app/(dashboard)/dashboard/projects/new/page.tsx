'use client';
import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, FolderKanban, Star, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/design-system/page-header';
import { cn, slugify } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useProjectSubmissions } from '@/lib/store/project-submissions-store';
import { useAuthStore } from '@/lib/store/auth-store';

// ── Types ─────────────────────────────────────────────────────────────────────
const CATEGORIES = ['DeFi', 'NFT', 'Gaming', 'Infrastructure', 'Tooling', 'Social', 'DAO', 'Analytics', 'Bridge'];
const TECH_STACK = ['Rust', 'TypeScript', 'React', 'CosmWasm', 'Next.js', 'GraphQL', 'Solidity', 'AssemblyScript', 'Python', 'Go', 'Tailwind CSS', 'Node.js'];
const DIFFICULTY_OPTIONS = ['beginner-friendly', 'intermediate', 'advanced'] as const;
const MOCK_REPOS = [
  { name: 'seiswap-dex', fullName: 'seiswap-labs/seiswap-dex', stars: 1243, language: 'TypeScript', visibility: 'public' },
  { name: 'seiswap-sdk', fullName: 'seiswap-labs/seiswap-sdk', stars: 348, language: 'TypeScript', visibility: 'public' },
  { name: 'seiswap-subgraph', fullName: 'seiswap-labs/seiswap-subgraph', stars: 89, language: 'AssemblyScript', visibility: 'public' },
];

interface WizardState {
  // Step 1
  name: string;
  slug: string;
  description: string;
  categories: string[];
  techStack: string[];
  // Step 2
  repoFullName: string;
  manualRepoUrl: string;
  // Step 3
  guidelines: string;
  welcomeMessage: string;
  difficulty: string;
  bountyEnabled: boolean;
  requiredSkills: string;
}

type WizardAction =
  | { type: 'SET_FIELD'; field: keyof WizardState; value: WizardState[keyof WizardState] }
  | { type: 'TOGGLE_CATEGORY'; category: string }
  | { type: 'TOGGLE_TECH'; tech: string }
  | { type: 'SET_NAME'; name: string };

function reducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.name, slug: slugify(action.name) };
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        categories: state.categories.includes(action.category)
          ? state.categories.filter((c) => c !== action.category)
          : [...state.categories, action.category],
      };
    case 'TOGGLE_TECH':
      return {
        ...state,
        techStack: state.techStack.includes(action.tech)
          ? state.techStack.filter((t) => t !== action.tech)
          : [...state.techStack, action.tech],
      };
    default:
      return state;
  }
}

const INITIAL_STATE: WizardState = {
  name: '', slug: '', description: '', categories: [], techStack: [],
  repoFullName: '', manualRepoUrl: '',
  guidelines: '', welcomeMessage: '', difficulty: 'intermediate', bountyEnabled: false, requiredSkills: '',
};

const STEPS = ['Project Info', 'GitHub Repo', 'Contribution Settings', 'Review', 'Published'];

// ── Component ─────────────────────────────────────────────────────────────────
export default function NewProjectPage() {
  const [step, setStep] = React.useState(0);
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE);
  const [publishing, setPublishing] = React.useState(false);
  const [repoSearch, setRepoSearch] = React.useState('');
  const addSubmission = useProjectSubmissions((s) => s.addSubmission);
  const user = useAuthStore((s) => s.user);

  const filteredRepos = MOCK_REPOS.filter((r) =>
    r.fullName.toLowerCase().includes(repoSearch.toLowerCase())
  );

  const canProceed = (): boolean => {
    if (step === 0) return state.name.trim().length >= 2 && state.description.trim().length >= 10;
    if (step === 1) return !!(state.repoFullName || state.manualRepoUrl.trim());
    if (step === 2) return state.guidelines.trim().length >= 10;
    return true;
  };

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 1000));
    addSubmission({
      name: state.name,
      slug: state.slug || slugify(state.name),
      org: user?.name ?? '—',
      submittedBy: user?.githubUsername ?? 'you',
      description: state.description,
      tags: [...state.categories, ...state.techStack],
      tech: state.techStack,
      repoUrl: state.manualRepoUrl || undefined,
    });
    setPublishing(false);
    toast({
      variant: 'success',
      title: 'Project submitted for review!',
      description: `"${state.name}" is awaiting admin approval before it goes live.`,
    });
    setStep(4);
  };

  const handleNext = () => {
    if (step === 3) {
      handlePublish();
    } else {
      setStep((s) => s + 1);
    }
  };

  const selectedRepo = MOCK_REPOS.find((r) => r.fullName === state.repoFullName);

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Create Project"
        description="List your project to attract contributors from the Sei ecosystem."
        breadcrumb={
          <>
            <Link href="/dashboard/projects" className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Projects
            </Link>
          </>
        }
      />

      {/* Stepper */}
      <div className="flex items-center mt-6 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
                i < step ? 'bg-primary text-primary-foreground'
                  : i === step ? 'bg-primary/15 text-primary ring-2 ring-primary/30'
                  : 'bg-muted text-muted-foreground'
              )}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn('text-[10px] font-medium whitespace-nowrap', i === step ? 'text-primary' : 'text-muted-foreground')}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('flex-1 h-px mx-2 mb-4 transition-colors', i < step ? 'bg-primary' : 'bg-border')} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step panels */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">

        {/* Step 1: Project Information */}
        {step === 0 && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="proj-name">Project name <span className="text-destructive">*</span></Label>
              <Input
                id="proj-name"
                placeholder="My Sei Project"
                value={state.name}
                onChange={(e) => dispatch({ type: 'SET_NAME', name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proj-slug">URL slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">/projects/</span>
                <Input
                  id="proj-slug"
                  value={state.slug}
                  onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'slug', value: e.target.value })}
                  className="flex-1 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proj-desc">Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="proj-desc"
                placeholder="Describe what your project does and why contributors should care…"
                value={state.description}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'description', value: e.target.value })}
                className="resize-none h-24"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => dispatch({ type: 'TOGGLE_CATEGORY', category: cat })}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-medium border transition-all',
                      state.categories.includes(cat)
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => dispatch({ type: 'TOGGLE_TECH', tech })}
                    className={cn(
                      'px-3 py-1 rounded-lg text-xs font-medium border transition-all',
                      state.techStack.includes(tech)
                        ? 'bg-primary/15 text-primary border-primary/30'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 2: GitHub Repository */}
        {step === 1 && (
          <>
            <div className="space-y-1.5">
              <Label>Search connected repositories</Label>
              <Input
                placeholder="Search by name…"
                value={repoSearch}
                onChange={(e) => setRepoSearch(e.target.value)}
                startIcon={<FolderKanban />}
              />
            </div>

            <div className="space-y-2">
              {filteredRepos.map((repo) => (
                <button
                  key={repo.fullName}
                  type="button"
                  onClick={() => dispatch({ type: 'SET_FIELD', field: 'repoFullName', value: repo.fullName })}
                  className={cn(
                    'w-full text-left rounded-lg border p-4 transition-all',
                    state.repoFullName === repo.fullName
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/40'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{repo.fullName}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="h-3 w-3" />{repo.stars}</span>
                        <Badge variant="muted" className="text-[10px] px-1.5">{repo.language}</Badge>
                        <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" />{repo.visibility}</span>
                      </div>
                    </div>
                    {state.repoFullName === repo.fullName && (
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Or enter a URL manually</p>
              <Input
                placeholder="https://github.com/org/repo"
                value={state.manualRepoUrl}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'manualRepoUrl', value: e.target.value })}
                className="text-sm"
                disabled={!!state.repoFullName}
              />
            </div>
          </>
        )}

        {/* Step 3: Contribution Settings */}
        {step === 2 && (
          <>
            <div className="space-y-1.5">
              <Label htmlFor="guidelines">Contribution Guidelines <span className="text-destructive">*</span></Label>
              <Textarea
                id="guidelines"
                placeholder="Describe how contributors should get started, coding standards, PR process…"
                value={state.guidelines}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'guidelines', value: e.target.value })}
                className="resize-none h-28"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="welcome-msg">Welcome Message for First-Time Contributors</Label>
              <Textarea
                id="welcome-msg"
                placeholder="Welcome to the project! Start by reading the README and joining our Discord…"
                value={state.welcomeMessage}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'welcomeMessage', value: e.target.value })}
                className="resize-none h-20"
              />
            </div>

            <div className="space-y-2">
              <Label>Preferred Difficulty</Label>
              <div className="grid grid-cols-3 gap-2">
                {DIFFICULTY_OPTIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_FIELD', field: 'difficulty', value: d })}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      state.difficulty === d ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/40'
                    )}
                  >
                    <span className={cn(
                      'text-xs font-semibold',
                      d === 'beginner-friendly' ? 'text-green-400' : d === 'intermediate' ? 'text-yellow-400' : 'text-red-400'
                    )}>
                      {d === 'beginner-friendly' ? 'Beginner' : d === 'intermediate' ? 'Intermediate' : 'Advanced'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">Enable Bounty Support</p>
                <p className="text-xs text-muted-foreground mt-0.5">Allow posting paid opportunities with SEI token rewards</p>
              </div>
              <button
                type="button"
                onClick={() => dispatch({ type: 'SET_FIELD', field: 'bountyEnabled', value: !state.bountyEnabled })}
                className={cn(
                  'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
                  state.bountyEnabled ? 'bg-primary' : 'bg-muted'
                )}
              >
                <span className={cn('inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform shadow-sm', state.bountyEnabled ? 'translate-x-5' : 'translate-x-1')} />
              </button>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="req-skills">Required Skills</Label>
              <Input
                id="req-skills"
                placeholder="e.g. Rust, CosmWasm, React"
                value={state.requiredSkills}
                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'requiredSkills', value: e.target.value })}
              />
              <p className="text-[10px] text-muted-foreground">Comma separated</p>
            </div>
          </>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/40 p-4 space-y-3 divide-y divide-border/50">
              <div className="flex items-start justify-between pb-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Project Information</p>
                  <p className="text-sm font-semibold text-foreground">{state.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">/projects/{state.slug}</p>
                  <p className="text-xs text-muted-foreground mt-1">{state.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {state.categories.map((c) => <Badge key={c} variant="muted" className="text-[10px]">{c}</Badge>)}
                    {state.techStack.map((t) => <Badge key={t} variant="info" className="text-[10px]">{t}</Badge>)}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7 shrink-0" onClick={() => setStep(0)}>Edit</Button>
              </div>

              <div className="flex items-start justify-between py-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Repository</p>
                  <p className="text-sm text-foreground font-medium">{state.repoFullName || state.manualRepoUrl || '—'}</p>
                  {selectedRepo && (
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedRepo.language} · {selectedRepo.stars} stars</p>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7 shrink-0" onClick={() => setStep(1)}>Edit</Button>
              </div>

              <div className="flex items-start justify-between pt-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Contribution Settings</p>
                  <p className="text-xs text-muted-foreground">Difficulty: {state.difficulty}</p>
                  <p className="text-xs text-muted-foreground">Bounty: {state.bountyEnabled ? 'Enabled' : 'Disabled'}</p>
                  {state.requiredSkills && (
                    <p className="text-xs text-muted-foreground">Skills: {state.requiredSkills}</p>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7 shrink-0" onClick={() => setStep(2)}>Edit</Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Published */}
        {step === 4 && (
          <div className="text-center py-6 space-y-4">
            <div className="relative mx-auto w-fit">
              <div className="h-16 w-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Project Submitted!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium text-foreground">{state.name}</span> is awaiting admin review before it goes live.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/projects">View my projects</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/dashboard/issues">
                  Create First Issue
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      {step < 4 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Back
          </Button>
          <Button
            size="sm"
            onClick={handleNext}
            disabled={!canProceed() || publishing}
          >
            {publishing ? (
              <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />
            ) : null}
            {step === 3 ? (publishing ? 'Publishing…' : 'Publish Project') : 'Next'}
            {!publishing && step < 3 && <ArrowRight className="h-3.5 w-3.5 ml-1.5" />}
          </Button>
        </div>
      )}
    </div>
  );
}
