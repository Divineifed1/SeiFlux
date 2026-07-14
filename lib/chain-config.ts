export const SEI_MAINNET_CHAIN_ID = 'sei-1';

export const SEI_MAINNET = {
  chainId: SEI_MAINNET_CHAIN_ID,
  chainName: 'Sei Mainnet',
  rpc: process.env.NEXT_PUBLIC_SEI_RPC_URL || 'https://rpc.sei-apis.com',
  rest: process.env.NEXT_PUBLIC_SEI_REST_URL || 'https://rest.sei-apis.com',
  bech32Prefix: 'sei',
  coinType: 118,
  gasPrice: { amount: '0.025usei', denom: 'usei' },
  features: ['stargate', 'no-legacy-stdTx', 'chain-rotation'],
};

export function getSeiRpc(): string {
  return SEI_MAINNET.rpc;
}

export function getSeiRest(): string {
  return SEI_MAINNET.rest;
}

export const SEI_CHAIN_INFO = {
  chainId: SEI_MAINNET.chainId,
  chainName: SEI_MAINNET.chainName,
  rpc: SEI_MAINNET.rpc,
  rest: SEI_MAINNET.rest,
  bip44: { coinType: SEI_MAINNET.coinType },
  coinType: SEI_MAINNET.coinType,
  bech32Config: {
    bech32PrefixAccAddr: 'sei',
    bech32PrefixAccPub: 'seipub',
    bech32PrefixValAddr: 'seivaloper',
    bech32PrefixValPub: 'seivaloperpub',
    bech32PrefixConsAddr: 'seivalcons',
    bech32PrefixConsPub: 'seivalconspub',
  },
  currencies: [
    {
      coinDenom: 'SEI',
      coinMinimalDenom: 'usei',
      coinDecimals: 6,
      coinGeckoId: 'sei-network',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'SEI',
      coinMinimalDenom: 'usei',
      coinDecimals: 6,
      coinGeckoId: 'sei-network',
    },
  ],
  stakeCurrency: {
    coinDenom: 'SEI',
    coinMinimalDenom: 'usei',
    coinDecimals: 6,
    coinGeckoId: 'sei-network',
  },
  gasPriceStep: {
    low: 0.025,
    average: 0.05,
    high: 0.1,
  },
  features: ['stargate', 'no-legacy-stdTx', 'chain-rotation'],
};

export const SEI_EVM_CHAIN_ID_HEX = '0x531';

export const SEI_EVM = {
  chainId: SEI_EVM_CHAIN_ID_HEX,
  chainName: 'Sei EVM',
  rpc: process.env.NEXT_PUBLIC_SEI_EVM_RPC_URL || 'https://evm-rpc.sei-apis.com',
  explorer: 'https://seitrace.com',
  nativeCurrency: {
    name: 'Sei',
    symbol: 'SEI',
    decimals: 18,
  },
};

export function getSeiEvmRpc(): string {
  return SEI_EVM.rpc;
}

export const SEI_EVM_CHAIN_PARAMS = {
  chainId: SEI_EVM_CHAIN_ID_HEX,
  chainName: SEI_EVM.chainName,
  nativeCurrency: SEI_EVM.nativeCurrency,
  rpcUrls: [SEI_EVM.rpc],
  blockExplorerUrls: [SEI_EVM.explorer],
};
