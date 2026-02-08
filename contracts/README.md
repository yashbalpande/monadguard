# Monad Guard Smart Contracts

On-chain security contracts for the Monad Guard wallet protection system.

## Contracts Overview

### 1. EmergencyGuard
**Purpose:** Emergency freeze mechanism for wallet protection

**Key Features:**
- Activate emergency mode to freeze account
- Designate trusted guardians
- Track frozen accounts with reasons and timestamps

**Functions:**
- `activateEmergency(reason)` - User activates emergency freeze
- `deactivateEmergency()` - User lifts emergency freeze
- `addGuardian(address)` - Add a trusted guardian
- `removeGuardian(address)` - Remove a guardian
- `isFrozen(account)` - Check if account is frozen
- `isGuardian(user, guardian)` - Verify guardian status

### 2. ApprovalManager
**Purpose:** Track and manage token approvals

**Key Features:**
- Track all token approvals with spending limits
- Revoke malicious approvals on-chain
- Query approval history and status
- Identify unlimited approvals (high risk)

**Functions:**
- `trackApproval(token, spender, amount)` - Record a token approval
- `revokeApproval(token, spender)` - Reject an approval
- `getUserApprovals(user)` - Get all active approvals
- `getApprovalCount(user)` - Count active approvals
- `hasApproval(user, token, spender)` - Check if approval exists

### 3. TransactionValidator
**Purpose:** Analyze transactions for security risks

**Key Features:**
- Validate transactions with risk scoring
- Detect suspicious function selectors
- Maintain validation history
- Suspend risky addresses

**Functions:**
- `validateTransaction(target, value, data)` - Analyze a transaction
- `getValidationHistory(user, limit)` - Recent validation results
- `suspendAddress(address, reason)` - Flag a dangerous address
- `unsuspendAddress(address)` - Remove suspension
- `isSuspended(address)` - Check suspension status

**Risk Levels:**
- `LOW` (0-19 points)
- `MEDIUM` (20-49 points)
- `HIGH` (50-79 points)
- `CRITICAL` (80+ points)

## Setup & Deployment

### Prerequisites
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env` and fill in:
```env
MONAD_RPC_URL=https://testnet.monad.xyz/rpc
PRIVATE_KEY=your_private_key_here
MONAD_EXPLORER_KEY=no_key
```

⚠️ **Never commit `.env` to version control!**

### Compile Contracts
```bash
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
```

### Deploy to Monad Testnet
```bash
npx hardhat run scripts/deploy.ts --network monad_testnet
```

After deployment, update your `.env` with the contract addresses:
```env
VITE_EMERGENCY_GUARD_ADDRESS=0x...
VITE_APPROVAL_MANAGER_ADDRESS=0x...
VITE_TRANSACTION_VALIDATOR_ADDRESS=0x...
```

### Verify Contract Requirements
- Solidity ^0.8.20
- OpenZeppelin Contracts (ERC20 interface)
- Network: Monad Testnet (Chain ID: 10143)

## Integration with Frontend

The frontend can interact with these contracts via Wagmi/Viem:

```typescript
import { useContractRead, useContractWrite } from 'wagmi';
import EMERGENCY_GUARD_ABI from '@/abis/EmergencyGuard.json';

// Read function
const { data: isFrozen } = useContractRead({
  address: EMERGENCY_GUARD_ADDRESS,
  abi: EMERGENCY_GUARD_ABI,
  functionName: 'isFrozen',
  args: [userAddress]
});

// Write function
const { write: activateEmergency } = useContractWrite({
  address: EMERGENCY_GUARD_ADDRESS,
  abi: EMERGENCY_GUARD_ABI,
  functionName: 'activateEmergency'
});
```

## Security Considerations

1. **EmergencyGuard**: Multiple signers (guardians) recommended for critical accounts
2. **ApprovalManager**: Requires user to manually trigger revocation (not automatic)
3. **TransactionValidator**: Risk scoring is heuristic-based; always review manually

## Testnet Faucets
- Get MON tokens: https://faucet.monad.xyz/

## Further Development

**Potential Enhancements:**
- ✅ Guardian-based emergency controls
- ✅ Approval revocation automation
- ⏳ MEV protection mechanisms
- ⏳ Cross-chain message signing
- ⏳ Governance-based contract upgrades

## License
MIT
