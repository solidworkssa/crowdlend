# Crowdlend

Decentralized micro-lending platform

## Overview

Crowdlend provides a decentralized solution for peer-to-peer lending with interest calculation on both Base (EVM) and Stacks blockchains.

## Features

- Multi-chain support (Base and Stacks)
- Transparent on-chain operations
- Secure wallet integration
- Real-time transaction tracking
- Clean, minimal black & white UI

## Technology Stack

### Frontend
- Next.js 14+ with TypeScript
- Tailwind CSS
- pnpm workspaces

### Base (EVM)
- Solidity ^0.8.20
- Foundry
- Reown (WalletConnect)
- ethers v6

### Stacks
- Clarity v4
- Clarinet
- @stacks/connect
- @stacks/transactions

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Foundry
- Clarinet

### Installation

```bash
pnpm install
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
pnpm dev
pnpm test:base
pnpm test:stacks
```

## License

MIT License - see [LICENSE](LICENSE)
