import { ethers } from 'ethers';
import { MONAD_RPC_URL, MONAD_CHAIN_ID } from './chains';

export const provider = new ethers.JsonRpcProvider(MONAD_RPC_URL, MONAD_CHAIN_ID);

/**
 * Get wallet balance in MON
 */
export async function getWalletBalance(address: string): Promise<string> {
  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0';
  }
}

/**
 * Get token balance (ERC-20)
 */
export async function getTokenBalance(
  tokenAddress: string,
  walletAddress: string
): Promise<string> {
  try {
    const ERC20_ABI = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
    ];
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(walletAddress);
    const decimals = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return '0';
  }
}

/**
 * Get token allowances (approvals) for a wallet
 */
export async function getTokenApprovals(
  walletAddress: string,
  tokenAddress: string,
  spenderAddress: string
): Promise<string> {
  try {
    const ERC20_ABI = [
      'function allowance(address owner, address spender) view returns (uint256)',
      'function decimals() view returns (uint8)',
    ];
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const allowance = await contract.allowance(walletAddress, spenderAddress);
    const decimals = await contract.decimals();
    return ethers.formatUnits(allowance, decimals);
  } catch (error) {
    console.error('Error fetching allowance:', error);
    return '0';
  }
}

/**
 * Monitor wallet for transactions
 */
export async function getRecentTransactions(
  walletAddress: string,
  limit: number = 10
): Promise<ethers.Log[]> {
  try {
    const currentBlock = await provider.getBlockNumber();
    const lookbackBlocks = 5000; // Look back ~6 hours on Monad
    const startBlock = Math.max(0, currentBlock - lookbackBlocks);

    // Get Transfer events where the wallet is sender or receiver
    const filter = {
      fromBlock: startBlock,
      toBlock: currentBlock,
      address: null,
      topics: [ethers.id('Transfer(address,address,uint256)')],
    };

    const logs = await provider.getLogs(filter);
    const transactions = logs
      .filter(
        (log) =>
          log.topics[1]?.toLowerCase().includes(walletAddress.toLowerCase()) ||
          log.topics[2]?.toLowerCase().includes(walletAddress.toLowerCase())
      )
      .slice(-limit);

    return transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
}

/**
 * Track balance changes
 */
export async function trackBalanceChange(
  address: string,
  previousBalance: string,
  currentBalance: string
): Promise<{
  changed: boolean;
  percentChange: number;
  direction: 'increase' | 'decrease';
}> {
  const prev = parseFloat(previousBalance);
  const curr = parseFloat(currentBalance);

  if (prev === 0) return { changed: false, percentChange: 0, direction: 'increase' };

  const percentChange = ((curr - prev) / prev) * 100;
  const changed = Math.abs(percentChange) > 0.1;

  return {
    changed,
    percentChange: Math.round(percentChange * 100) / 100,
    direction: curr > prev ? 'increase' : 'decrease',
  };
}

/**
 * Validate if address is on correct network (Monad)
 */
export async function validateNetwork(): Promise<boolean> {
  try {
    const network = await provider.getNetwork();
    return network.chainId === BigInt(MONAD_CHAIN_ID);
  } catch (error) {
    console.error('Error validating network:', error);
    return false;
  }
}

/**
 * Get current gas price on Monad
 */
export async function getGasPrice(): Promise<string> {
  try {
    const feeData = await provider.getFeeData();
    if (!feeData.gasPrice) return '0';
    return ethers.formatUnits(feeData.gasPrice, 'gwei');
  } catch (error) {
    console.error('Error fetching gas price:', error);
    return '0';
  }
}
