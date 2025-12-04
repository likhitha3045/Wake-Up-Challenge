/**
 * Utility Functions
 */

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEther = (wei) => {
  if (!wei) return '0';
  return (wei / 1e18).toFixed(4);
};

export const parseEther = (eth) => {
  return (eth * 1e18).toString();
};

export const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString();
};

export const formatDateTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

export const getTimeUntilChallenge = (endTime) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = endTime - now;

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const calculateSuccessRate = (completed, total) => {
  if (total === 0) return 0;
  return ((completed / total) * 100).toFixed(2);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'ACTIVE':
      return 'blue';
    case 'COMPLETED':
      return 'green';
    case 'FAILED':
      return 'red';
    default:
      return 'gray';
  }
};

export const getStatusEmoji = (status) => {
  switch (status) {
    case 'ACTIVE':
      return '⏳';
    case 'COMPLETED':
      return '✅';
    case 'FAILED':
      return '❌';
    default:
      return '❓';
  }
};

export const convertSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const convertTimeToSeconds = (hours, minutes) => {
  return hours * 3600 + minutes * 60;
};

export const isValidWalletAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const calculateScore = (successfulChallenges, totalWakeUps) => {
  return (successfulChallenges * 100) + totalWakeUps;
};

export const sortByScore = (users) => {
  return users.sort((a, b) => calculateScore(b.successfulChallenges, b.totalWakeUps) - calculateScore(a.successfulChallenges, a.totalWakeUps));
};

export const groupChallengesByStatus = (challenges) => {
  return {
    active: challenges.filter(c => c.status === 'ACTIVE'),
    completed: challenges.filter(c => c.status === 'COMPLETED'),
    failed: challenges.filter(c => c.status === 'FAILED'),
  };
};
