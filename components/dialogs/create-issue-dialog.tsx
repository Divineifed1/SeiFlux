'use client';
import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(140),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  type: z.enum(['bug', 'feature', 'documentation', 'design', 'other']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  skills: z.string().min(1, 'Add at least one skill'),
});

type FormValues = z.infer<typeof schema>;

interface CreateIssueDialogProps {
  projectName?: string;
  children: React.ReactNode;
  onSuccess?: (data: FormValues) => void;
}

const TYPE_OPTIONS = [
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Fix' },
  { value: 'documentation', label: 'Documentation' },
  { value: 'design', label: 'Design' },
  { value: 'other', label: 'Other' },
];

const DIFFICULTY_CONFIG = {
  beginner: { label: 'Beginner', description: 'Good for first-time contributors', color: 'text-green-400' },
  intermediate: { label: 'Intermediate', description: 'Requires some project knowledge', color: 'text-yellow-400' },
  advanced: { label: 'Advanced', description: 'Deep domain expertise needed', color: 'text-red-400' },
};

export function CreateIssueDialog({
  projectName,
  children,
  onSuccess,
}: CreateIssueDialogProps) {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'feature', difficulty: 'intermediate' },
  });

  const difficulty = watch('difficulty');

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    toast({
      variant: 'success',
      title: 'Issue published',
      description: `"${data.title}" is now live and open for applications.`,
    });
    onSuccess?.(data);
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base">Create issue</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {projectName
                  ? `Post a contribution issue for ${projectName}.`
                  : 'Post a new contribution issue for your project.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Type */}
          <div className="space-y-1.5">
            <Label>
              Type <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="issue-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="issue-title"
              placeholder="Implement price impact warnings in swap UI"
              {...register('title')}
              className={cn(errors.title && 'border-destructive')}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="issue-desc">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="issue-desc"
              placeholder="Describe the task in detail — what needs to be done, acceptance criteria, and any relevant context..."
              {...register('description')}
              className={cn('resize-none h-28', errors.description && 'border-destructive')}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Difficulty */}
          <div className="space-y-1.5">
            <Label>
              Difficulty <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(DIFFICULTY_CONFIG) as [
                    'beginner' | 'intermediate' | 'advanced',
                    typeof DIFFICULTY_CONFIG['beginner']
                  ][]).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => field.onChange(key)}
                      className={cn(
                        'flex flex-col items-start p-3 rounded-lg border text-left transition-all',
                        field.value === key
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:bg-accent'
                      )}
                    >
                      <span className={cn('text-xs font-semibold', config.color)}>
                        {config.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                        {config.description}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Required skills */}
          <div className="space-y-1.5">
            <Label htmlFor="issue-skills">
              Required skills <span className="text-destructive">*</span>
            </Label>
            <Input
              id="issue-skills"
              placeholder="e.g. React, TypeScript, Rust"
              {...register('skills')}
              className={cn(errors.skills && 'border-destructive')}
            />
            <p className="text-[10px] text-muted-foreground">Comma separated</p>
            {errors.skills && (
              <p className="text-xs text-destructive">{errors.skills.message}</p>
            )}
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
              {isSubmitting ? 'Publishing…' : 'Publish issue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
