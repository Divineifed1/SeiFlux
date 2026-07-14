'use client';
import * as React from 'react';
import {
  getSeiRpc,
  getSeiEvmRpc,
  SEI_MAINNET_CHAIN_ID,
  SEI_CHAIN_INFO,
  SEI_EVM_CHAIN_ID_HEX,
  SEI_EVM_CHAIN_PARAMS,
} from '@/lib/chain-config';
import { StargateClient } from '@cosmjs/stargate';

export type WalletType = 'keplr' | 'compass' | 'leap' | 'metamask' | 'rabby';

const EVM_WALLETS: WalletType[] = ['metamask', 'rabby'];

export function isEvmWallet(type: WalletType): boolean {
  return EVM_WALLETS.includes(type);
}

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
  balanceUnit: string;
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
  {
    type: 'metamask',
    name: 'MetaMask',
    description: 'Connect with MetaMask (Sei EVM)',
    installed: false,
    icon: '🦊',
  },
  {
    type: 'rabby',
    name: 'Rabby',
    description: 'Connect with Rabby (Sei EVM)',
    installed: false,
    icon: '🐰',
  },
];

type OfflineDirectSigner = {
  getAccounts: () => Promise<{ address: string; pubkey?: { type: string; value: string } }[]>;
};

type EvmProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  isMetaMask?: boolean;
  isRabby?: boolean;
  providers?: EvmProvider[];
};

function getEvmProvider(walletType: 'metamask' | 'rabby'): EvmProvider | null {
  if (typeof window === 'undefined') return null;
  const eth = (window as unknown as { ethereum?: EvmProvider }).ethereum;
  if (!eth) return null;

  const match = (p: EvmProvider): boolean =>
    walletType === 'metamask' ? !!p.isMetaMask && !p.isRabby : !!p.isRabby;

  if (eth.providers && eth.providers.length) {
    return eth.providers.find(match) || null;
  }
  return match(eth) ? eth : null;
}

function hasEvmProvider(walletType: 'metamask' | 'rabby'): boolean {
  if (typeof window === 'undefined') return false;
  const eth = (window as unknown as { ethereum?: EvmProvider }).ethereum;
  if (!eth) return false;

  const match = (p: EvmProvider): boolean =>
    walletType === 'metamask' ? !!p.isMetaMask && !p.isRabby : !!p.isRabby;

  if (eth.providers && eth.providers.length) {
    return eth.providers.some(match);
  }
  return match(eth);
}

async function suggestChain(walletType: WalletType): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    switch (walletType) {
      case 'keplr': {
        const keplr = (window as unknown as { keplr?: { experimentalSuggestChain?: (info: unknown) => Promise<void> } }).keplr;
        if (keplr?.experimentalSuggestChain) {
          await keplr.experimentalSuggestChain(SEI_CHAIN_INFO);
        }
        break;
      }
      case 'compass': {
        const compass = (window as unknown as { compass?: { experimentalSuggestChain?: (info: unknown) => Promise<void> } }).compass;
        if (compass?.experimentalSuggestChain) {
          await compass.experimentalSuggestChain(SEI_CHAIN_INFO);
        }
        break;
      }
      case 'leap': {
        const leap = (window as unknown as { leap?: { experimentalSuggestChain?: (info: unknown) => Promise<void> } }).leap;
        if (leap?.experimentalSuggestChain) {
          await leap.experimentalSuggestChain(SEI_CHAIN_INFO);
        }
        break;
      }
    }
  } catch (e) {
    console.error(`Failed to suggest chain for ${walletType}:`, e);
  }
}

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

async function connectEvm(walletType: 'metamask' | 'rabby'): Promise<string | null> {
  const provider = getEvmProvider(walletType);
  if (!provider) {
    throw new Error(`${walletType === 'metamask' ? 'MetaMask' : 'Rabby'} not found. Please install the extension and refresh.`);
  }

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEI_EVM_CHAIN_ID_HEX }],
    });
  } catch (switchError: unknown) {
    const code = (switchError as { code?: number })?.code;
    if (code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [SEI_EVM_CHAIN_PARAMS],
      });
    } else {
      throw switchError;
    }
  }

  const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
  if (!accounts || accounts.length === 0) {
    throw new Error('No accounts found. Please unlock your wallet.');
  }
  return accounts[0];
}

async function fetchEvmBalance(address: string): Promise<string | null> {
  try {
    const res = await fetch(getSeiEvmRpc(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [address, 'latest'],
      }),
    });
    const json = (await res.json()) as { result?: string };
    if (!json.result) return '0';
    const wei = BigInt(json.result);
    const sei = wei / BigInt('1000000000000000000');
    return sei.toString();
  } catch (e) {
    console.error('Failed to fetch EVM balance:', e);
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
    balanceUnit: 'usei',
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
          if (w.type === 'metamask') return { ...w, installed: hasEvmProvider('metamask') };
          if (w.type === 'rabby') return { ...w, installed: hasEvmProvider('rabby') };
          return w;
        })
    );
  }, []);

  React.useEffect(() => {
    detectWallets();

    const handler = () => detectWallets();
    window.addEventListener('keplr_keystorechange', handler);
    window.addEventListener('leap_keystorechange', handler);
    window.addEventListener('accountsChanged', handler);
    window.addEventListener('chainChanged', handler);
    return () => {
      window.removeEventListener('keplr_keystorechange', handler);
      window.removeEventListener('leap_keystorechange', handler);
      window.removeEventListener('accountsChanged', handler);
      window.removeEventListener('chainChanged', handler);
    };
  }, [detectWallets]);

  const connect = React.useCallback(async (walletType: WalletType) => {
    setState(s => ({ ...s, isConnecting: true, error: null }));

    try {
      if (walletType === 'metamask' || walletType === 'rabby') {
        const address = await connectEvm(walletType);
        if (!address) {
          throw new Error('No accounts found. Please unlock your wallet.');
        }
        const balance = await fetchEvmBalance(address);
        const walletInfo = WALLETS.find(w => w.type === walletType);

        setState({
          address,
          bech32Address: address,
          currentWallet: walletInfo || null,
          balance: balance ?? '0',
          balanceUnit: 'SEI',
          isConnecting: false,
          error: null,
        });
        return;
      }

      await suggestChain(walletType);

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
        balanceUnit: 'usei',
        isConnecting: false,
        error: null,
      });
    } catch (e) {
      setState({
        address: null,
        bech32Address: null,
        currentWallet: null,
        balance: null,
        balanceUnit: 'usei',
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
      balanceUnit: 'usei',
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
    balanceUnit: state.balanceUnit,
    isConnecting: state.isConnecting,
    error: state.error,
    connect,
    disconnect,
  };
}
