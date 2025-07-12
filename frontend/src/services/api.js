import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const shortenUrl = async (originalUrl, customCode = '') => {
  try {
    const response = await api.post('/url/shorten', { originalUrl, customCode });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to shorten URL';
  }
};

export const getUrlStats = async (shortCode) => {
  try {
    const response = await api.get(`/url/stats/${shortCode}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to get URL stats';
  }
};

export const getUserUrls = async () => {
  try {
    const response = await api.get('/url/history');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to get user URLs';
  }
};