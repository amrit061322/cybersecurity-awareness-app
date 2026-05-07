import api from './api';

export const fetchUserAnalytics = async () => {
  const response = await api.get('/analytics/user');
  return response.data;
};

export const fetchAdminAnalytics = async () => {
  const response = await api.get('/analytics/admin');
  return response.data;
};

