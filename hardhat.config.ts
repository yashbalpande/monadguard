import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const config = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    monad_testnet: {
      url: process.env.MONAD_RPC_URL || "https://testnet.monad.xyz/rpc",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      type: "http",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test/contracts",
    artifacts: "./artifacts",
  },
} as HardhatUserConfig;

export default config;
