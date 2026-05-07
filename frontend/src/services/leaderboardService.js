import api from './api';

export const fetchLeaderboard = async ({ limit = 20 } = {}) => {
  const response = await api.get('/leaderboard', { params: { limit } });
  return response.data;
};

