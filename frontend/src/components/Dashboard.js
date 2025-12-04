import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ account, web3, contract }) => {
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const fetchUserData = async () => {
    try {
      // Fetch challenges from backend
      const challengesRes = await axios.get(
        `http://localhost:5000/api/challenge/user/${account}`
      );

      // Fetch stats
      const statsRes = await axios.get(
        `http://localhost:5000/api/challenge/stats/${account}`
      );

      setChallenges(challengesRes.data.challenges || []);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const confirmWakeUp = async (challengeId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/challenge/${challengeId}/wakeup`,
        {
          walletAddress: account,
          transactionHash: 'hash_' + Date.now()
        }
      );

      alert('Wake-up confirmed for today!');
      fetchUserData();
    } catch (error) {
      console.error('Error confirming wake-up:', error);
      alert('Error confirming wake-up: ' + error.message);
    }
  };

  const finalizeChallenge = async (challengeId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/challenge/${challengeId}/finalize`,
        {
          walletAddress: account,
          transactionHash: 'hash_' + Date.now(),
          status: 'COMPLETED'
        }
      );

      alert('Challenge finalized!');
      fetchUserData();
    } catch (error) {
      console.error('Error finalizing challenge:', error);
      alert('Error finalizing challenge: ' + error.message);
    }
  };

  const activeChallenges = challenges.filter(c => c.status === 'ACTIVE');
  const completedChallenges = challenges.filter(c => c.status === 'COMPLETED');
  const failedChallenges = challenges.filter(c => c.status === 'FAILED');

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Dashboard</h1>
        <p className="account-info">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalChallenges}</div>
            <div className="stat-label">Total Challenges</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completedChallenges}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.failedChallenges}</div>
            <div className="stat-label">Failed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.successRate}%</div>
            <div className="stat-label">Success Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalWakeUps}</div>
            <div className="stat-label">Total Wake-Ups</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{parseFloat(stats.totalDeposited).toFixed(2)} Ξ</div>
            <div className="stat-label">Total Deposited</div>
          </div>
        </div>
      )}

      <div className="challenges-section">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active ({activeChallenges.length})
          </button>
          <button 
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed ({completedChallenges.length})
          </button>
          <button 
            className={`tab ${activeTab === 'failed' ? 'active' : ''}`}
            onClick={() => setActiveTab('failed')}
          >
            Failed ({failedChallenges.length})
          </button>
        </div>

        <div className="challenges-list">
          {activeTab === 'active' && activeChallenges.map((challenge) => (
            <div key={challenge.id} className="challenge-card">
              <div className="challenge-header">
                <h3>Challenge #{challenge.id}</h3>
                <span className="badge active">Active</span>
              </div>
              <div className="challenge-info">
                <p><strong>Deposit:</strong> {challenge.depositAmount} Ξ</p>
                <p><strong>Wake-Up Time:</strong> {(challenge.wakeUpTime / 3600).toFixed(0)}:00 UTC</p>
                <p><strong>Days Completed:</strong> {challenge.completedDays} / {challenge.durationDays}</p>
                <p><strong>Created:</strong> {new Date(challenge.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="challenge-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => confirmWakeUp(challenge.id)}
                >
                  ✓ Confirm Wake-Up
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => finalizeChallenge(challenge.id)}
                >
                  ✓ Finalize
                </button>
              </div>
            </div>
          ))}

          {activeTab === 'completed' && completedChallenges.map((challenge) => (
            <div key={challenge.id} className="challenge-card completed">
              <div className="challenge-header">
                <h3>Challenge #{challenge.id}</h3>
                <span className="badge completed">✓ Completed</span>
              </div>
              <div className="challenge-info">
                <p><strong>Deposit:</strong> {challenge.depositAmount} Ξ</p>
                <p><strong>Status:</strong> Returned</p>
                <p><strong>Completed At:</strong> {new Date(challenge.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}

          {activeTab === 'failed' && failedChallenges.map((challenge) => (
            <div key={challenge.id} className="challenge-card failed">
              <div className="challenge-header">
                <h3>Challenge #{challenge.id}</h3>
                <span className="badge failed">✗ Failed</span>
              </div>
              <div className="challenge-info">
                <p><strong>Deposit:</strong> {challenge.depositAmount} Ξ</p>
                <p><strong>Status:</strong> Burned</p>
                <p><strong>Failed At:</strong> {new Date(challenge.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
