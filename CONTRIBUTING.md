# Contributing to CrowdLend

Thank you for considering a contribution to CrowdLend! This guide will help you get started.

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/crowdlend.git`
3. Install dependencies: `pnpm install`
4. Create a feature branch: `git checkout -b feature/your-feature`

## Development

```bash
pnpm dev            # Start the development server
pnpm test           # Run all tests
pnpm test:base      # Test Solidity contracts with Foundry
pnpm test:stacks    # Test Clarity contracts with Clarinet
pnpm lint           # Lint the codebase
```

## Pull Request Process

1. Update documentation for any changed functionality
2. Add or update tests for new features
3. Ensure all tests pass before submitting
4. Write a clear PR description explaining your changes

## Commit Messages

We follow conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation updates
- `test:` test additions or changes
- `refactor:` code restructuring without behavior change

## Questions?

Open an issue or contact solidworkssa@gmail.com.
