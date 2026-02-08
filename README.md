# MonadGuard

MonadGuard is a safety tool for Web3 users.

It helps protect users from scams, phishing, and common on-chain mistakes by warning them early and allowing fast safety actions.  
This project was built for a hackathon to show how wallet protection can work better on fast blockchains like Monad.

This is not a trading app.  
This is a protection layer.

---

## What problem does MonadGuard solve?

Most people do not lose money in Web3 because they are bad at trading.  
They lose money because they:

- Sign messages without understanding them
- Approve the wrong contract
- Give unlimited token approvals
- Interact with fake or malicious websites
- Copy and use scam smart contracts from GitHub
- React too late when something goes wrong

Once a transaction is confirmed on-chain, it cannot be undone.

MonadGuard focuses on stopping damage **before or during** these moments.

---

## What does MonadGuard do?

MonadGuard watches for risky actions and responds in seconds.

It protects users in three real situations.

---

## 1. Website signing protection

When a user connects a wallet or signs a message on a website:

- MonadGuard detects the signing request
- Shows what the website is asking for
- Checks for risky or reusable signatures
- Warns the user if the request looks dangerous
- Allows the user to cancel before signing

This helps prevent phishing and blind signing.

---

## 2. Token approval protection

When a user tries to approve a token:

- MonadGuard detects ERC-20 approval transactions
- Warns about unlimited approvals
- Warns about unknown or suspicious spender contracts
- Monitors approval usage after signing
- Allows instant revocation of approvals
- Triggers Emergency Mode if approval is abused

This helps prevent approval-based wallet drains.

---

## 3. Scam contract and GitHub repo scanning

When a user pastes a smart contract or GitHub repository:

- MonadGuard scans Solidity code
- Detects common dangerous patterns such as:
  - hidden withdraw functions
  - owner-only drain logic
  - delegatecall usage
  - obfuscated code blocks
- Generates a simple risk report
- Warns the user before deployment or use

This helps developers and users avoid copying scam code.

---

## What is Emergency Mode?

Emergency Mode is a real on-chain safety state.

When Emergency Mode is active:
- Risky actions are blocked
- Only safe actions are allowed, such as:
  - revoking token approvals
  - transferring funds to a safe address
- The user clearly sees that the wallet is in a restricted state

Emergency Mode exists to prevent panic actions from causing more damage.

---

## Why Monad?

MonadGuard is designed for fast blockchains.

On slow chains, detecting and reacting to problems can take too long.  
On Monad:

- Blocks are fast
- Monitoring can run frequently
- Emergency actions can execute in seconds

This makes real-time wallet protection possible.

---

## What is real and what is simulated?

For the hackathon:

Real:
- Wallet connection
- Signing detection
- Approval detection
- Emergency Mode state
- At least one real safety action (such as approval revocation)

Simulated:
- Scam events
- Exploit scenarios
- Some risk signals

Simulation is used only to demonstrate behavior without real loss.

---

## Tech stack

- Frontend: Next.js, React, Tailwind CSS
- Wallet authentication: Privy
- Backend: Node.js, Supabase
- Indexing: Envio
- Smart contracts: Solidity
- Oracles: Pyth or RedStone

---

## Project goals

MonadGuard is not trying to replace existing security products.

The goal is to show:
- How wallet safety can be user-controlled
- How fast chains enable better protection
- How simple rules and clear UX can reduce losses

---

## Limitations

- Detection is based on rules and heuristics
- This does not guarantee full protection
- Users always have final control

MonadGuard is meant to reduce risk, not eliminate it completely.

---

## Hackathon demo flow

1. Connect wallet
2. Enable protection rules
3. Trigger a simulated risky action
4. Show warning and Emergency Mode
5. Perform a safety action
6. Show incident log

---

## License

This project is for educational and hackathon purposes.
