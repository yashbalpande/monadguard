import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting deployment on Monad testnet...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📍 Deploying with account: ${deployer.address}`);
  console.log(`💰 Account balance: ${ethers.formatEther(await ethers.provider.getBalance(deployer.address))} MON\n`);

  try {
    // Deploy EmergencyGuard
    console.log("📤 Deploying EmergencyGuard contract...");
    const EmergencyGuard = await ethers.getContractFactory("EmergencyGuard");
    const emergencyGuard = await EmergencyGuard.deploy();
    await emergencyGuard.waitForDeployment();
    const emergencyGuardAddress = await emergencyGuard.getAddress();
    console.log(`✅ EmergencyGuard deployed: ${emergencyGuardAddress}\n`);

    // Deploy ApprovalManager
    console.log("📤 Deploying ApprovalManager contract...");
    const ApprovalManager = await ethers.getContractFactory("ApprovalManager");
    const approvalManager = await ApprovalManager.deploy();
    await approvalManager.waitForDeployment();
    const approvalManagerAddress = await approvalManager.getAddress();
    console.log(`✅ ApprovalManager deployed: ${approvalManagerAddress}\n`);

    // Deploy TransactionValidator
    console.log("📤 Deploying TransactionValidator contract...");
    const TransactionValidator = await ethers.getContractFactory("TransactionValidator");
    const transactionValidator = await TransactionValidator.deploy();
    await transactionValidator.waitForDeployment();
    const transactionValidatorAddress = await transactionValidator.getAddress();
    console.log(`✅ TransactionValidator deployed: ${transactionValidatorAddress}\n`);

    // Summary
    console.log("═══════════════════════════════════════════════════════════");
    console.log("✨ Deployment Complete!");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(`EmergencyGuard:      ${emergencyGuardAddress}`);
    console.log(`ApprovalManager:     ${approvalManagerAddress}`);
    console.log(`TransactionValidator: ${transactionValidatorAddress}`);
    console.log("═══════════════════════════════════════════════════════════\n");

    console.log("📝 Update your .env file with these addresses:");
    console.log(`VITE_EMERGENCY_GUARD_ADDRESS=${emergencyGuardAddress}`);
    console.log(`VITE_APPROVAL_MANAGER_ADDRESS=${approvalManagerAddress}`);
    console.log(`VITE_TRANSACTION_VALIDATOR_ADDRESS=${transactionValidatorAddress}`);

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exitCode = 1;
  }
}

main();
