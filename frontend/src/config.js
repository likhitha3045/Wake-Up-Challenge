/**
 * Wake-Up Challenge - Smart Contract Config
 * Network: Sepolia Testnet
 * Chain ID: 11155111
 */

export const CONTRACT_CONFIG = {
  SEPOLIA_CHAIN_ID: 11155111,
  SEPOLIA_RPC: 'https://sepolia-rpc.publicnode.com',
  SEPOLIA_EXPLORER: 'https://sepolia.etherscan.io',
  
  // Contract addresses (update after deployment)
  // Prefer the environment variable; if not present use zero address to avoid invalid receiver errors
  WAKEUP_CONTRACT: process.env.REACT_APP_CONTRACT_ADDRESS || '',
  ORACLE_CONTRACT: process.env.REACT_APP_ORACLE_ADDRESS || '',
  
  // Backend config
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  
  // Timeouts
  TX_TIMEOUT: 60000, // 60 seconds
  GAS_MULTIPLIER: 1.2,
  
  // Default values
  DEFAULT_DEPOSIT: '0.001', // ETH
  DEFAULT_DURATION: 7, // days
  DEFAULT_WAKEUP_TIME: 28800, // 8 AM UTC in seconds
};

export const CHALLENGE_STATUS = {
  ACTIVE: 0,
  COMPLETED: 1,
  FAILED: 2,
  CANCELLED: 3,
};

export const GAS_ESTIMATES = {
  CREATE_CHALLENGE: 100000,
  CONFIRM_WAKEUP: 100000,
  FINALIZE_CHALLENGE: 100000,
  CREATE_SOCIAL: 100000,
};
