// src/App.js
import React, { useState, useEffect, useMemo } from 'react';
import Web3 from 'web3';
import axios from 'axios';
import './App.css';
import MetaMaskConnect from './components/MetaMaskConnect';
import Dashboard from './components/Dashboard';
import CreateChallenge from './components/CreateChallenge';
import Leaderboard from './components/Leaderboard';
import Navigation from './components/Navigation';

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [balance, setBalance] = useState('0');
  const [networkId, setNetworkId] = useState(null);
  const [missingSepoliaAddressAlerted, setMissingSepoliaAddressAlerted] = useState(false);

  // Sepolia chain id hex for wallet RPC methods, numeric comparisons use 11155111
  const SEPOLIA_CHAIN_ID = '0xaa36a7'; // hex for 11155111
  const SEPOLIA_CONTRACT = process.env.REACT_APP_CONTRACT_ADDRESS || '0xd11fbd82600503a8181a0e1297457a8832162a17'; // set in .env.local
  const LOCALHOST_CONTRACT = process.env.REACT_APP_LOCALHOST_CONTRACT || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  // Contract ABI (trimmed / keep in sync with your Solidity)
  const CONTRACT_ABI = [
    {
      "inputs": [
        { "internalType": "uint256", "name": "_depositAmount", "type": "uint256" },
        { "internalType": "uint256", "name": "_wakeUpTime", "type": "uint256" },
        { "internalType": "uint256", "name": "_durationDays", "type": "uint256" }
      ],
      "name": "createChallenge",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "_challengeId", "type": "uint256" }],
      "name": "confirmWakeUp",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "_challengeId", "type": "uint256" }],
      "name": "finalizeChallenge",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
      "name": "getUserProfile",
      "outputs": [
        { "internalType": "address", "name": "userAddress", "type": "address" },
        { "internalType": "uint256", "name": "totalDeposited", "type": "uint256" },
        { "internalType": "uint256", "name": "totalBurned", "type": "uint256" },
        { "internalType": "uint256", "name": "totalReturned", "type": "uint256" },
        { "internalType": "uint256", "name": "successfulChallenges", "type": "uint256" },
        { "internalType": "uint256", "name": "failedChallenges", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // Always run connectWallet effect on mount (hooks order stable)
  useEffect(() => {
    connectWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine contract address based on networkId in a stable way
  const CONTRACT_ADDRESS = useMemo(() => {
    if (networkId === 11155111) {
      return SEPOLIA_CONTRACT || '';
    }
    return LOCALHOST_CONTRACT;
  }, [networkId, SEPOLIA_CONTRACT, LOCALHOST_CONTRACT]);

  // If Sepolia selected but no address provided, show message and alert once
  useEffect(() => {
    if (networkId === 11155111 && !SEPOLIA_CONTRACT && !missingSepoliaAddressAlerted) {
      // Non-blocking notification (only once)
      // Consider showing a nicer in-app UI modal instead of alert if preferred.
      alert(
        '⚠️ Sepolia contract address not set in .env.local\n\nPlease:\n1. Deploy to Sepolia: npx hardhat run scripts/deploy.js --network sepolia\n2. Copy the deployed address to REACT_APP_CONTRACT_ADDRESS in .env.local\n3. Restart the app'
      );
      setMissingSepoliaAddressAlerted(true);
      console.warn('Sepolia contract address missing. Using UI fallback.');
    }
  }, [networkId, SEPOLIA_CONTRACT, missingSepoliaAddressAlerted]);

  // Wallet connect & setup
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        console.error('MetaMask not detected');
        alert('Please install MetaMask browser extension to use this app!');
        return;
      }

      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        setAccount(null);
        return;
      }
      setAccount(accounts[0]);

      // Determine network
      const chainId = await web3Instance.eth.net.getId();
      setNetworkId(chainId);
      console.log('Connected to network ID:', chainId);

      // Decide contract address to use
      let contractAddr = LOCALHOST_CONTRACT;
      if (chainId === 11155111) {
        contractAddr = SEPOLIA_CONTRACT || '';
      }

      // If chain is not Sepolia or localhost, try switching to Sepolia
      if (chainId !== 11155111 && chainId !== 31337 && chainId !== 1337) {
        try {
          await switchToSepolia();
        } catch (e) {
          console.warn('Could not switch to Sepolia automatically:', e);
        }
      }

      // Initialize contract instance if address available
      if (contractAddr) {
        try {
          const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, contractAddr);
          setContract(contractInstance);
        } catch (ciErr) {
          console.error('Failed to create contract instance:', ciErr);
          setContract(null);
        }
      } else {
        setContract(null);
      }

      // Get balance
      const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
      setBalance(parseFloat(balanceEth).toFixed(4));

      // Listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    } catch (error) {
      console.error('MetaMask connection error:', error);
      alert(`Connection failed: ${error && error.message ? error.message : error}`);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (!accounts || accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      console.log('Switched to Sepolia testnet');
    } catch (switchError) {
      if (switchError && switchError.code === 4902) {
        // Add Sepolia network
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: SEPOLIA_CHAIN_ID,
              chainName: 'Sepolia Testnet',
              rpcUrls: ['https://sepolia-rpc.publicnode.com', 'https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
              nativeCurrency: {
                name: 'Sepolia ETH',
                symbol: 'ETH',
                decimals: 18,
              }
            }],
          });
          console.log('Added Sepolia network to MetaMask');
        } catch (addError) {
          console.error('Error adding Sepolia network:', addError);
          throw addError;
        }
      } else {
        console.error('Error switching to Sepolia:', switchError);
        throw switchError;
      }
    }
  };

  // createChallenge - ensure contract & address exist before sending
  const createChallenge = async (depositAmount, wakeUpTime, durationDays) => {
    try {
      setLoading(true);

      if (!account || !web3) {
        alert('Please connect wallet first');
        return;
      }
      if (!CONTRACT_ADDRESS) {
        alert('Contract address is not set for the current network');
        return;
      }
      if (!contract) {
        alert('Contract instance not initialized');
        return;
      }

      const weiAmount = web3.utils.toWei(depositAmount.toString(), 'ether');

      // Prepare transaction data
      const txData = contract.methods.createChallenge(
        weiAmount,
        wakeUpTime,
        durationDays
      ).encodeABI();

      // Estimate gas
      let estimatedGas;
      try {
        estimatedGas = await web3.eth.estimateGas({
          from: account,
          to: CONTRACT_ADDRESS,
          value: weiAmount,
          data: txData,
        });
        estimatedGas = Math.ceil(Number(estimatedGas) * 1.2); // add buffer
        console.log('Estimated gas:', estimatedGas);
      } catch (gasError) {
        console.warn('Gas estimation failed, using fallback gas:', gasError);
        estimatedGas = 300000;
      }

      // Send tx
      const txReceipt = await web3.eth.sendTransaction({
        from: account,
        to: CONTRACT_ADDRESS,
        value: weiAmount,
        data: txData,
        gas: estimatedGas,
      });

      console.log('Transaction receipt:', txReceipt);

      // Try to parse challengeId from logs
      let challengeId = '0';
      try {
        if (txReceipt && Array.isArray(txReceipt.logs) && txReceipt.logs.length > 0) {
          // Attempt decode using same event shape used earlier — fallback to topics if needed
          const decoded = txReceipt.logs
            .map(log => {
              try {
                return web3.eth.abi.decodeLog(
                  [
                    { type: 'uint256', name: 'challengeId', indexed: true },
                    { type: 'address', name: 'user', indexed: true },
                    { type: 'uint256', name: 'depositAmount' },
                    { type: 'uint256', name: 'wakeUpTime' },
                    { type: 'uint256', name: 'duration' }
                  ],
                  log.data,
                  log.topics.slice(1)
                );
              } catch (e) {
                return null;
              }
            })
            .filter(x => x !== null);

          if (decoded.length > 0 && decoded[0].challengeId) {
            challengeId = String(decoded[0].challengeId);
            console.log('Challenge ID from event:', challengeId);
          } else if (txReceipt.logs[0] && txReceipt.logs[0].topics && txReceipt.logs[0].topics.length > 1) {
            // fallback: read numeric value from topic index
            try {
              challengeId = String(web3.utils.hexToNumber(txReceipt.logs[0].topics[1]));
              console.log('Challenge ID from topics:', challengeId);
            } catch (tErr) {
              console.warn('Could not parse challengeId from topics', tErr);
            }
          }
        }
      } catch (parseError) {
        console.warn('Error parsing logs for challengeId:', parseError);
      }

      // Save to backend
      try {
        const backendResponse = await axios.post('http://localhost:5000/api/challenge/create', {
          walletAddress: account,
          transactionHash: txReceipt.transactionHash || String(txReceipt),
          depositAmount,
          wakeUpTime,
          durationDays,
          blockchainChallengeId: challengeId,
        });
        console.log('Backend response:', backendResponse.data);
      } catch (beErr) {
        console.warn('Failed to save challenge to backend:', beErr);
      }

      alert('Challenge created successfully!');
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Error creating challenge: ' + (error && error.message ? error.message : error));
    } finally {
      setLoading(false);
    }
  };

  // If not connected yet, show connect screen (hooks still called above)
  if (!account) {
    return <MetaMaskConnect onConnect={connectWallet} />;
  }

  // Inline notice if Sepolia selected but address missing (does not break hooks)
  const showSepoliaMissing = networkId === 11155111 && !SEPOLIA_CONTRACT;

  return (
    <div className="App">
      <Navigation
        account={account}
        balance={balance}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <div className="container">
        {showSepoliaMissing && (
          <div style={{ padding: 20, border: '1px solid orange', marginBottom: 16 }}>
            <strong>Sepolia contract address not configured.</strong>
            <p>
              Deploy your contract to Sepolia and set <code>REACT_APP_CONTRACT_ADDRESS</code> in your
              <code>.env.local</code>, then restart the app.
            </p>
            <p>Deploy command: <code>npx hardhat run scripts/deploy.js --network sepolia</code></p>
          </div>
        )}

        {currentPage === 'dashboard' && (
          <Dashboard account={account} web3={web3} contract={contract} />
        )}
        {currentPage === 'create' && (
          <CreateChallenge
            account={account}
            web3={web3}
            onCreateChallenge={createChallenge}
            loading={loading}
          />
        )}
        {currentPage === 'leaderboard' && (
          <Leaderboard account={account} />
        )}
      </div>
    </div>
  );
}

export default App;
