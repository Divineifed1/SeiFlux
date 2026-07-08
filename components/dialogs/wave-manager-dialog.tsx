'use client';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useWaves } from '@/lib/hooks/use-waves';
import type { Wave } from '@/types';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  startsAt: z.string().min(1, 'Start date is required'),
  endsAt: z.string().min(1, 'End date is required'),
});

type FormValues = z.infer<typeof schema>;

interface WaveManagerDialogProps {
  children: React.ReactNode;
}

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'muted'> = {
  upcoming: 'warning',
  active: 'success',
  completed: 'muted',
};

export function WaveManagerDialog({ children }: WaveManagerDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [editingWave, setEditingWave] = React.useState<Wave | null>(null);
  const { data: waves = [], refetch } = useWaves();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', startsAt: '', endsAt: '' },
  });

  const isSubmittingForm = isSubmitting || formSubmitting;

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  }

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const url = editingWave ? `${apiBase}/waves/${editingWave.id}` : `${apiBase}/waves`;
      const method = editingWave ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save wave');
      }

      toast({
        variant: 'success',
        title: editingWave ? 'Wave updated' : 'Wave created',
        description: editingWave ? 'Wave dates updated successfully.' : 'New wave scheduled successfully.',
      });

      reset();
      setEditingWave(null);
      refetch();
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Failed to save wave',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(wave: Wave) {
    setEditingWave(wave);
    setValue('name', wave.name);
    setValue('startsAt', new Date(wave.startsAt).toISOString().slice(0, 16));
    setValue('endsAt', new Date(wave.endsAt).toISOString().slice(0, 16));
    setOpen(true);
  }

  function handleCreate() {
    setEditingWave(null);
    reset({ name: '', startsAt: '', endsAt: '' });
    setOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this wave? This cannot be undone.')) return;

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiBase}/waves/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete wave');
      }

      toast({ title: 'Wave deleted' });
      refetch();
    } catch (e) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Failed to delete wave',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Waves</DialogTitle>
          <DialogDescription>
            Create, edit, or delete contribution waves. Waves are 8-day contribution windows.
          </DialogDescription>
        </DialogHeader>

        {/* Wave list */}
        <div className="space-y-3 mb-4">
          {waves.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No waves created yet.</p>
          ) : (
            waves.map((wave) => (
              <div key={wave.id} className="rounded-lg border border-border bg-card p-4 hover:border-border/80 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground">{wave.name}</p>
                      <Badge variant={STATUS_VARIANT[wave.status] ?? 'muted'} className="text-[10px]">
                        {wave.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(wave.startsAt)} → {formatDate(wave.endsAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button size="sm" variant="ghost" className="text-xs h-7 px-2" onClick={() => handleEdit(wave)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 px-2 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(wave.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create/Edit form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Wave Name</Label>
            <Input id="name" placeholder="Wave #2 — August 2026" {...register('name')} className={cn(errors.name && 'border-destructive')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startsAt">Start Date & Time</Label>
              <Input id="startsAt" type="datetime-local" {...register('startsAt')} className={cn(errors.startsAt && 'border-destructive')} />
              {errors.startsAt && <p className="text-xs text-destructive">{errors.startsAt.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endsAt">End Date & Time</Label>
              <Input id="endsAt" type="datetime-local" {...register('endsAt')} className={cn(errors.endsAt && 'border-destructive')} />
              {errors.endsAt && <p className="text-xs text-destructive">{errors.endsAt.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setOpen(false); setEditingWave(null); reset(); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmittingForm}>
              {isSubmittingForm ? 'Saving...' : editingWave ? 'Update Wave' : 'Create Wave'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
