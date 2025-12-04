// hardhat.config.cjs
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

function normalizePrivateKey(raw) {
  if (!raw) return [];
  const s = String(raw).trim();

  // remove wrapping quotes if someone accidentally added them
  const unquoted = s.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1").trim();

  const hex = unquoted.startsWith("0x") ? unquoted.slice(2) : unquoted;
  if (!/^[0-9a-fA-F]*$/.test(hex)) {
    throw new Error("PRIVATE_KEY contains non-hex characters. Check .env");
  }
  if (hex.length !== 64) {
    throw new Error(
      `Invalid PRIVATE_KEY length: expected 64 hex chars (32 bytes) but got ${hex.length}.`
    );
  }
  // return with 0x prefix as Hardhat accepts that
  return ["0x" + hex];
}

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/8d1ac2741a3b4ac59a0a869e45fe13ec";
let accounts = [];
try {
  accounts = normalizePrivateKey(process.env.PRIVATE_KEY);
} catch (e) {
  console.error("PRIVATE_KEY validation error:", e.message);
  // fail fast so Hardhat doesn't try to start with a bad key
  process.exit(1);
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/8d1ac2741a3b4ac59a0a869e45fe13ec",
      accounts,
      chainId: 11155111,
    },
    hardhat: { chainId: 31337 },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || "14PDIQH3ZWJI74RDYM8Z4GZTM1DAA19Y65",
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    artifacts: "./artifacts",
  },
};
