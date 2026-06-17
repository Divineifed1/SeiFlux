'use client';
import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  Building2,
  Globe,
  Trash2,
  AlertTriangle,
  Save,
  Users,
  ImageIcon,
  AtSign,
  MessageCircle,
  Send,
  Briefcase,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageHeader } from '@/components/design-system/page-header';
import { SectionHeader } from '@/components/design-system/section-header';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const SEI_CATEGORIES = ['DeFi', 'NFT', 'Gaming', 'Infrastructure', 'Tooling', 'Social', 'DAO', 'Analytics', 'Bridge', 'Other'];
const BRAND_COLORS = ['#6366f1', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#0ea5e9'];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  description: z.string().max(300).optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  githubOrg: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// Mock org data — replace with fetch(params.id)
const ORG = {
  id: '1',
  name: 'SeiSwap Labs',
  slug: 'seiswap-labs',
  description: 'Building the premier DEX and DeFi infrastructure for the Sei ecosystem.',
  githubOrg: 'seiswap-labs',
  website: 'https://seiswap.example.com',
};

const MEMBERS = [
  { id: '1', name: 'Alex Builder', handle: 'alexbuilder', role: 'owner' as const },
  { id: '2', name: 'Sarah Dev', handle: 'sarah_builds', role: 'admin' as const },
  { id: '3', name: 'John Coder', handle: 'john_dev', role: 'member' as const },
];

const ROLE_BADGE: Record<string, 'success' | 'info' | 'muted'> = {
  owner: 'success',
  admin: 'info',
  member: 'muted',
};

export default function OrganizationSettingsPage() {
  const params = useParams<{ id: string }>();

  const [selectedColor, setSelectedColor] = React.useState(BRAND_COLORS[0]);
  const [selectedCategory, setSelectedCategory] = React.useState('DeFi');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: ORG.name,
      slug: ORG.slug,
      description: ORG.description,
      website: ORG.website,
      githubOrg: ORG.githubOrg,
    },
  });

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 700));
    toast({
      variant: 'success',
      title: 'Settings saved',
      description: `${data.name} has been updated successfully.`,
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Organization Settings"
        description={`Configure ${ORG.name}`}
        breadcrumb={
          <>
            <Link
              href="/dashboard/organizations"
              className="hover:text-foreground flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Organizations
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/dashboard/organizations/${params.id}`}
              className="hover:text-foreground"
            >
              {ORG.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Settings</span>
          </>
        }
      />

      {/* Branding section */}
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionHeader
          title="Branding"
          description="Customize how your organization appears on the platform."
          className="mb-5"
        />
        <div className="space-y-5">
          {/* Logo upload */}
          <div className="space-y-1.5">
            <Label>Organization Logo</Label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer">
              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">Drop your logo here</p>
                <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, SVG up to 2MB · recommended 256×256px</p>
              </div>
              <Button variant="outline" size="sm" type="button">Browse files</Button>
            </div>
          </div>

          {/* Color picker */}
          <div className="space-y-1.5">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {BRAND_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'h-7 w-7 rounded-full transition-all',
                      selectedColor === color && 'ring-2 ring-offset-2 ring-offset-card ring-foreground'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 ml-2">
                <div className="h-7 w-7 rounded-md border border-border" style={{ backgroundColor: selectedColor }} />
                <Input
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-28 h-7 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* General settings */}
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionHeader
          title="General"
          description="Update your organization's public information."
          className="mb-5"
        />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="org-name">
                Organization name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="org-name"
                startIcon={<Building2 />}
                {...register('name')}
                className={cn(errors.name && 'border-destructive')}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-slug">URL slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                  /orgs/
                </span>
                <Input
                  id="org-slug"
                  {...register('slug')}
                  className={cn('flex-1', errors.slug && 'border-destructive')}
                />
              </div>
              {errors.slug && (
                <p className="text-xs text-destructive">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="org-desc">Description</Label>
            <Textarea
              id="org-desc"
              {...register('description')}
              className="resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="org-website">Website</Label>
              <Input
                id="org-website"
                type="url"
                placeholder="https://yourproject.com"
                startIcon={<Globe />}
                {...register('website')}
                className={cn(errors.website && 'border-destructive')}
              />
              {errors.website && (
                <p className="text-xs text-destructive">{errors.website.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="org-github">GitHub Organization</Label>
              <Input
                id="org-github"
                placeholder="your-github-org"
                startIcon={<GithubIcon />}
                {...register('githubOrg')}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="sm" disabled={isSubmitting || !isDirty} className="gap-1.5">
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

      {/* Social Links */}
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionHeader
          title="Social Links"
          description="Add links to your community and social channels."
          className="mb-5"
        />
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="twitter">Twitter / X</Label>
            <Input
              id="twitter"
              placeholder="https://twitter.com/yourorg"
              startIcon={<AtSign />}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="discord">Discord</Label>
            <Input
              id="discord"
              placeholder="https://discord.gg/yourserver"
              startIcon={<MessageCircle />}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="telegram">Telegram</Label>
            <Input
              id="telegram"
              placeholder="https://t.me/yourchannel"
              startIcon={<Send />}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/company/yourorg"
              startIcon={<Briefcase />}
            />
          </div>
          <div className="flex justify-end pt-1">
            <Button type="button" size="sm" variant="outline" className="gap-1.5"
              onClick={() => toast({ variant: 'success', title: 'Social links saved' })}
            >
              <Save className="h-3.5 w-3.5" />
              Save links
            </Button>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="rounded-lg border border-border bg-card p-6">
        <SectionHeader
          title="Ecosystem"
          description="Categorize your organization within the Sei ecosystem."
          className="mb-5"
        />
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Project Category</Label>
            <div className="flex flex-wrap gap-2">
              {SEI_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    selectedCategory === cat
                      ? 'bg-primary/15 text-primary border-primary/30'
                      : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <Button type="button" size="sm" variant="outline" className="gap-1.5"
              onClick={() => toast({ variant: 'success', title: 'Ecosystem settings saved', description: `Category set to ${selectedCategory}` })}
            >
              <Save className="h-3.5 w-3.5" />
              Save settings
            </Button>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-5">
          <SectionHeader
            title="Members"
            description="Manage who has access to this organization."
          />
          <Button size="sm" variant="outline" className="gap-1.5 shrink-0">
            <Users className="h-3.5 w-3.5" />
            Invite member
          </Button>
        </div>

        <div className="divide-y divide-border/50">
          {MEMBERS.map((member) => (
            <div key={member.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                  {member.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">@{member.handle}</p>
              </div>
              <Badge variant={ROLE_BADGE[member.role] ?? 'muted'} className="text-[10px]">
                {member.role}
              </Badge>
              {member.role !== 'owner' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-destructive h-7 px-2"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <SectionHeader
          title="Danger Zone"
          description="These actions are irreversible. Please proceed with caution."
          className="mb-5"
        />
        <Separator className="mb-5 border-destructive/20" />

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Transfer ownership</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Transfer this organization to another user. You will lose owner access.
              </p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0 text-xs">
              Transfer
            </Button>
          </div>

          <Separator className="border-destructive/20" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-destructive flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                Delete organization
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete this organization and all of its projects. This cannot be undone.
              </p>
            </div>
            <Button variant="destructive" size="sm" className="shrink-0 text-xs gap-1.5">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
