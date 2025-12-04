import React from 'react';

const Navigation = ({ account, balance, currentPage, onPageChange }) => {
  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">🎯</span>
          <h1>Wake-Up Challenge</h1>
        </div>

        <div className="nav-links">
          <button
            className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => onPageChange('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-link ${currentPage === 'create' ? 'active' : ''}`}
            onClick={() => onPageChange('create')}
          >
            ➕ New Challenge
          </button>
          <button
            className={`nav-link ${currentPage === 'leaderboard' ? 'active' : ''}`}
            onClick={() => onPageChange('leaderboard')}
          >
            🏆 Leaderboard
          </button>
        </div>

        <div className="nav-user">
          <div className="balance-display">
            <span className="balance-label">Balance:</span>
            <span className="balance-value">{balance} Ξ</span>
          </div>
          <div className="wallet-info">
            <div className="wallet-address">{truncateAddress(account)}</div>
            <div className="network-badge">Sepolia</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
