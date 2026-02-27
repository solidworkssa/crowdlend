# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of CrowdLend seriously. If you believe you have found a security vulnerability, please report it responsibly.

### Do Not

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Do

- Email us at solidworkssa@gmail.com with details
- Include steps to reproduce the issue
- Allow reasonable time for a fix before any public disclosure

## Security Considerations

- All smart contracts should be audited before mainnet deployment
- Use environment variables for sensitive configuration
- Never commit private keys, mnemonics, or API secrets
- Review all dependency updates for known vulnerabilities
- Follow the principle of least privilege in contract design

## Scope

This policy covers:
- Smart contracts in `contracts/`
- Frontend application in `apps/web/`
- Shared packages in `packages/`

