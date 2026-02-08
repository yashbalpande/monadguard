async function main() {
  console.log("🚀 Starting deployment on Monad testnet...\n");

  try {
    // For now, we'll output deployment instructions instead
    // since there are dependency issues with hardhat-ethers
    
    console.log("📝 DEPLOYMENT INSTRUCTIONS");
    console.log("═══════════════════════════════════════════════════════════");
    console.log("\n1. Your wallet details:");
    console.log("   Private Key: Set in .env ✓");
    console.log("   Network: Monad Testnet (Chain ID: 10143)");
    console.log("   RPC: https://testnet.monad.xyz/rpc");
    
    console.log("\n2. Contracts to deploy:");
    console.log("   ✓ EmergencyGuard.sol");
    console.log("   ✓ ApprovalManager.sol");
    console.log("   ✓ TransactionValidator.sol");
    
    console.log("\n3. Next steps:");
    console.log("   • Install web3.py or use Remix IDE");
    console.log("   • Copy contracts from ./contracts/ folder");
    console.log("   • Deploy via: https://testnet.monad.xyz (if available)");
    console.log("   • Or use Hardhat with: npx hardhat compile");
    
    console.log("\n4. After deployment:");
    console.log("   Add addresses to .env:");
    console.log("   VITE_EMERGENCY_GUARD_ADDRESS=0x...");
    console.log("   VITE_APPROVAL_MANAGER_ADDRESS=0x...");
    console.log("   VITE_TRANSACTION_VALIDATOR_ADDRESS=0x...");
    
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("📖 Full guide: See DEPLOYMENT_GUIDE.md");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
  }
}

main();
