'use client';

import { useWallets } from '../hooks/useWallets';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowRight, LayoutDashboard, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function Home() {
  const { baseAddress, stacksAddress, connectBase, connectStacks, disconnectStacks } = useWallets();
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  return (
    <main className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-20">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="border-b-2 border-black sticky top-0 bg-white/90 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-white/60"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">DApp</span>
          </div>
          
          <div className="flex gap-4">
            {!baseAddress ? (
              <button 
                onClick={connectBase}
                className="group flex items-center gap-2 px-5 py-2.5 border-2 border-black hover:bg-black hover:text-white transition-all font-medium text-sm w-40 justify-center"
              >
                <Wallet className="w-4 h-4" />
                <span>Base</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-2 border-black/10">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                <span className="font-mono text-sm font-medium">{baseAddress.slice(0,6)}...{baseAddress.slice(-4)}</span>
              </div>
            )}
            
            {!stacksAddress ? (
              <button 
                onClick={connectStacks}
                className="group flex items-center gap-2 px-5 py-2.5 border-2 border-black hover:bg-black hover:text-white transition-all font-medium text-sm w-40 justify-center"
              >
                <Wallet className="w-4 h-4" />
                <span>Stacks</span>
              </button>
            ) : (
              <button 
                onClick={disconnectStacks}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-2 border-black/10 hover:bg-red-50 hover:border-red-200 transition-all"
                title="Disconnect Stacks"
              >
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="font-mono text-sm font-medium">{stacksAddress.slice(0,6)}...{stacksAddress.slice(-4)}</span>
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative border-b-2 border-black py-32 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto px-6 text-center relative z-10"
        >
          <motion.h1 
            className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.9]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            MULTI<span className="bg-black text-white px-4 mx-2 transform -skew-x-6 inline-block">CHAIN</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 font-medium"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Seamlessly orchestrate interactions across Base (EVM) and Stacks layers.
          </motion.p>
        </motion.div>
      </section>

      {/* Dashboard Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Base Panel */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-gray-100">
              <h2 className="text-4xl font-bold uppercase tracking-tight flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                Base
              </h2>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-wider">EVM Native</span>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 border border-gray-200">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Transaction Value</label>
                <input 
                  type="text" 
                  placeholder="0.00 ETH" 
                  className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black outline-none py-2 text-3xl font-mono transition-colors placeholder:text-gray-300"
                />
              </div>
              <button 
                disabled={!baseAddress}
                className="w-full py-4 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                onClick={() => setTxStatus('pending')}
              >
                {baseAddress ? (
                  <>
                    Execute on Base <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : 'Connect Wallet'}
              </button>
            </div>
          </motion.div>

          {/* Stacks Panel */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-gray-100">
              <h2 className="text-4xl font-bold uppercase tracking-tight flex items-center gap-3">
                 <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                Stacks
              </h2>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold uppercase tracking-wider">Bitcoin L2</span>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 border border-gray-200">
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Contract Action</label>
                <input 
                  type="text" 
                  placeholder="Function Args" 
                  className="w-full bg-transparent border-b-2 border-gray-300 focus:border-black outline-none py-2 text-3xl font-mono transition-colors placeholder:text-gray-300"
                />
              </div>
              <button 
                disabled={!stacksAddress}
                 className="w-full py-4 bg-black text-white font-bold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                 onClick={() => setTxStatus('pending')}
              >
                {stacksAddress ? (
                  <>
                    Sign Stacks Tx <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : 'Connect Wallet'}
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Animation Status Overlay */}
      <AnimatePresence>
        {txStatus !== 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 min-w-[300px]">
              {txStatus === 'pending' && (
                <>
                  <Loader2 className="w-6 h-6 animate-spin text-black" />
                  <div className="font-bold uppercase tracking-wider">Processing...</div>
                </>
              )}
              {txStatus === 'success' && (
                <>
                   <CheckCircle className="w-6 h-6 text-green-600" />
                   <div className="font-bold uppercase tracking-wider">Confirmed</div>
                   <button onClick={() => setTxStatus('idle')} className="ml-auto hover:underline text-sm text-gray-500">Close</button>
                </>
              )}
              {txStatus === 'error' && (
                <>
                   <AlertCircle className="w-6 h-6 text-red-600" />
                   <div className="font-bold uppercase tracking-wider">Failed</div>
                   <button onClick={() => setTxStatus('idle')} className="ml-auto hover:underline text-sm text-gray-500">Close</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
