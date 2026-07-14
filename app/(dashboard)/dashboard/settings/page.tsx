'use client';
import * as React from 'react';
import type { Metadata } from 'next';
import { User, Bell, Shield, FolderGit2, Palette, Key, Coins, Save } from 'lucide-react';
import { GithubIcon } from '@/components/ui/github-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/design-system/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { SeiAddressInput } from '@/components/ui/sei-address-input';
import { useAuthStore } from '@/lib/store/auth-store';
import { useToast } from '@/hooks/use-toast';
import { validateSeiAddress, formatSeiAddress, seiAddressTypeLabel } from '@/lib/validation/sei-address';

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-start gap-3 p-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

const NOTIFICATION_SETTINGS = [
  { id: 'new-applications', label: 'New applications', description: 'When someone applies to your project', enabled: true },
  { id: 'app-status', label: 'Application status changes', description: 'When your application is reviewed', enabled: true },
  { id: 'project-approved', label: 'Project approvals', description: 'When your project listing is approved', enabled: true },
  { id: 'contributor-joined', label: 'Contributor activity', description: 'When approved contributors start work', enabled: false },
  { id: 'newsletter', label: 'Platform updates', description: 'Weekly digest of platform news', enabled: false },
];

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const setPayoutAddress = useAuthStore((s) => s.setPayoutAddress);
  const { toast } = useToast();

  const [draft, setDraft] = React.useState(user?.payoutAddress ?? '');
  const [valid, setValid] = React.useState(false);

  const saved = user?.payoutAddress;
  const savedValidation = validateSeiAddress(saved ?? '');

  const handleSave = () => {
    const v = validateSeiAddress(draft);
    if (!v.valid) {
      toast({ title: 'Invalid address', description: 'Enter a valid Sei native or EVM address.', variant: 'destructive' });
      return;
    }
    setPayoutAddress(v.normalized);
    toast({ variant: 'success', title: 'Payout address saved', description: `Rewards will be sent to ${formatSeiAddress(v.normalized)}.` });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Settings" description="Manage your account and platform preferences." />

      {/* Profile */}
      <SettingsSection
        icon={User}
        title="Profile"
        description="Update your public profile information."
      >
        <div className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg bg-primary/20 text-primary font-semibold">
                AB
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">Upload photo</Button>
              <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG up to 2MB</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>First name</Label>
              <Input defaultValue="Alex" />
            </div>
            <div className="space-y-1.5">
              <Label>Last name</Label>
              <Input defaultValue="Builder" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email address</Label>
            <Input defaultValue="alex@seiswap.example.com" type="email" />
          </div>
          <div className="space-y-1.5">
            <Label>Bio</Label>
            <Textarea
              placeholder="Tell the community about yourself..."
              defaultValue="Building on Sei — DeFi & infrastructure. Maintainer at SeiSwap Labs."
              className="resize-none h-20"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Skills</Label>
            <Input defaultValue="Rust, TypeScript, React, CosmWasm" />
            <p className="text-xs text-muted-foreground">Comma separated</p>
          </div>
          <div className="space-y-1.5">
            <Label>Website</Label>
            <Input placeholder="https://yoursite.com" type="url" />
          </div>
          <Button size="sm">Save changes</Button>
        </div>
      </SettingsSection>

      {/* Payout Address */}
      <SettingsSection
        icon={Coins}
        title="Payout Address"
        description="Where your SEI rewards are sent. Accepts Sei native (sei1…) or Sei EVM (0x…) addresses."
      >
        <div className="space-y-4">
          {saved && savedValidation.valid ? (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current payout address</p>
                <p className="text-sm font-mono text-foreground truncate">{saved}</p>
              </div>
              <Badge variant="success" className="text-[10px] shrink-0">
                {seiAddressTypeLabel(savedValidation.type)}
              </Badge>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No payout address set yet — add one below to enable reward claims.
            </p>
          )}

          <div className="space-y-1.5">
            <Label>New payout address</Label>
            <SeiAddressInput value={draft} onChange={setDraft} onValidChange={setValid} />
          </div>

          <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={!valid}>
            <Save className="h-3.5 w-3.5" />
            Save payout address
          </Button>
          <p className="text-[11px] text-muted-foreground">
            On-chain payouts are irreversible — double-check the address before saving.
          </p>
        </div>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection
        icon={Palette}
        title="Appearance"
        description="Customize how the platform looks."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">Use light or dark mode across the app.</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection
        icon={Bell}
        title="Notifications"
        description="Control when and how you receive notifications."
      >
        <div className="space-y-4">
          {NOTIFICATION_SETTINGS.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <Switch defaultChecked={item.enabled} />
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* GitHub */}
      <SettingsSection
        icon={FolderGit2}
        title="GitHub Connection"
        description="Manage your GitHub integration."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GithubIcon className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">@alexbuilder</p>
                <p className="text-xs text-muted-foreground">Connected via GitHub OAuth</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" className="text-xs">Connected</Badge>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* API Keys */}
      <SettingsSection
        icon={Key}
        title="API Access"
        description="Manage API keys for platform integrations."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
            <div>
              <p className="text-xs font-mono text-foreground">sbh_live_••••••••••••••••</p>
              <p className="text-xs text-muted-foreground mt-0.5">Created Dec 14, 2024</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs h-7">Reveal</Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 text-destructive border-destructive/30 hover:bg-destructive/10"
              >
                Revoke
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Key className="h-3.5 w-3.5" />
            Generate new key
          </Button>
        </div>
      </SettingsSection>

      {/* Danger zone */}
      <SettingsSection
        icon={Shield}
        title="Danger Zone"
        description="Irreversible account actions."
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-3 rounded-lg border border-destructive/20 bg-destructive/5">
            <div>
              <p className="text-sm font-medium text-foreground">Delete account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
