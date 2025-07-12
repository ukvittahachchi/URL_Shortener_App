import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const register = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Registration failed';
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Login failed';
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const updateUser = async (email, newPassword) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/auth/user`,
      { email, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to update user';
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await axios.get(`${API_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
  
};