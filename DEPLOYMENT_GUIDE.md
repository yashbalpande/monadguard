# Smart Contract Deployment Guide

This guide walks through deploying the Monad Guard smart contracts to Monad testnet.

## Prerequisites

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Get Native Tokens**
   - Visit https://faucet.monad.xyz/ to get testnet MON tokens
   - You need ~0.5 MON to deploy all 3 contracts

3. **Setup Private Key**
   - Create a `.env` file in the project root
   - Add your wallet's private key (without `0x` prefix):
     ```env
     PRIVATE_KEY=your_private_key_here
     MONAD_RPC_URL=https://testnet.monad.xyz/rpc
     ```
   - ⚠️ **NEVER commit `.env` to version control!**

## Deployment Steps

### 1. Verify Contracts Compile
```bash
npx hardhat compile
```

Output should show:
```
Compiled 3 Solidity files with solc 0.8.20 (evm target: shanghai)
```

### 2. Run Tests (Optional)
```bash
npx hardhat test
```

### 3. Deploy to Monad Testnet
```bash
npx hardhat run scripts/deploy.ts --network monad_testnet
```

**Expected Output:**
```
🚀 Starting deployment on Monad testnet...

📍 Deploying with account: 0x1234...
💰 Account balance: 0.5 MON

📤 Deploying EmergencyGuard contract...
✅ EmergencyGuard deployed: 0xabcd...

📤 Deploying ApprovalManager contract...
✅ ApprovalManager deployed: 0xef01...

📤 Deploying TransactionValidator contract...
✅ TransactionValidator deployed: 0x2345...

═══════════════════════════════════════════════════════════
✨ Deployment Complete!
═══════════════════════════════════════════════════════════
EmergencyGuard:       0xabcd...
ApprovalManager:      0xef01...
TransactionValidator: 0x2345...
═══════════════════════════════════════════════════════════

📝 Update your .env file with these addresses:
VITE_EMERGENCY_GUARD_ADDRESS=0xabcd...
VITE_APPROVAL_MANAGER_ADDRESS=0xef01...
VITE_TRANSACTION_VALIDATOR_ADDRESS=0x2345...
```

### 4. Update Frontend Configuration
Copy the contract addresses from the deployment output and add them to your `.env` file:

```env
VITE_EMERGENCY_GUARD_ADDRESS=0xabcd...
VITE_APPROVAL_MANAGER_ADDRESS=0xef01...
VITE_TRANSACTION_VALIDATOR_ADDRESS=0x2345...
```

### 5. Verify Deployment
You can verify the contracts are deployed by:

1. **Checking the explorer:**
   - Visit https://testnet.monad.xyz
   - Search for each contract address
   - Should see contract bytecode and state

2. **Using Hardhat:**
   ```bash
   npx hardhat run scripts/verify-deployment.ts --network monad_testnet
   ```

## Frontend Integration

Once contracts are deployed and addresses are configured:

1. **React Components** can interact via Wagmi hooks:
   ```typescript
   import { EMERGENCY_GUARD_ABI, CONTRACT_ADDRESSES } from '@/lib/contracts';
   import { useContractRead } from 'wagmi';

   const { data: isFrozen } = useContractRead({
     address: CONTRACT_ADDRESSES.emergencyGuard,
     abi: EMERGENCY_GUARD_ABI,
     functionName: 'isFrozen',
     args: [userAddress]
   });
   ```

2. **Check Contract Status:**
   ```typescript
   import { getContractInfo } from '@/lib/contracts';

   const info = getContractInfo();
   console.log(info.deployed); // true/false
   console.log(info.contracts); // All addresses
   ```

## Troubleshooting

### Error: "Insufficient Gas"
- Solution: Get more MON tokens from faucet or wait for transaction to confirm

### Error: "Invalid network"
- Solution: Verify `MONAD_RPC_URL` in `.env`
- Check: https://testnet.monad.xyz is accessible

### Error: "Private key invalid"
- Solution: Remove `0x` prefix from private key
- Ensure it's 64 hex characters

### Contracts Won't Deploy
1. Clear artifacts: `rm -rf artifacts/`
2. Recompile: `npx hardhat compile`
3. Deploy again: `npx hardhat run scripts/deploy.ts --network monad_testnet`

## Advanced: Custom Deployment

To deploy a single contract:

```bash
npx hardhat run scripts/deploy-single.ts --network monad_testnet
```

To upgrade a contract (if upgradeable):
```bash
npx hardhat run scripts/upgrade.ts --network monad_testnet
```

## Gas Estimates

Typical gas costs on Monad testnet:
- EmergencyGuard: ~150,000 gas (0.001-0.002 MON)
- ApprovalManager: ~250,000 gas (0.002-0.004 MON)
- TransactionValidator: ~200,000 gas (0.001-0.003 MON)

**Total: ~0.006-0.008 MON** for all 3 contracts

## Next Steps

1. ✅ Contracts deployed on testnet
2. ✅ Frontend configured with contract addresses
3. 🔄 Create React components to interact with contracts
4. 🔄 Add transaction signing for user interactions
5. 🔄 Deploy to mainnet when ready

## Links & Resources

- **Monad Testnet:** https://testnet.monad.xyz
- **Monad Faucet:** https://faucet.monad.xyz
- **Hardhat Docs:** https://hardhat.org
- **Contract Code:** `./contracts/ `

## Support

For deployment issues:
1. Check `.env` configuration
2. Verify wallet has MON tokens
3. Review Hardhat compilation output
4. Check Monad testnet status

For code issues:
1. Review contract source: `./contracts/`
2. Run local tests: `npx hardhat test`
3. Check deployment script: `./scripts/deploy.ts`
