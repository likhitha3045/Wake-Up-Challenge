import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = ({ account }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('global');

  useEffect(() => {
    fetchLeaderboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, account]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);

      let leaderboardRes;
      if (category === 'global') {
        leaderboardRes = await axios.get(
          'http://localhost:5000/api/leaderboard/global?limit=50'
        );
      } else {
        leaderboardRes = await axios.get(
          `http://localhost:5000/api/leaderboard/category/${category}?limit=50`
        );
      }

      setLeaderboard(leaderboardRes.data.leaderboard);

      // Fetch user's rank
      if (account) {
        const rankRes = await axios.get(
          `http://localhost:5000/api/leaderboard/rank/${account}`
        );
        setUserRank(rankRes.data.userRank);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1>Global Leaderboard</h1>
        <p>Compete with others and prove your dedication</p>
      </div>

      {userRank && (
        <div className="user-rank-card">
          <div className="user-rank-content">
            <div className="rank-badge">{userRank.rank}</div>
            <div className="rank-info">
              <h3>{userRank.displayName}</h3>
              <p>{truncateAddress(userRank.walletAddress)}</p>
            </div>
            <div className="rank-stats">
              <span className="stat">Score: {userRank.score}</span>
              <span className="stat">Success: {userRank.successRate}%</span>
              <span className="stat">Challenges: {userRank.successfulChallenges}</span>
            </div>
          </div>
        </div>
      )}

      <div className="leaderboard-tabs">
        <button 
          className={`tab-btn ${category === 'global' ? 'active' : ''}`}
          onClick={() => setCategory('global')}
        >
          Global
        </button>
        <button 
          className={`tab-btn ${category === 'most-successful' ? 'active' : ''}`}
          onClick={() => setCategory('most-successful')}
        >
          Most Successful
        </button>
        <button 
          className={`tab-btn ${category === 'highest-score' ? 'active' : ''}`}
          onClick={() => setCategory('highest-score')}
        >
          Highest Score
        </button>
        <button 
          className={`tab-btn ${category === 'most-active' ? 'active' : ''}`}
          onClick={() => setCategory('most-active')}
        >
          Most Active
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading leaderboard...</div>
      ) : (
        <div className="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Challenges</th>
                <th>Wake-Ups</th>
                <th>Success Rate</th>
                <th>Deposited</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index} className={entry.walletAddress === account ? 'highlight' : ''}>
                  <td className="rank-col">{getMedalEmoji(entry.rank)}</td>
                  <td className="player-col">
                    <div className="player-name">{entry.displayName}</div>
                    <div className="player-address">{truncateAddress(entry.walletAddress)}</div>
                  </td>
                  <td>{entry.successfulChallenges}</td>
                  <td>{entry.totalWakeUps}</td>
                  <td>
                    <span className="success-rate">{entry.successRate}%</span>
                  </td>
                  <td>{parseFloat(entry.totalDeposited).toFixed(2)} Ξ</td>
                  <td className="score"><strong>{entry.score}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
