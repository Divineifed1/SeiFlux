'use client';
import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FolderKanban, Globe, Info } from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const MOCK_ORGS = [
  { id: '1', name: 'SeiSwap Labs' },
  { id: '2', name: 'SeiFinance' },
  { id: '3', name: 'SeiGames' },
];

const TECH_OPTIONS = [
  'Rust', 'TypeScript', 'Solidity', 'Python', 'Go', 'React', 'Next.js',
  'CosmWasm', 'Move', 'Cairo', 'Anchor', 'Hardhat', 'Foundry',
  'Web3.js', 'ethers.js', 'viem', 'wagmi',
];

const CATEGORY_OPTIONS = [
  'DeFi', 'NFT', 'Gaming', 'Infrastructure', 'Tooling', 'Bridge',
  'Oracle', 'Wallet', 'Analytics', 'Indexer',
];

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  organizationId: z.string().min(1, 'Select an organization'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(500),
  repoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  websiteUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).min(1, 'Select at least one category'),
  techStack: z.array(z.string()).min(1, 'Select at least one technology'),
});

type FormValues = z.infer<typeof schema>;

interface CreateProjectDialogProps {
  children: React.ReactNode;
  onSuccess?: (data: FormValues) => void;
}

export function CreateProjectDialog({ children, onSuccess }: CreateProjectDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [selectedTech, setSelectedTech] = React.useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { tags: [], techStack: [] },
  });

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(next);
    setValue('tags', next, { shouldValidate: true });
  };

  const toggleTech = (tech: string) => {
    const next = selectedTech.includes(tech)
      ? selectedTech.filter((t) => t !== tech)
      : [...selectedTech, tech];
    setSelectedTech(next);
    setValue('techStack', next, { shouldValidate: true });
  };

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    toast({
      variant: 'success',
      title: 'Project submitted for review',
      description: `"${data.title}" has been submitted. Admins will review it within 1–2 business days.`,
    });
    onSuccess?.(data);
    setOpen(false);
    reset();
    setSelectedTags([]);
    setSelectedTech([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <FolderKanban className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base">Create project listing</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                List your project to attract contributors from the Sei community.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Organization */}
          <div className="space-y-1.5">
            <Label>
              Organization <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="organizationId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className={cn(errors.organizationId && 'border-destructive')}>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ORGS.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.organizationId && (
              <p className="text-xs text-destructive">{errors.organizationId.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="project-title">
              Project title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="project-title"
              placeholder="SeiSwap DEX v2"
              {...register('title')}
              className={cn(errors.title && 'border-destructive')}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="project-desc">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="project-desc"
              placeholder="Describe your project, what it does, and why contributors should join..."
              {...register('description')}
              className={cn('resize-none h-24', errors.description && 'border-destructive')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Repo URL */}
          <div className="space-y-1.5">
            <Label htmlFor="project-repo">GitHub Repository</Label>
            <Input
              id="project-repo"
              type="url"
              placeholder="https://github.com/org/repo"
              startIcon={<GithubIcon />}
              {...register('repoUrl')}
              className={cn(errors.repoUrl && 'border-destructive')}
            />
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <Label htmlFor="project-website">Project Website</Label>
            <Input
              id="project-website"
              type="url"
              placeholder="https://yourproject.com"
              startIcon={<Globe />}
              {...register('websiteUrl')}
            />
          </div>

          {/* Category tags */}
          <div className="space-y-1.5">
            <Label>
              Categories <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-md border border-input bg-transparent">
              {CATEGORY_OPTIONS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'px-2.5 py-0.5 rounded text-xs font-medium transition-all',
                    selectedTags.includes(tag)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
            {errors.tags && (
              <p className="text-xs text-destructive">{errors.tags.message}</p>
            )}
          </div>

          {/* Tech stack */}
          <div className="space-y-1.5">
            <Label>
              Tech stack <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-1.5 p-3 rounded-md border border-input bg-transparent">
              {TECH_OPTIONS.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={cn(
                    'px-2.5 py-0.5 rounded text-xs font-medium transition-all',
                    selectedTech.includes(tech)
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
            {errors.techStack && (
              <p className="text-xs text-destructive">{errors.techStack.message}</p>
            )}
          </div>

          <div className="rounded-lg bg-muted/50 border border-border p-3 flex items-start gap-2">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Your project will be reviewed by platform admins before it&apos;s publicly
              listed. This typically takes 1–2 business days.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setOpen(false); reset(); setSelectedTags([]); setSelectedTech([]); }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit for review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
