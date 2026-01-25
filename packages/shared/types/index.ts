export interface TransactionStatus {
  status: 'idle' | 'pending' | 'success' | 'error';
  hash?: string;
  error?: string;
}

export interface WalletState {
  address: string | null;
  network: string | null;
  balance: string | null;
  connected: boolean;
}

export type Chain = 'base' | 'stacks';
