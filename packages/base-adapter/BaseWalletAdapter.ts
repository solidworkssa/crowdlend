import { BrowserProvider, Contract, JsonRpcSigner } from 'ethers';

export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
}

export class BaseWalletAdapter {
  private provider: BrowserProvider | null = null;
  private signer: JsonRpcSigner | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  async connect(): Promise<string> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.');
    }

    try {
      this.provider = new BrowserProvider(window.ethereum);

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }

      this.signer = await this.provider.getSigner();
      const address = await this.signer.getAddress();

      this.setupEventListeners();
      this.emit('connect', address);

      return address;
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      throw new Error(error.message || 'Failed to connect wallet');
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null;
    this.signer = null;
    this.emit('disconnect');
  }

  async getAddress(): Promise<string | null> {
    if (!this.signer) return null;
    try {
      return await this.signer.getAddress();
    } catch {
      return null;
    }
  }

  async getChainId(): Promise<number | null> {
    if (!this.provider) return null;
    try {
      const network = await this.provider.getNetwork();
      return Number(network.chainId);
    } catch {
      return null;
    }
  }

  async switchToBase(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('No Ethereum wallet detected');
    }

    const BASE_CHAIN_ID = '0x2105'; // Base Mainnet: 8453

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_CHAIN_ID }],
      });
    } catch (error: any) {
      // Chain not added, try to add it
      if (error.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: BASE_CHAIN_ID,
              chainName: 'Base',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://mainnet.base.org'],
              blockExplorerUrls: ['https://basescan.org'],
            },
          ],
        });
      } else {
        throw error;
      }
    }
  }

  async sendTransaction(to: string, value: string, data?: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await this.signer.sendTransaction({
        to,
        value,
        data: data || '0x',
      });

      this.emit('transactionSent', tx.hash);
      return tx.hash;
    } catch (error: any) {
      console.error('Transaction failed:', error);
      throw new Error(error.message || 'Transaction failed');
    }
  }

  async callContract(
    contractAddress: string,
    abi: any[],
    method: string,
    args: any[] = [],
    value?: string
  ): Promise<any> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const contract = new Contract(contractAddress, abi, this.signer);
      const tx = await contract[method](...args, value ? { value } : {});

      this.emit('transactionSent', tx.hash);
      const receipt = await tx.wait();
      this.emit('transactionConfirmed', receipt);

      return receipt;
    } catch (error: any) {
      console.error('Contract call failed:', error);
      throw new Error(error.message || 'Contract call failed');
    }
  }

  async readContract(
    contractAddress: string,
    abi: any[],
    method: string,
    args: any[] = []
  ): Promise<any> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const contract = new Contract(contractAddress, abi, this.provider);
      return await contract[method](...args);
    } catch (error: any) {
      console.error('Contract read failed:', error);
      throw new Error(error.message || 'Contract read failed');
    }
  }

  private setupEventListeners(): void {
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect();
      } else {
        this.emit('accountChanged', accounts[0]);
      }
    });

    window.ethereum.on('chainChanged', (chainId: string) => {
      this.emit('chainChanged', parseInt(chainId, 16));
      window.location.reload();
    });

    window.ethereum.on('disconnect', () => {
      this.disconnect();
    });
  }

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

  isConnected(): boolean {
    return this.signer !== null;
  }

  getProvider(): BrowserProvider | null {
    return this.provider;
  }

  getSigner(): JsonRpcSigner | null {
    return this.signer;
  }
}

// Singleton instance
let baseWalletInstance: BaseWalletAdapter | null = null;

export function getBaseWallet(): BaseWalletAdapter {
  if (!baseWalletInstance) {
    baseWalletInstance = new BaseWalletAdapter();
  }
  return baseWalletInstance;
}

// Type augmentation for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
