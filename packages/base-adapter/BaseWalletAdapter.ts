import { BrowserProvider, JsonRpcSigner } from 'ethers';

export class BaseWalletAdapter {
  private provider: BrowserProvider | null = null;
  private signer: JsonRpcSigner | null = null;

  async connect(): Promise<{ address: string; chainId: number }> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("No crypto wallet found. Please install a wallet like Coinbase Wallet or MetaMask.");
    }

    this.provider = new BrowserProvider(window.ethereum);
    await this.provider.send("eth_requestAccounts", []);
    this.signer = await this.provider.getSigner();
    
    const network = await this.provider.getNetwork();
    const address = await this.signer.getAddress();

    // Check if on Base Mainnet (8453) or Sepolia (84532)
    const chainId = Number(network.chainId);
    if (chainId !== 8453 && chainId !== 84532) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // 8453 in hex
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        console.warn("Could not switch to Base automatically", switchError);
      }
    }

    return { address, chainId };
  }

  async getSigner() {
    if (!this.signer) {
        await this.connect();
    }
    return this.signer;
  }
}
