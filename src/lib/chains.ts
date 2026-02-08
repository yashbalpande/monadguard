import { Chain } from 'viem';

export const monadTestnet: Chain = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { name: 'Monad', symbol: 'MON', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.monad.xyz/rpc'] },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://testnet.monad.xyz/' },
  },
  testnet: true,
};

export const MONAD_CHAIN_ID = 10143;
export const MONAD_RPC_URL = 'https://testnet.monad.xyz/rpc';
