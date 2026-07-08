'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const schema = z.object({
  coverNote: z
    .string()
    .min(30, 'Please write at least 30 characters')
    .max(800, 'Keep it under 800 characters'),
});

type FormValues = z.infer<typeof schema>;

interface ApplyDialogProps {
  children: React.ReactNode;
  issueTitle: string;
  projectName: string;
  skills?: string[];
}

export function ApplyDialog({
  children,
  issueTitle,
  projectName,
  skills = [],
}: ApplyDialogProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const coverNote = watch('coverNote', '');
  const charCount = coverNote?.length ?? 0;

  function handleTriggerClick() {
    if (!isAuthenticated) {
      router.push('/sign-in?from=/projects');
      return;
    }
    setOpen(true);
  }

  const onSubmit = async (_data: FormValues) => {
    await new Promise((r) => setTimeout(r, 700));
    toast({
      variant: 'success',
      title: 'Application submitted!',
      description: `Your application for "${issueTitle}" has been sent to ${projectName}.`,
    });
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handleTriggerClick}>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base">Apply to contribute</DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                {projectName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Issue info */}
        <div className="rounded-lg bg-muted/40 border border-border/50 p-3 mb-2">
          <p className="text-xs font-medium text-muted-foreground mb-1">Issue</p>
          <p className="text-sm font-semibold text-foreground">{issueTitle}</p>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="muted" className="text-[10px]">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="cover-note">
                Cover note <span className="text-destructive">*</span>
              </Label>
              <span
                className={cn(
                  'text-[10px] tabular-nums',
                  charCount > 750 ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                {charCount}/800
              </span>
            </div>
            <Textarea
              id="cover-note"
              placeholder="Tell the maintainer why you're the right person for this. Include relevant experience, links to past work, and how you plan to approach it..."
              {...register('coverNote')}
              className={cn(
                'resize-none h-36',
                errors.coverNote && 'border-destructive focus-visible:ring-destructive'
              )}
            />
            {errors.coverNote && (
              <p className="text-xs text-destructive">{errors.coverNote.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => { setOpen(false); reset(); }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5" />
              )}
              {isSubmitting ? 'Sending…' : 'Submit application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
