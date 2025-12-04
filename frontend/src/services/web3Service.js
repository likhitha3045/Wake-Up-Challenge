/**
 * Web3 Service - Handles blockchain interactions
 */

import Web3 from 'web3';
import { CONTRACT_CONFIG } from './config';

let web3Instance = null;

export const initWeb3 = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  web3Instance = new Web3(window.ethereum);
  return web3Instance;
};

export const getWeb3 = () => {
  if (!web3Instance) {
    throw new Error('Web3 not initialized');
  }
  return web3Instance;
};

export const connectWallet = async () => {
  try {
    const web3 = await initWeb3();
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts available');
    }

    const account = accounts[0];
    const balance = await web3.eth.getBalance(account);
    const balanceEth = web3.utils.fromWei(balance, 'ether');

    return {
      account,
      balance: parseFloat(balanceEth).toFixed(4),
      web3
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const switchToSepolia = async () => {
  const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in hex

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: SEPOLIA_CHAIN_ID,
            chainName: 'Sepolia Testnet',
            rpcUrls: [CONTRACT_CONFIG.SEPOLIA_RPC],
            blockExplorerUrls: [CONTRACT_CONFIG.SEPOLIA_EXPLORER],
            nativeCurrency: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18,
            }
          }],
        });
      } catch (addError) {
        throw addError;
      }
    } else {
      throw switchError;
    }
  }
};

export const getNetworkId = async () => {
  const web3 = getWeb3();
  return await web3.eth.net.getId();
};

export const createChallenge = async (account, depositAmount, wakeUpTime, durationDays, contractABI) => {
  try {
    const web3 = getWeb3();
    const weiAmount = web3.utils.toWei(depositAmount.toString(), 'ether');
    if (!CONTRACT_CONFIG.WAKEUP_CONTRACT || CONTRACT_CONFIG.WAKEUP_CONTRACT === '0x0') {
      throw new Error('WakeUp contract address not set.');
    }
    if (!contractABI) {
      throw new Error('Contract ABI not provided.');
    }
    const contract = new web3.eth.Contract(contractABI, CONTRACT_CONFIG.WAKEUP_CONTRACT);

    const txData = contract.methods.createChallenge(
      weiAmount,
      wakeUpTime,
      durationDays
    ).encodeABI();

    const gasEstimate = await web3.eth.estimateGas({
      from: account,
      to: CONTRACT_CONFIG.WAKEUP_CONTRACT,
      value: weiAmount,
      data: txData,
    });

    const gasPrice = await web3.eth.getGasPrice();
    const tx = await web3.eth.sendTransaction({
      from: account,
      to: CONTRACT_CONFIG.WAKEUP_CONTRACT,
      value: weiAmount,
      data: txData,
      gas: Math.ceil(gasEstimate * 1.2),
      gasPrice: gasPrice,
    });

    return tx;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

export const confirmWakeUp = async (account, challengeId, contractABI) => {
  try {
    const web3 = getWeb3();
    if (!CONTRACT_CONFIG.WAKEUP_CONTRACT || CONTRACT_CONFIG.WAKEUP_CONTRACT === '0x0') {
      throw new Error('WakeUp contract address not set.');
    }
    if (!contractABI) {
      throw new Error('Contract ABI not provided.');
    }
    const contract = new web3.eth.Contract(contractABI, CONTRACT_CONFIG.WAKEUP_CONTRACT);

    const txData = contract.methods.confirmWakeUp(challengeId).encodeABI();

    const gasEstimate = await web3.eth.estimateGas({
      from: account,
      to: CONTRACT_CONFIG.WAKEUP_CONTRACT,
      data: txData,
    });

    const gasPrice = await web3.eth.getGasPrice();
    const tx = await web3.eth.sendTransaction({
      from: account,
      to: CONTRACT_CONFIG.WAKEUP_CONTRACT,
      data: txData,
      gas: Math.ceil(gasEstimate * 1.2),
      gasPrice: gasPrice,
    });

    return tx;
  } catch (error) {
    console.error('Error confirming wake-up:', error);
    throw error;
  }
};

export const finalizeChallenge = async (account, challengeId, contractABI) => {
  try {
    const web3 = getWeb3();
    if (!CONTRACT_CONFIG.WAKEUP_CONTRACT || CONTRACT_CONFIG.WAKEUP_CONTRACT === '0x0') {
      throw new Error('WakeUp contract address not set.');
    }
    if (!contractABI) {
      throw new Error('Contract ABI not provided.');
    }
    const contract = new web3.eth.Contract(contractABI, CONTRACT_CONFIG.WAKEUP_CONTRACT);

    const txData = contract.methods.finalizeChallenge(challengeId).encodeABI();

    const gasEstimate = await web3.eth.estimateGas({
      from: account,
      to: CONTRACT_CONFIG.WAKEUP_CONTRACT,
      data: txData,
    });

    const gasPrice = await web3.eth.getGasPrice();
    const tx = await web3.eth.sendTransaction({
      from: account,
      to: CONTRACT_CONFIG.WAKEUP_CONTRACT,
      data: txData,
      gas: Math.ceil(gasEstimate * 1.2),
      gasPrice: gasPrice,
    });

    return tx;
  } catch (error) {
    console.error('Error finalizing challenge:', error);
    throw error;
  }
};

export const getUserProfile = async (account, contractABI) => {
  try {
    const web3 = getWeb3();
    if (!CONTRACT_CONFIG.WAKEUP_CONTRACT || CONTRACT_CONFIG.WAKEUP_CONTRACT === '0x0') {
      throw new Error('WakeUp contract address not set.');
    }
    if (!contractABI) {
      throw new Error('Contract ABI not provided.');
    }
    const contract = new web3.eth.Contract(contractABI, CONTRACT_CONFIG.WAKEUP_CONTRACT);

    const profile = await contract.methods.getUserProfile(account).call();
    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const getTransactionStatus = async (txHash) => {
  try {
    const web3 = getWeb3();
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    
    if (!receipt) {
      return { status: 'pending', message: 'Transaction pending...' };
    }

    if (receipt.status === 1) {
      return { status: 'success', message: 'Transaction confirmed!', receipt };
    } else {
      return { status: 'failed', message: 'Transaction failed', receipt };
    }
  } catch (error) {
    console.error('Error checking transaction status:', error);
    throw error;
  }
};

export const formatEtherscanLink = (txHash) => {
  return `${CONTRACT_CONFIG.SEPOLIA_EXPLORER}/tx/${txHash}`;
};
