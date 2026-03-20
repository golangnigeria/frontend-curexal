import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL, // Proxied to localhost:8080 via vite.config.ts
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor removed as cookies are handled automatically by the browser with withCredentials: true.

// Response interceptor to handle 401s and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't attempt refresh or redirect if we're already trying to login
      if (originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token using the HTTP-only cookie
        await axios.post(`${BASE_URL}/auth/refresh`, {}, {
          withCredentials: true
        });
        
        // No need to setToken manually - backend sets cookies automatically
        
        // Retry original request (cookies will be included)
        return api(originalRequest);
        
      } catch (refreshError) {
        // If refresh fails, log the user out
        useAuthStore.getState().logout();
        
        // Only redirect if we're not already on the login page or trying to login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
