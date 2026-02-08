import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
  openSTXTransfer,
} from '@stacks/connect';
import {
  StacksMainnet,
  StacksTestnet,
  StacksNetwork,
} from '@stacks/network';
import {
  AnchorMode,
  PostConditionMode,
  stringUtf8CV,
  uintCV,
  principalCV,
  bufferCV,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  Pc,
} from '@stacks/transactions';

export interface StacksWalletState {
  address: string | null;
  isConnected: boolean;
  network: 'mainnet' | 'testnet';
}

export class StacksWalletAdapter {
  private userSession: UserSession;
  private appConfig: AppConfig;
  private network: StacksNetwork;
  private listeners: Map<string, Set<Function>> = new Map();

  constructor(network: 'mainnet' | 'testnet' = 'mainnet') {
    this.appConfig = new AppConfig(['store_write', 'publish_data']);
    this.userSession = new UserSession({ appConfig: this.appConfig });
    this.network = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
  }

  async connect(): Promise<string> {
    return new Promise((resolve, reject) => {
      showConnect({
        appDetails: {
          name: 'Multi-Chain dApp',
          icon: window.location.origin + '/logo.png',
        },
        redirectTo: '/',
        onFinish: () => {
          const userData = this.userSession.loadUserData();
          const address = userData.profile.stxAddress.mainnet;
          this.emit('connect', address);
          resolve(address);
        },
        onCancel: () => {
          reject(new Error('User cancelled connection'));
        },
        userSession: this.userSession,
      });
    });
  }

  async disconnect(): Promise<void> {
    this.userSession.signUserOut();
    this.emit('disconnect');
  }

  getAddress(): string | null {
    if (!this.userSession.isUserSignedIn()) {
      return null;
    }
    const userData = this.userSession.loadUserData();
    return userData.profile.stxAddress.mainnet;
  }

  isConnected(): boolean {
    return this.userSession.isUserSignedIn();
  }

  async callContract(
    contractAddress: string,
    contractName: string,
    functionName: string,
    functionArgs: any[],
    options?: {
      postConditions?: any[];
      onFinish?: (data: any) => void;
      onCancel?: () => void;
    }
  ): Promise<string> {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected');
    }

    return new Promise((resolve, reject) => {
      openContractCall({
        network: this.network,
        anchorMode: AnchorMode.Any,
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        postConditionMode: PostConditionMode.Deny,
        postConditions: options?.postConditions || [],
        onFinish: (data) => {
          this.emit('transactionSent', data.txId);
          options?.onFinish?.(data);
          resolve(data.txId);
        },
        onCancel: () => {
          options?.onCancel?.();
          reject(new Error('User cancelled transaction'));
        },
      });
    });
  }

  async transferSTX(
    recipient: string,
    amount: number,
    memo?: string,
    options?: {
      onFinish?: (data: any) => void;
      onCancel?: () => void;
    }
  ): Promise<string> {
    if (!this.isConnected()) {
      throw new Error('Wallet not connected');
    }

    return new Promise((resolve, reject) => {
      openSTXTransfer({
        network: this.network,
        recipient,
        amount: amount.toString(),
        memo: memo || '',
        anchorMode: AnchorMode.Any,
        onFinish: (data) => {
          this.emit('transactionSent', data.txId);
          options?.onFinish?.(data);
          resolve(data.txId);
        },
        onCancel: () => {
          options?.onCancel?.();
          reject(new Error('User cancelled transaction'));
        },
      });
    });
  }

  async readContract(
    contractAddress: string,
    contractName: string,
    functionName: string,
    functionArgs: any[]
  ): Promise<any> {
    const url = `${this.network.coreApiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: this.getAddress() || 'SP000000000000000000002Q6VF78',
          arguments: functionArgs.map(arg => this.cvToHex(arg)),
        }),
      });

      if (!response.ok) {
        throw new Error(`Contract read failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error: any) {
      console.error('Contract read failed:', error);
      throw new Error(error.message || 'Contract read failed');
    }
  }

  async getTransactionStatus(txId: string): Promise<any> {
    const url = `${this.network.coreApiUrl}/extended/v1/tx/${txId}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch transaction: ${response.statusText}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Failed to get transaction status:', error);
      throw new Error(error.message || 'Failed to get transaction status');
    }
  }

  async waitForTransaction(
    txId: string,
    maxAttempts: number = 30,
    interval: number = 2000
  ): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const status = await this.getTransactionStatus(txId);
        if (status.tx_status === 'success') {
          this.emit('transactionConfirmed', status);
          return status;
        } else if (status.tx_status === 'abort_by_response' || status.tx_status === 'abort_by_post_condition') {
          throw new Error(`Transaction failed: ${status.tx_status}`);
        }
      } catch (error) {
        if (i === maxAttempts - 1) throw error;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    throw new Error('Transaction confirmation timeout');
  }

  getNetwork(): StacksNetwork {
    return this.network;
  }

  switchNetwork(network: 'mainnet' | 'testnet'): void {
    this.network = network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
    this.emit('networkChanged', network);
  }

  getUserSession(): UserSession {
    return this.userSession;
  }

  // Helper method to convert Clarity values to hex
  private cvToHex(cv: any): string {
    return `0x${cv.serialize().toString('hex')}`;
  }

  // Event management
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  private emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(...args));
    }
  }
}

// Singleton instance
let stacksWalletInstance: StacksWalletAdapter | null = null;

export function getStacksWallet(network: 'mainnet' | 'testnet' = 'mainnet'): StacksWalletAdapter {
  if (!stacksWalletInstance) {
    stacksWalletInstance = new StacksWalletAdapter(network);
  }
  return stacksWalletInstance;
}

// Export Clarity value constructors for convenience
export {
  stringUtf8CV,
  uintCV,
  principalCV,
  bufferCV,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
};
