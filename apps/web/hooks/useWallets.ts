import { useState, useEffect } from 'react';
import { BaseWalletAdapter } from '@'+raw_name+'/base-adapter';
import { StacksWalletAdapter } from '@'+raw_name+'/stacks-adapter';

const baseAdapter = new BaseWalletAdapter();
const stacksAdapter = new StacksWalletAdapter();

export function useWallets() {
  const [baseAddress, setBaseAddress] = useState<string | null>(null);
  const [stacksAddress, setStacksAddress] = useState<string | null>(null);

  const connectBase = async () => {
    try {
      const { address } = await baseAdapter.connect();
      setBaseAddress(address);
    } catch (e) {
      console.error("Base Connect Error", e);
      alert("Failed to connect Base wallet");
    }
  };

  const connectStacks = async () => {
    try {
      const address = await stacksAdapter.connect("DApp", typeof window !== 'undefined' ? window.location.origin + '/icon.png' : '');
      setStacksAddress(address);
    } catch (e) {
      console.error("Stacks Connect Error", e);
    }
  };
  
  const disconnectStacks = () => {
    stacksAdapter.disconnect();
    setStacksAddress(null);
  }

  return {
    baseAddress,
    stacksAddress,
    connectBase,
    connectStacks,
    disconnectStacks,
    baseAdapter,
    stacksAdapter
  };
}
