import axios from 'axios';

import {
  clearAuth,
  getToken,
} from '../utils/storage';

import { logger } from '../utils/logger';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  logger.info('API Request', {
    method: config.method,
    url: config.url,
  });

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,

  (error) => {
    logger.error(
      'API Error',
      error.response?.data ||
        error.message
    );

    if (error.response?.status === 401) {
      clearAuth();
    }

    return Promise.reject(error);
  }
);

export default axiosClient;