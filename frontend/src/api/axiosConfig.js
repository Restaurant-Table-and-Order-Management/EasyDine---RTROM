import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 120s to allow Render free tier to wake up from hibernation
});

// Request interceptor — attach Bearer token (except on public auth endpoints)
api.interceptors.request.use(
  (config) => {
    const url = config.url || '';
    const isAuthEndpoint = url.startsWith('/auth') || url.startsWith('auth');

    if (isAuthEndpoint) {
      delete config.headers.Authorization;
      return config;
    }

    const stored = localStorage.getItem('easydine-auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        // ignore parse errors
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — unwrap envelope & handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthEndpoint = url.includes('/auth/') || url.startsWith('/auth') || url.startsWith('auth');
    const isTimeout = error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout');
    const isNetworkError = !error.response && (error.message === 'Network Error' || isTimeout);

    // Friendly handling for Render free-tier cold starts
    if (isTimeout) {
      toast.error(
        'Server is waking up (free tier cold start). Please wait ~30 seconds and try again.',
        { duration: 6000, id: 'cold-start-toast' }
      );
      return Promise.reject(error);
    }

    if (isNetworkError) {
      toast.error(
        'Unable to reach server. The cloud server may be waking up, please retry in a moment.',
        { duration: 5000, id: 'network-err-toast' }
      );
      return Promise.reject(error);
    }

    const serverMessage = error.response?.data?.message;

    if (status === 401) {
      if (isAuthEndpoint) {
        // On login / signup, 401 means invalid credentials — NOT an expired session!
        const msg = serverMessage || 'Invalid email or password. Please try again.';
        toast.error(msg);
      } else {
        // On protected authenticated routes, 401 means JWT expired
        localStorage.removeItem('easydine-auth');
        toast.error('Session expired. Please log in again.');
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/login') && !currentPath.startsWith('/signup')) {
          window.location.href = '/login';
        }
      }
    } else if (status === 403) {
      toast.error(serverMessage || 'You do not have permission to perform this action.');
    } else if (status === 404) {
      toast.error(serverMessage || 'Resource not found.');
    } else if (status >= 500) {
      toast.error(serverMessage || 'Server error. Please try again later.');
    } else {
      toast.error(serverMessage || error.message || 'Something went wrong');
    }

    return Promise.reject(error);
  }
);

export default api;

