'use client';
import * as React from 'react';
import { getSeiRpc, SEI_MAINNET_CHAIN_ID } from '@/lib/chain-config';
import { StargateClient } from '@cosmjs/stargate';

export type WalletType = 'keplr' | 'compass' | 'leap';

export interface WalletInfo {
  type: WalletType;
  name: string;
  description: string;
  installed: boolean;
  icon: string;
}

export interface WalletState {
  address: string | null;
  bech32Address: string | null;
  currentWallet: WalletInfo | null;
  balance: string | null;
  isConnecting: boolean;
  error: string | null;
}

const WALLETS: WalletInfo[] = [
  {
    type: 'keplr',
    name: 'Keplr',
    description: 'The most popular Cosmos & Sei wallet',
    installed: false,
    icon: '🟢',
  },
  {
    type: 'compass',
    name: 'Compass',
    description: 'Native Sei wallet',
    installed: false,
    icon: '🧭',
  },
  {
    type: 'leap',
    name: 'Leap',
    description: 'Cosmos wallet by Leap',
    installed: false,
    icon: '🦘',
  },
];

type OfflineDirectSigner = {
  getAccounts: () => Promise<{ address: string; pubkey?: { type: string; value: string } }[]>;
};

async function getOfflineSigner(walletType: WalletType): Promise<OfflineDirectSigner | null> {
  if (typeof window === 'undefined') return null;

  try {
    switch (walletType) {
      case 'keplr': {
        const keplr = (window as unknown as { keplr?: { getOfflineSigner: (id: string) => OfflineDirectSigner } }).keplr;
        if (keplr?.getOfflineSigner) {
          return keplr.getOfflineSigner(SEI_MAINNET_CHAIN_ID);
        }
        break;
      }
      case 'compass': {
        const compass = (window as unknown as { compass?: { getOfflineSigner: (id: string) => OfflineDirectSigner } }).compass;
        if (compass?.getOfflineSigner) {
          return compass.getOfflineSigner(SEI_MAINNET_CHAIN_ID);
        }
        const injected = (window as unknown as { injectedWeb3?: { sei?: { getOfflineSigner: (id: string) => OfflineDirectSigner } } }).injectedWeb3;
        if (injected?.sei?.getOfflineSigner) {
          return injected.sei.getOfflineSigner(SEI_MAINNET_CHAIN_ID);
        }
        break;
      }
      case 'leap': {
        const leap = (window as unknown as { leap?: { getOfflineSigner: (id: string) => OfflineDirectSigner } }).leap;
        if (leap?.getOfflineSigner) {
          return leap.getOfflineSigner(SEI_MAINNET_CHAIN_ID);
        }
        break;
      }
    }
  } catch (e) {
    console.error(`Failed to get offline signer for ${walletType}:`, e);
    return null;
  }
  return null;
}

async function fetchBalance(address: string): Promise<string | null> {
  try {
    const client = await StargateClient.connect(getSeiRpc());
    const balance = await client.getBalance(address, 'usei');
    client.disconnect();
    return balance.amount || '0';
  } catch (e) {
    console.error('Failed to fetch balance:', e);
    return null;
  }
}

export function useWallet() {
  const [wallets, setWallets] = React.useState<WalletInfo[]>(WALLETS);
  const [state, setState] = React.useState<WalletState>({
    address: null,
    bech32Address: null,
    currentWallet: null,
    balance: null,
    isConnecting: false,
    error: null,
  });

  const detectWallets = React.useCallback(() => {
    if (typeof window === 'undefined') return;

    setWallets(
      prev =>
        prev.map(w => {
          if (w.type === 'keplr') return { ...w, installed: !!(window as unknown as Record<string, unknown>).keplr };
          if (w.type === 'compass') {
            const compass = (window as unknown as { compass?: boolean }).compass;
            const injected = (window as unknown as { injectedWeb3?: boolean }).injectedWeb3;
            return { ...w, installed: !!(compass || injected) };
          }
          if (w.type === 'leap') return { ...w, installed: !!(window as unknown as Record<string, unknown>).leap };
          return w;
        })
    );
  }, []);

  React.useEffect(() => {
    detectWallets();

    const handler = () => detectWallets();
    window.addEventListener('keplr_keystorechange', handler);
    window.addEventListener('leap_keystorechange', handler);
    return () => {
      window.removeEventListener('keplr_keystorechange', handler);
      window.removeEventListener('leap_keystorechange', handler);
    };
  }, [detectWallets]);

  const connect = React.useCallback(async (walletType: WalletType) => {
    setState(s => ({ ...s, isConnecting: true, error: null }));

    try {
      const signer = await getOfflineSigner(walletType);
      if (!signer) {
        throw new Error(`${walletType} wallet not found. Please install the extension and refresh.`);
      }

      const accounts = await signer.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }

      const address = accounts[0].address;
      const balance = await fetchBalance(address);
      const walletInfo = WALLETS.find(w => w.type === walletType);

      setState({
        address,
        bech32Address: address,
        currentWallet: walletInfo || null,
        balance: balance ?? '0',
        isConnecting: false,
        error: null,
      });
    } catch (e) {
      setState({
        address: null,
        bech32Address: null,
        currentWallet: null,
        balance: null,
        isConnecting: false,
        error: e instanceof Error ? e.message : 'Failed to connect wallet',
      });
    }
  }, []);

  const disconnect = React.useCallback(() => {
    setState({
      address: null,
      bech32Address: null,
      currentWallet: null,
      balance: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  return {
    wallets,
    address: state.address,
    bech32Address: state.bech32Address,
    currentWallet: state.currentWallet,
    balance: state.balance,
    isConnecting: state.isConnecting,
    error: state.error,
    connect,
    disconnect,
  };
}
