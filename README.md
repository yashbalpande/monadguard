# Monad Guard

A wallet protection system that monitors your blockchain activity and alerts you to risky transactions before they happen.

## What It Does

Monad Guard watches three types of threats:

1. **Signature Requests** - When a website asks you to sign, we detect if it's a scam trying to impersonate a real service. We catch phishing domains (like `uniswapp.xyz` mimicking Uniswap), unknown websites, and messages that could be replayed.

2. **Token Approvals** - We flag unlimited approvals and track which contracts ask for permission to spend your tokens. The system catches unknown spenders and monitors how your funds are used after you approve.

3. **Contract Code** - You can paste a Solidity contract to scan it for dangerous patterns. We check for access control issues, risky design patterns, and score the overall risk.

When something looks wrong, the system restricts your wallet and gives you a moment to review what's happening.

## Getting Started

### Requirements

- Node.js (v16 or later)
- npm or yarn
- MetaMask or another Web3 wallet

### Installation

```bash
git clone <YOUR_GIT_URL>
cd wallet-sentinel
npm install
npm run dev
```

The app runs on http://localhost:5173 by default.

### Building for Production

```bash
npm run build
```

## How It Works

The system uses a unified emergency engine that tracks your wallet state and checks transactions as they happen. When it detects something risky:

1. You get an alert with details about what triggered it
2. Your wallet gets temporarily restricted
3. You can choose to proceed anyway or cancel

All activity is logged so you can see the history of alerts and actions.

## Tech Stack

- **Vite** - Fast build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Wagmi** - Wallet connection
- **Tailwind CSS** - Styling
- **shadcn/ui** - Components

Runs on Monad Testnet (Chain ID: 10143).

## Limitations

This is pattern-matching detection, not prediction. The system analyzes transactions and contract code using heuristics - it's not perfect and will miss some threats. It also can't catch every scam or exploit. 

Use it as a tool to catch common mistakes and slow yourself down when something looks off.

## Code Structure

```
src/
  components/       - UI components
  contexts/         - Global state (GuardContext)
  lib/              - Detection business logic
  pages/            - Page layouts
  hooks/            - Custom React hooks
```

Key files:
- `GuardContext.tsx` - Central emergency engine and state management
- `signingGuard.ts` - Signature request analysis
- `approvalGuard.ts` - Token approval detection
- `codeSafety.ts` - Solidity contract scanning

## Scam Detection

The system detects when you visit suspicious websites trying to steal your crypto:

- **Domain Impersonation** - Catches `uniswapp.xyz` mimicking `uniswap.org`
- **Phishing Sites** - Flags obvious scams and domain typos
- **Unknown Websites** - Alerts you on first-time domains
- **Malicious Messages** - Detects hex-encoded or replayable signatures

See [SCAM_DETECTION_GUIDE.md](SCAM_DETECTION_GUIDE.md) for detailed examples and how to test it.

