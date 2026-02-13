import React from 'react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">CrowdLend</h1>
        <p>Peer-to-peer micro-lending platform.</p>
      </div>
      
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left gap-4">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold`}>Base Contract</h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Interact with CrowdLend.sol
          </p>
        </div>

         <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-neutral-700 hover:bg-neutral-800/30">
          <h2 className={`mb-3 text-2xl font-semibold`}>Stacks Contract</h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Interact with crowdlend.clar
          </p>
        </div>
      </div>
    </main>
  );
}
