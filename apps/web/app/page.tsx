'use client'

import { useState } from 'react'

export default function Home() {
  const [baseConnected, setBaseConnected] = useState(false)
  const [stacksConnected, setStacksConnected] = useState(false)
  const [baseAddress, setBaseAddress] = useState<string | null>(null)
  const [stacksAddress, setStacksAddress] = useState<string | null>(null)

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b-2 border-black p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Crowdlend</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                setBaseConnected(!baseConnected)
                setBaseAddress(baseConnected ? null : '0x1234...5678')
              }}
              className="btn"
            >
              {baseConnected ? 'Disconnect Base' : 'Connect Base'}
            </button>
            <button
              onClick={() => {
                setStacksConnected(!stacksConnected)
                setStacksAddress(stacksConnected ? null : 'SP1234...5678')
              }}
              className="btn"
            >
              {stacksConnected ? 'Disconnect Stacks' : 'Connect Stacks'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Wallet Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Base Network</h2>
            <p className="mb-2">Status: {baseConnected ? 'Connected' : 'Not Connected'}</p>
            {baseAddress && <p className="font-mono text-sm">Address: {baseAddress}</p>}
          </div>
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Stacks Network</h2>
            <p className="mb-2">Status: {stacksConnected ? 'Connected' : 'Not Connected'}</p>
            {stacksAddress && <p className="font-mono text-sm">Address: {stacksAddress}</p>}
          </div>
        </div>

        {/* Main Interface */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Crowdlend Interface</h2>
          <p className="mb-6 text-gray-600">
            Connect your wallet to interact with the smart contracts on Base and Stacks.
          </p>
          
          {(baseConnected || stacksConnected) && (
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold">Input Field</label>
                <input type="text" className="input" placeholder="Enter value..." />
              </div>
              <button className="btn-primary">Execute Transaction</button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-12 p-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
          <p>Crowdlend © 2026 | Multi-Chain dApp | MIT License</p>
        </div>
      </footer>
    </main>
  )
}
