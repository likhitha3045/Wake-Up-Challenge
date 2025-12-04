import React from 'react';

const TransactionModal = ({ transaction, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FFB800';
      case 'success':
        return '#10B981';
      case 'failed':
        return '#EF4444';
      default:
        return '#667EEA';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'success':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Transaction Details</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="transaction-details">
          <div className="detail-row">
            <span className="label">Status:</span>
            <span className="value" style={{ color: getStatusColor(transaction.status) }}>
              {getStatusEmoji(transaction.status)} {transaction.status.toUpperCase()}
            </span>
          </div>

          <div className="detail-row">
            <span className="label">Hash:</span>
            <span className="value monospace">{transaction.hash}</span>
          </div>

          <div className="detail-row">
            <span className="label">From:</span>
            <span className="value monospace">{transaction.from}</span>
          </div>

          <div className="detail-row">
            <span className="label">To:</span>
            <span className="value monospace">{transaction.to}</span>
          </div>

          <div className="detail-row">
            <span className="label">Value:</span>
            <span className="value">{transaction.value} Ξ</span>
          </div>

          <div className="detail-row">
            <span className="label">Gas Used:</span>
            <span className="value">{transaction.gas}</span>
          </div>

          <div className="detail-row">
            <span className="label">Timestamp:</span>
            <span className="value">{new Date(transaction.timestamp).toLocaleString()}</span>
          </div>
        </div>

        <div className="modal-actions">
          <a 
            href={`https://sepolia.etherscan.io/tx/${transaction.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            View on Etherscan
          </a>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <style>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
          }

          .modal-content {
            background: white;
            border-radius: 12px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
          }

          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 15px;
          }

          .modal-header h2 {
            font-size: 22px;
            color: #333;
            margin: 0;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            transition: color 0.3s;
          }

          .close-btn:hover {
            color: #333;
          }

          .transaction-details {
            margin: 20px 0;
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: #f8f8f8;
            border-radius: 8px;
          }

          .label {
            font-weight: 600;
            color: #666;
            font-size: 14px;
          }

          .value {
            color: #333;
            font-size: 14px;
            word-break: break-all;
          }

          .monospace {
            font-family: 'Courier New', monospace;
            font-size: 12px;
          }

          .modal-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            border-top: 2px solid #f0f0f0;
            padding-top: 15px;
          }

          .modal-actions .btn {
            flex: 1;
          }
        `}</style>
      </div>
    </div>
  );
};

export default TransactionModal;
