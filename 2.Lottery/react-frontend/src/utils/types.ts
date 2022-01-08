
import Web3 from 'web3';

export type TWeb3Instance = Web3 | null;

// See types here
// https://docs.metamask.io/guide/ethereum-provider.html#events

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export interface ProviderMessage {
  type: string;
  data: unknown;
}