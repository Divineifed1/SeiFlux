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
