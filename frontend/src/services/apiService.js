/**
 * API Service - Backend communication
 */

import axios from 'axios';
import { CONTRACT_CONFIG } from '../config';

const API_BASE_URL = CONTRACT_CONFIG.BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const authService = {
  register: (walletAddress, email) =>
    api.post('/api/auth/register', { walletAddress, email }),
  
  login: (walletAddress) =>
    api.post('/api/auth/login', { walletAddress }),
  
  verify: (walletAddress) =>
    api.post('/api/auth/verify', { walletAddress }),
  
  updateProfile: (walletAddress, data) =>
    api.put('/api/auth/profile', { walletAddress, ...data }),
};

// Challenge endpoints
export const challengeService = {
  getUserChallenges: (walletAddress) =>
    api.get(`/api/challenge/user/${walletAddress}`),
  
  getChallenge: (challengeId) =>
    api.get(`/api/challenge/${challengeId}`),
  
  createChallenge: (data) =>
    api.post('/api/challenge/create', data),
  
  confirmWakeUp: (challengeId, data) =>
    api.post(`/api/challenge/${challengeId}/wakeup`, data),
  
  finalizeChallenge: (challengeId, data) =>
    api.post(`/api/challenge/${challengeId}/finalize`, data),
  
  getStats: (walletAddress) =>
    api.get(`/api/challenge/stats/${walletAddress}`),
};

// Oracle endpoints
export const oracleService = {
  verifyActivity: (data) =>
    api.post('/api/oracle/verify-activity', data),
  
  getActivityHistory: (walletAddress) =>
    api.get(`/api/oracle/activity/${walletAddress}`),
  
  linkFitnessApp: (data) =>
    api.post('/api/oracle/link-fitness-app', data),
  
  syncActivity: (data) =>
    api.post('/api/oracle/sync-activity', data),
  
  getConfig: () =>
    api.get('/api/oracle/config'),
};

// Leaderboard endpoints
export const leaderboardService = {
  getGlobal: (limit = 50, offset = 0) =>
    api.get('/api/leaderboard/global', { params: { limit, offset } }),
  
  getUserRank: (walletAddress) =>
    api.get(`/api/leaderboard/rank/${walletAddress}`),
  
  getCategory: (category, limit = 50) =>
    api.get(`/api/leaderboard/category/${category}`, { params: { limit } }),
  
  getSocialChallengeLeaderboard: (socialChallengeId) =>
    api.get(`/api/leaderboard/social-challenges/${socialChallengeId}`),
};

// User endpoints
export const userService = {
  getProfile: (walletAddress) =>
    api.get(`/api/user/${walletAddress}`),
  
  updateProfile: (walletAddress, data) =>
    api.put(`/api/user/${walletAddress}`, data),
  
  getFriends: (walletAddress) =>
    api.get(`/api/user/${walletAddress}/friends`),
  
  addFriend: (walletAddress, friendAddress) =>
    api.post(`/api/user/${walletAddress}/friends/add`, { friendAddress }),
};

// Error handler
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.error || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;
