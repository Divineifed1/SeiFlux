'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Globe, Info } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .max(40)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  description: z.string().max(300).optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  githubOrg: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateOrganizationDialogProps {
  children: React.ReactNode;
  onSuccess?: (data: FormValues) => void;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function CreateOrganizationDialog({
  children,
  onSuccess,
}: CreateOrganizationDialogProps) {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const nameValue = watch('name', '');

  // Auto-generate slug from name
  React.useEffect(() => {
    if (nameValue) {
      setValue('slug', slugify(nameValue), { shouldValidate: false });
    }
  }, [nameValue, setValue]);

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    toast({
      variant: 'success',
      title: 'Organization created',
      description: `${data.name} has been created and is pending admin review.`,
    });
    onSuccess?.(data);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base">Create organization</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Organizations group your projects and connect to GitHub.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="org-name">
              Organization name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="org-name"
              placeholder="SeiSwap Labs"
              {...register('name')}
              className={cn(errors.name && 'border-destructive focus-visible:ring-destructive')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="org-slug">
              URL slug <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                seibuilders.io/orgs/
              </span>
              <Input
                id="org-slug"
                placeholder="seiswap-labs"
                {...register('slug')}
                className={cn(
                  'flex-1',
                  errors.slug && 'border-destructive focus-visible:ring-destructive'
                )}
              />
            </div>
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="org-desc">Description</Label>
            <Textarea
              id="org-desc"
              placeholder="Briefly describe what your organization builds on Sei..."
              {...register('description')}
              className="resize-none h-20"
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <Label htmlFor="org-website">Website</Label>
            <Input
              id="org-website"
              type="url"
              placeholder="https://yourproject.com"
              startIcon={<Globe />}
              {...register('website')}
              className={cn(errors.website && 'border-destructive focus-visible:ring-destructive')}
            />
            {errors.website && (
              <p className="text-xs text-destructive">{errors.website.message}</p>
            )}
          </div>

          {/* GitHub Org */}
          <div className="space-y-1.5">
            <Label htmlFor="org-github">GitHub Organization</Label>
            <Input
              id="org-github"
              placeholder="your-github-org"
              startIcon={<GithubIcon />}
              {...register('githubOrg')}
            />
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              Connect later in GitHub settings if you don&apos;t have one yet.
            </p>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setOpen(false); reset(); }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create organization'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
