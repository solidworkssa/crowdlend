'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBaseWallet } from '../../../packages/base-adapter/BaseWalletAdapter';
import { getStacksWallet } from '../../../packages/stacks-adapter/StacksWalletAdapter';

export function useWallets() {
  const [baseAddress, setBaseAddress] = useState<string | null>(null);
  const [stacksAddress, setStacksAddress] = useState<string | null>(null);
  const [baseChainId, setBaseChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseWallet = getBaseWallet();
  const stacksWallet = getStacksWallet('mainnet');

  // Check for existing connections on mount
  useEffect(() => {
    const checkConnections = async () => {
      // Check Base connection
      const baseAddr = await baseWallet.getAddress();
      if (baseAddr) {
        setBaseAddress(baseAddr);
        const chainId = await baseWallet.getChainId();
        setBaseChainId(chainId);
      }

      // Check Stacks connection
      if (stacksWallet.isConnected()) {
        const stacksAddr = stacksWallet.getAddress();
        setStacksAddress(stacksAddr);
      }
    };

    checkConnections();
  }, []);

  // Set up event listeners
  useEffect(() => {
    const handleBaseConnect = (address: string) => {
      setBaseAddress(address);
      setError(null);
    };

    const handleBaseDisconnect = () => {
      setBaseAddress(null);
      setBaseChainId(null);
    };

    const handleBaseAccountChanged = (address: string) => {
      setBaseAddress(address);
    };

    const handleBaseChainChanged = (chainId: number) => {
      setBaseChainId(chainId);
    };

    const handleStacksConnect = (address: string) => {
      setStacksAddress(address);
      setError(null);
    };

    const handleStacksDisconnect = () => {
      setStacksAddress(null);
    };

    baseWallet.on('connect', handleBaseConnect);
    baseWallet.on('disconnect', handleBaseDisconnect);
    baseWallet.on('accountChanged', handleBaseAccountChanged);
    baseWallet.on('chainChanged', handleBaseChainChanged);

    stacksWallet.on('connect', handleStacksConnect);
    stacksWallet.on('disconnect', handleStacksDisconnect);

    return () => {
      baseWallet.off('connect', handleBaseConnect);
      baseWallet.off('disconnect', handleBaseDisconnect);
      baseWallet.off('accountChanged', handleBaseAccountChanged);
      baseWallet.off('chainChanged', handleBaseChainChanged);

      stacksWallet.off('connect', handleStacksConnect);
      stacksWallet.off('disconnect', handleStacksDisconnect);
    };
  }, [baseWallet, stacksWallet]);

  const connectBase = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const address = await baseWallet.connect();
      setBaseAddress(address);

      // Try to switch to Base network
      try {
        await baseWallet.switchToBase();
        const chainId = await baseWallet.getChainId();
        setBaseChainId(chainId);
      } catch (switchError) {
        console.warn('Could not switch to Base network:', switchError);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect Base wallet');
      console.error('Base connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [baseWallet]);

  const disconnectBase = useCallback(async () => {
    try {
      await baseWallet.disconnect();
      setBaseAddress(null);
      setBaseChainId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect Base wallet');
      console.error('Base disconnection error:', err);
    }
  }, [baseWallet]);

  const connectStacks = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const address = await stacksWallet.connect();
      setStacksAddress(address);
    } catch (err: any) {
      setError(err.message || 'Failed to connect Stacks wallet');
      console.error('Stacks connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  }, [stacksWallet]);

  const disconnectStacks = useCallback(async () => {
    try {
      await stacksWallet.disconnect();
      setStacksAddress(null);
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect Stacks wallet');
      console.error('Stacks disconnection error:', err);
    }
  }, [stacksWallet]);

  const switchToBase = useCallback(async () => {
    try {
      await baseWallet.switchToBase();
      const chainId = await baseWallet.getChainId();
      setBaseChainId(chainId);
    } catch (err: any) {
      setError(err.message || 'Failed to switch to Base network');
      console.error('Network switch error:', err);
    }
  }, [baseWallet]);

  return {
    // Base wallet
    baseAddress,
    baseChainId,
    connectBase,
    disconnectBase,
    switchToBase,
    baseWallet,

    // Stacks wallet
    stacksAddress,
    connectStacks,
    disconnectStacks,
    stacksWallet,

    // Shared state
    isConnecting,
    error,
    clearError: () => setError(null),
  };
}
