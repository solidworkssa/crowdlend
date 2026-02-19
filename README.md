# CrowdLend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-363636)](contracts/base/src/)
[![Clarity](https://img.shields.io/badge/Clarity-v4-5546FF)](contracts/stacks/contracts/)

Peer-to-peer micro-lending protocol

## Overview

CrowdLend is a decentralized application built on both Base (Ethereum L2) and Stacks (Bitcoin L2). It leverages the security of both chains to provide a robust and trustless experience.

## Features

- Dual-chain smart contract architecture (Solidity + Clarity)
- Modern Next.js frontend with TypeScript
- Wallet integration for MetaMask, Coinbase Wallet, Leather, and Xverse
- Foundry test suite for Solidity contracts
- Clarinet integration for Clarity development

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test
```

## Contracts

### Base (Solidity)

```bash
cd contracts/base
forge build          # Compile
forge test -vvv      # Run tests
forge script script/Deploy.s.sol --broadcast --rpc-url $RPC_URL  # Deploy
```

### Stacks (Clarity)

```bash
cd contracts/stacks
clarinet check       # Validate
clarinet test        # Run tests
clarinet console     # Interactive REPL
```

## Project Structure

```
├── apps/web/              # Next.js frontend application
│   ├── app/               # App router pages
│   ├── components/        # UI components
│   └── hooks/             # Custom React hooks
├── contracts/
│   ├── base/              # Solidity contracts (Foundry)
│   │   ├── src/           # Source contracts
│   │   ├── test/          # Test files
│   │   └── script/        # Deployment scripts
│   └── stacks/            # Clarity contracts (Clarinet)
│       └── contracts/     # Source contracts
└── packages/
    ├── shared/            # Shared types and utilities
    ├── base-adapter/      # EVM wallet adapter
    └── stacks-adapter/    # Stacks wallet adapter
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reporting.

## License

[MIT](LICENSE)

---

Built by [solidworkssa](https://github.com/solidworkssa)
