import { expect } from "chai";
import { ethers } from "hardhat";
import { EmergencyGuard, ApprovalManager, TransactionValidator } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Security Contracts", function () {
  let emergencyGuard: EmergencyGuard;
  let approvalManager: ApprovalManager;
  let transactionValidator: TransactionValidator;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy EmergencyGuard
    const EmergencyGuardFactory = await ethers.getContractFactory("EmergencyGuard");
    emergencyGuard = await EmergencyGuardFactory.deploy();

    // Deploy ApprovalManager
    const ApprovalManagerFactory = await ethers.getContractFactory("ApprovalManager");
    approvalManager = await ApprovalManagerFactory.deploy();

    // Deploy TransactionValidator
    const TransactionValidatorFactory = await ethers.getContractFactory("TransactionValidator");
    transactionValidator = await TransactionValidatorFactory.deploy();
  });

  describe("EmergencyGuard", function () {
    it("Should activate emergency mode", async function () {
      await emergencyGuard.activateEmergency("Account compromised");
      expect(await emergencyGuard.isFrozen(owner.address)).to.be.true;
    });

    it("Should deactivate emergency mode", async function () {
      await emergencyGuard.activateEmergency("Account compromised");
      await emergencyGuard.deactivateEmergency();
      expect(await emergencyGuard.isFrozen(owner.address)).to.be.false;
    });

    it("Should add and verify guardians", async function () {
      await emergencyGuard.addGuardian(addr1.address);
      expect(await emergencyGuard.isGuardian(owner.address, addr1.address)).to.be.true;
    });

    it("Should prevent duplicate emergency activation", async function () {
      await emergencyGuard.activateEmergency("Account compromised");
      await expect(
        emergencyGuard.activateEmergency("Account compromised")
      ).to.be.revertedWith("Already frozen");
    });
  });

  describe("ApprovalManager", function () {
    const tokenAddress = "0x0000000000000000000000000000000000000001";
    const spenderAddress = "0x0000000000000000000000000000000000000002";

    it("Should track token approvals", async function () {
      await approvalManager.trackApproval(tokenAddress, spenderAddress, ethers.parseEther("100"));
      expect(await approvalManager.getApprovalCount(owner.address)).to.equal(1);
    });

    it("Should check if approval exists", async function () {
      await approvalManager.trackApproval(tokenAddress, spenderAddress, ethers.parseEther("100"));
      expect(await approvalManager.hasApproval(owner.address, tokenAddress, spenderAddress)).to.be.true;
    });

    it("Should get user approvals", async function () {
      await approvalManager.trackApproval(tokenAddress, spenderAddress, ethers.parseEther("100"));
      const approvals = await approvalManager.getUserApprovals(owner.address);
      expect(approvals.length).to.equal(1);
      expect(approvals[0].token).to.equal(tokenAddress);
    });
  });

  describe("TransactionValidator", function () {
    it("Should validate low-risk transaction", async function () {
      const result = await transactionValidator.validateTransaction(
        addr1.address,
        ethers.parseEther("1"),
        "0x"
      );
      expect(result.riskLevel).to.equal("LOW");
    });

    it("Should detect large value transfers", async function () {
      const result = await transactionValidator.validateTransaction(
        addr1.address,
        ethers.parseEther("150"),
        "0x"
      );
      expect(result.riskScore).to.be.greaterThan(0);
    });

    it("Should suspend suspicious addresses", async function () {
      await transactionValidator.suspendAddress(addr1.address, "Phishing attempt");
      expect(await transactionValidator.isSuspended(addr1.address)).to.be.true;
    });

    it("Should get validation history", async function () {
      await transactionValidator.validateTransaction(addr1.address, ethers.parseEther("1"), "0x");
      const history = await transactionValidator.getValidationHistory(owner.address, 10);
      expect(history.length).to.be.greaterThan(0);
    });
  });
});
