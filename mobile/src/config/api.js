import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure a URL base da API
const API_URL = 'https://vinylvault-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@vinylvault:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado - fazer logout
      await AsyncStorage.removeItem('@vinylvault:token');
      await AsyncStorage.removeItem('@vinylvault:user');
    }
    return Promise.reject(error);
  }
);

export default api;

