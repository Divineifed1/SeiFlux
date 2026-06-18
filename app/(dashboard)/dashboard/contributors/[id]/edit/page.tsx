'use client';
import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, Save, Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader } from '@/components/design-system/page-header';
import { SectionHeader } from '@/components/design-system/section-header';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const SUGGESTED_SKILLS = [
  'Rust', 'TypeScript', 'CosmWasm', 'React', 'Go', 'Solidity',
  'Next.js', 'Python', 'Move', 'Vyper', 'GraphQL', 'Node.js',
];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  handle: z.string().min(2).max(40).regex(/^[a-z0-9_-]+$/, 'Lowercase letters, numbers, hyphens, underscores only'),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github: z.string().max(39).optional(),
  twitter: z.string().max(50).optional(),
  discord: z.string().max(60).optional(),
});

type FormValues = z.infer<typeof schema>;

const DEFAULT = {
  name: 'Alex Chen',
  handle: 'alexc_dev',
  bio: 'Full-stack developer specializing in Rust and TypeScript. Building in Web3 for 3 years. Passionate about DeFi protocols and smart contract security.',
  location: 'San Francisco, CA',
  website: 'https://alexchen.dev',
  github: 'alexc_dev',
  twitter: 'alexc_dev',
  discord: 'alexc_dev#1234',
};

export default function ContributorEditPage() {
  const params = useParams<{ id: string }>();
  const [skills, setSkills] = React.useState(['Rust', 'TypeScript', 'React', 'CosmWasm', 'Solidity', 'Go']);
  const [skillInput, setSkillInput] = React.useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT,
  });

  const name = watch('name') || DEFAULT.name;

  const addSkill = (skill: string) => {
    const s = skill.trim();
    if (s && !skills.includes(s)) setSkills((prev) => [...prev, s]);
    setSkillInput('');
  };

  const removeSkill = (skill: string) => setSkills((prev) => prev.filter((s) => s !== skill));

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 700));
    toast({
      variant: 'success',
      title: 'Profile updated',
      description: `${data.name}'s profile has been saved successfully.`,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Edit Profile"
        description="Update your contributor profile and public information."
        breadcrumb={
          <>
            <Link href="/dashboard/contributors" className="hover:text-foreground flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              Contributors
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/dashboard/contributors/${params.id}`} className="hover:text-foreground">
              {DEFAULT.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Edit</span>
          </>
        }
      />

      {/* Avatar preview */}
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionHeader title="Avatar" description="Your avatar is generated from your initials." className="mb-5" />
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
              {name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">@{watch('handle') || DEFAULT.handle}</p>
            <p className="text-xs text-muted-foreground mt-2">Connect GitHub to use your GitHub avatar.</p>
          </div>
        </div>
      </section>

      {/* Basic info */}
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionHeader title="Basic Information" description="Your public profile details." className="mb-5" />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Display Name <span className="text-destructive">*</span></Label>
              <Input id="name" {...register('name')} className={cn(errors.name && 'border-destructive')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="handle">Username <span className="text-destructive">*</span></Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground shrink-0">@</span>
                <Input
                  id="handle"
                  {...register('handle')}
                  className={cn('flex-1', errors.handle && 'border-destructive')}
                />
              </div>
              {errors.handle && <p className="text-xs text-destructive">{errors.handle.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="Tell us about yourself and your experience in the Sei ecosystem…"
              className="resize-none h-24"
            />
            <p className="text-[10px] text-muted-foreground">Max 500 characters</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="City, Country" {...register('location')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yoursite.com"
                {...register('website')}
                className={cn(errors.website && 'border-destructive')}
              />
              {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </section>

      {/* Skills */}
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionHeader
          title="Skills & Technologies"
          description="Add the technologies you work with. These help maintainers find you for relevant opportunities."
          className="mb-5"
        />

        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="h-3.5 w-3.5 rounded-full hover:bg-primary/20 flex items-center justify-center transition-colors"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
            placeholder="Add a skill and press Enter…"
            className="flex-1 h-8 text-sm"
          />
          <Button type="button" size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => addSkill(skillInput)}>
            <Plus className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>

        <div>
          <p className="text-[11px] text-muted-foreground mb-2 font-medium">Suggested:</p>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSkill(s)}
                className="px-2 py-0.5 rounded-full text-[11px] border border-border text-muted-foreground hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Social / GitHub */}
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionHeader title="Connected Accounts" description="Link your GitHub and social accounts." className="mb-5" />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="github">GitHub Username</Label>
            <Input
              id="github"
              placeholder="your-github-username"
              startIcon={<GithubIcon />}
              {...register('github')}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="twitter">Twitter / X</Label>
            <Input
              id="twitter"
              placeholder="@yourhandle"
              startIcon={<span className="text-xs font-bold">𝕏</span>}
              {...register('twitter')}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="discord">Discord</Label>
            <Input
              id="discord"
              placeholder="username#0000"
              {...register('discord')}
            />
          </div>
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => toast({ variant: 'success', title: 'Connected accounts saved' })}
            >
              <Save className="h-3.5 w-3.5" />
              Save accounts
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
