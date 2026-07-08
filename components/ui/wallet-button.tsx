'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, LogOut, Wallet, ExternalLink, RefreshCw } from 'lucide-react';
import { useWallet, type WalletType } from '@/lib/wallet/use-wallet';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { SEI_MAINNET } from '@/lib/chain-config';

const WALLET_ICONS: Record<WalletType, string> = {
  keplr: '🟢',
  compass: '🧭',
  leap: '🦘',
};

const SEI_EXPLORER = 'https://www.mintscan.io/sei/tx';

export function WalletButton({ className }: { className?: string }) {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const {
    wallets,
    isConnecting,
    address,
    currentWallet,
    balance,
    error,
    connect,
    disconnect,
  } = useWallet();

  const [refreshCounter, setRefreshCounter] = React.useState(0);

  React.useEffect(() => {
    if (address && currentWallet) {
      const user = {
        id: `wallet_${address.slice(0, 8)}`,
        name: `Wallet ${address.slice(0, 6)}`,
        email: `${address.slice(0, 8)}@sei.wallet`,
        role: 'contributor' as const,
        avatar: '',
        walletAddress: address,
        walletType: currentWallet.type,
      };
      login(user);
      toast({
        variant: 'success',
        title: 'Wallet connected!',
        description: `Connected via ${currentWallet.name}`,
      });
      router.push('/dashboard');
    }
  }, [address, currentWallet, login, router]);

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: 'Wallet disconnected',
      description: 'You can connect again anytime.',
    });
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({ title: 'Address copied to clipboard' });
    }
  };

  const handleRefresh = () => {
    setRefreshCounter(c => c + 1);
  };

  if (address && currentWallet) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline-primary" size="sm" className={cn('gap-2', className)}>
            <span>{WALLET_ICONS[currentWallet.type]}</span>
            <span className="hidden sm:inline font-mono text-xs">{address.slice(0, 6)}...{address.slice(-4)}</span>
            <span className="sm:hidden">Wallet</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Connected Wallet</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Sei Mainnet
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <div className="px-2 py-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Address</span>
              <button
                onClick={copyAddress}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
            </div>
            <p className="text-xs font-mono break-all bg-muted/50 rounded px-2 py-1.5">
              {address}
            </p>
          </div>

          <DropdownMenuSeparator />

          <div className="px-2 py-2 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Balance</span>
              <button
                onClick={handleRefresh}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {balance !== null ? `${Number(balance).toLocaleString()} usei` : 'Loading...'}
            </p>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <a
              href={`${SEI_EXPLORER}/account/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View on Mintscan
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDisconnect} className="gap-2 text-destructive focus:text-destructive">
            <LogOut className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const installedWallets = wallets.filter(w => w.installed);
  const uninstalledWallets = wallets.filter(w => !w.installed);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className={cn('gap-2', className)}>
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">Select a wallet</span>
            <span className="text-[10px] text-muted-foreground">
              {SEI_MAINNET.chainName} (sei-1)
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {error && (
          <div className="px-2 py-1.5 text-xs text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}

        {installedWallets.length > 0 && (
          <>
            {installedWallets.map(wallet => (
              <DropdownMenuItem
                key={wallet.type}
                onClick={() => connect(wallet.type)}
                disabled={isConnecting}
                className="gap-3 cursor-pointer"
              >
                <span className="text-base">{WALLET_ICONS[wallet.type]}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{wallet.name}</span>
                  <span className="text-[10px] text-muted-foreground">{wallet.description}</span>
                </div>
                {isConnecting && (
                  <span className="ml-auto h-3 w-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        {uninstalledWallets.length > 0 && (
          <>
            <p className="px-2 py-1 text-[10px] text-muted-foreground uppercase tracking-widest">
              Not installed
            </p>
            {uninstalledWallets.map(wallet => (
              <DropdownMenuItem key={wallet.type} disabled className="gap-3 opacity-60">
                <span className="text-base">{WALLET_ICONS[wallet.type]}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{wallet.name}</span>
                  <span className="text-[10px] text-muted-foreground">{wallet.description}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
