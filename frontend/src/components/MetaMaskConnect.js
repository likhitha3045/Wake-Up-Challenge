import React from 'react';
import '../App.css';

const MetaMaskConnect = ({ onConnect }) => {
  const handleClick = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask not detected. Please install it from https://metamask.io/');
        return;
      }
      await onConnect();
    } catch (error) {
      console.error('Connection failed:', error);
      alert(`Connection failed: ${error.message}`);
    }
  };

  return (
    <div className="metamask-container">
      <div className="metamask-box">
        <div className="metamask-icon">🦊</div>
        <h1>Wake-Up Challenge</h1>
        <p>Smart Contract-Based Wake-Up Challenge System</p>
        <p className="subtitle">Get your deposit back by waking up on time every day!</p>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '15px' }}>
          ℹ️ Requires MetaMask on Sepolia Testnet
        </p>
        
        <button className="metamask-button" onClick={handleClick}>
          Connect MetaMask
        </button>
        
        <div className="features">
          <h3>Features:</h3>
          <ul>
            <li>💰 Deposit funds as motivation</li>
            <li>⏰ Set daily wake-up time</li>
            <li>✅ Confirm wake-ups via oracle verification</li>
            <li>🎁 Get deposit back if you succeed</li>
            <li>🔥 Deposit burned if you fail</li>
            <li>👥 Social challenges with friends</li>
            <li>🏆 Compete on global leaderboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MetaMaskConnect;
