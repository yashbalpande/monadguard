# MonadGuard

MonadGuard is a wallet safety tool built for the Monad ecosystem.

It helps users avoid scams, phishing, and common Web3 mistakes by warning them before they sign, approve, or interact with risky contracts.

This project was built for a hackathon to demonstrate how fast blockchains like Monad can enable real-time wallet protection.

---

## What problem does MonadGuard solve?

Many Web3 losses happen because users:

- Sign messages without understanding them
- Approve malicious or unlimited token permissions
- Connect wallets to fake websites
- Copy and use scam smart contracts
- React too late when something goes wrong

Once a transaction is confirmed, it cannot be reversed.

MonadGuard focuses on prevention and fast response.

---

## What does MonadGuard do?

MonadGuard protects users in three situations:

### 1. Website signing protection
- Detects wallet connect and signature requests
- Shows what the website is asking for
- Warns if the request looks risky
- Allows users to cancel before signing

### 2. Token approval protection
- Detects ERC-20 approval transactions
- Warns about unlimited approvals
- Shows spender details clearly
- Allows users to revoke approvals
- Triggers emergency mode if approvals are abused

### 3. Scam contract and GitHub repo scanning
- Scans Solidity code or GitHub repositories
- Detects common dangerous patterns
- Shows a simple risk report before use

---

## Emergency Mode

Emergency Mode is a real on-chain safety state.

When active:
- Risky actions are blocked
- Only safe actions are allowed
- Users can revoke approvals or move funds to a safe address

This helps prevent further damage during panic situations.

---

## Why Monad?

MonadGuard relies on fast execution.

Monad’s low latency makes it possible to:
- Detect issues quickly
- Trigger alerts in seconds
- Execute safety actions before more funds are lost

---

## What is real and what is simulated?

Real:
- Wallet connection
- Signing detection
- Approval detection
- Emergency Mode state
- At least one real safety action

Simulated (for demo):
- Scam events
- Exploit scenarios

Simulation is used to demonstrate behavior without real loss.

---

## Tech stack

- Frontend: React, TypeScript, Tailwind CSS
- Wallet: Wagmi, Viem
- Backend: Node.js, Supabase
- Indexing: Envio
- Smart contracts: Solidity, Hardhat

---

## Limitations

- Uses rule-based detection
- Does not guarantee full protection
- Users always have final control

MonadGuard reduces risk but cannot eliminate it completely.

---

## Hackathon demo flow

1. Connect wallet
2. Enable protection rules
3. Trigger a simulated risky action
4. Show warning and Emergency Mode
5. Perform a safety action
6. Show incident log
