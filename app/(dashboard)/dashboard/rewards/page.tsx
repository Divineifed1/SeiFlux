'use client';
import * as React from 'react';
import { Trophy, Coins, Clock, CheckCircle2, Loader2, ArrowDownToLine, ShieldAlert, Wallet, Save } from 'lucide-react';
import { PageHeader } from '@/components/design-system/page-header';
import { SectionHeader } from '@/components/design-system/section-header';
import { MetricCard } from '@/components/design-system/metric-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRewards, type RewardStatus } from '@/lib/hooks/use-rewards';
import { useAuthStore } from '@/lib/store/auth-store';
import { validateSeiAddress, formatSeiAddress, seiAddressTypeLabel } from '@/lib/validation/sei-address';
import { SeiAddressInput } from '@/components/ui/sei-address-input';
import { useToast } from '@/hooks/use-toast';

const REWARD_STATUS_CONFIG: Record<
  RewardStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  paid: { label: 'Paid', className: 'bg-green-500/10 text-green-400 ring-green-500/20', icon: CheckCircle2 },
  pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20', icon: Clock },
  processing: { label: 'Processing', className: 'bg-blue-500/10 text-blue-400 ring-blue-500/20', icon: Loader2 },
};

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(d);
}

export default function RewardsPage() {
  const { totalEarned, pending, availableToClaim, rank, entries } = useRewards();
  const user = useAuthStore((s) => s.user);
  const setPayoutAddress = useAuthStore((s) => s.setPayoutAddress);
  const { toast } = useToast();

  const payout = user?.payoutAddress ?? '';
  const payoutValidation = validateSeiAddress(payout);
  const payoutValid = payoutValidation.valid;

  const [draft, setDraft] = React.useState(payout);
  const [valid, setValid] = React.useState(payoutValid);
  React.useEffect(() => {
    setDraft(payout);
    setValid(payoutValid);
  }, [payout, payoutValid]);

  const [claimed, setClaimed] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const claimable = availableToClaim > 0 && !claimed;
  const canRequest = payoutValid && claimable;

  const handleSaveAddress = () => {
    const v = validateSeiAddress(draft);
    if (!v.valid) {
      toast({ title: 'Invalid address', description: 'Enter a valid Sei native or EVM address.', variant: 'destructive' });
      return;
    }
    setPayoutAddress(v.normalized);
    toast({ variant: 'success', title: 'Wallet address saved', description: `Rewards will be sent to ${formatSeiAddress(v.normalized)}.` });
  };

  const handleConfirmRequest = () => {
    setClaimed(true);
    setConfirmOpen(false);
    toast({ variant: 'success', title: 'Reward request submitted', description: `${availableToClaim} SEI will be sent to your wallet address.` });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="My Rewards"
        description="Enter your Sei wallet address to request payout of earned rewards."
        actions={
          <Button size="sm" className="gap-1.5" disabled={!canRequest} onClick={() => setConfirmOpen(true)}>
            <ArrowDownToLine className="h-4 w-4" />
            {claimed ? 'Requested' : claimable ? `Request ${availableToClaim} SEI` : 'Rewards'}
          </Button>
        }
      />

      {/* Wallet address */}
      <Card>
        <CardContent className="p-4">
          {payoutValid ? (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <Wallet className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Wallet address</p>
                <p className="text-sm font-mono text-foreground truncate">
                  {formatSeiAddress(payout, 10, 8)}
                </p>
              </div>
              <Badge variant="success" className="text-[10px] shrink-0">
                {seiAddressTypeLabel(payoutValidation.type)}
              </Badge>
              <Button variant="outline" size="sm" asChild className="shrink-0">
                <Link href="/dashboard/settings">Change</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Wallet className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Add your Sei wallet address</p>
                  <p className="text-xs text-muted-foreground">
                    Rewards are sent to this address — accepts Sei native (sei1…) or Sei EVM (0x…).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SeiAddressInput value={draft} onChange={setDraft} onValidChange={setValid} className="flex-1" />
                <Button size="sm" className="gap-1.5 shrink-0" onClick={handleSaveAddress} disabled={!valid}>
                  <Save className="h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricCard title="Total Earned" value={totalEarned} suffix=" SEI" icon={Trophy} accent />
        <MetricCard title="Pending" value={pending} suffix=" SEI" icon={Clock} />
        <MetricCard title="Available to Request" value={claimed ? 0 : availableToClaim} suffix=" SEI" icon={Coins} />
        <MetricCard title="Rank" value={`#${rank}`} icon={Trophy} description="this wave" />
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <SectionHeader title="Reward history" description="Bounty payouts from completed contributions." className="mb-4" />

        <div className="space-y-2">
          {entries.map((entry) => {
            const status = REWARD_STATUS_CONFIG[entry.status];
            const StatusIcon = status.icon;
            return (
              <div
                key={entry.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-4 py-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Coins className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(entry.date)}
                    {entry.wave ? ` · ${entry.wave}` : ''}
                  </p>
                </div>
                <span className="text-sm font-semibold text-foreground tabular-nums shrink-0">
                  {entry.amount} SEI
                </span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset shrink-0',
                    status.className
                  )}
                >
                  <StatusIcon className={cn('h-3 w-3', entry.status === 'processing' && 'animate-spin')} />
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <Card>
        <CardContent className="p-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Trophy className="h-4 w-4 text-primary shrink-0" />
          Rewards are distributed in SEI at the end of each wave. Pending amounts become requestable once the
          maintainer confirms the merged contribution.
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4 text-primary" />
              Request {availableToClaim} SEI
            </DialogTitle>
            <DialogDescription>
              Review the destination before confirming — on-chain payouts are irreversible.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold text-foreground">{availableToClaim} SEI</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground shrink-0">Destination</span>
              <span className="font-mono text-foreground text-right truncate">{payout}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Type</span>
              <Badge variant="success" className="text-[10px]">{seiAddressTypeLabel(payoutValidation.type)}</Badge>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-destructive/5 border border-destructive/20 p-3 text-xs text-muted-foreground">
            <ShieldAlert className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <p>Funds sent to the wrong address cannot be recovered. Make sure this address is correct and yours.</p>
          </div>

          <DialogFooter className="pt-1">
            <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button size="sm" className="gap-1.5" onClick={handleConfirmRequest}>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Confirm request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
