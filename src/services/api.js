import { createApiUrl } from '../config/api';

// Admin API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://raliux-projects-backend.up.railway.app';

// Get auth token - admin panel httpOnly cookies kullanır
const getAuthToken = () => {
  // Admin panel httpOnly cookies kullanır, token gerekmez
  return null;
};

// API request helper
export const apiRequest = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('/api') 
    ? `${API_BASE_URL}${endpoint}` 
    : `${API_BASE_URL}${endpoint}`;
    
  const token = getAuthToken();
  
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // httpOnly cookies için gerekli
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_login_time');
      window.location.href = '/login';
      throw new Error('Session expired');
    }
    
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (e) {
        // JSON parse error, use default message
      }
      throw new Error(errorMessage);
    }
    
    return response;
    
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Simple API helper
export const api = {
  get: async (endpoint, options = {}) => {
    const { params, ...restOptions } = options;
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value);
        }
      });
      url += `?${searchParams.toString()}`;
    }
    
    const response = await apiRequest(url, { method: 'GET', ...restOptions });
    return await response.json();
  },

  post: async (endpoint, data, options = {}) => {
    const response = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
    return await response.json();
  },

  put: async (endpoint, data, options = {}) => {
    const response = await apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
    return await response.json();
  },

  delete: async (endpoint, options = {}) => {
    const response = await apiRequest(endpoint, {
      method: 'DELETE',
      ...options,
    });
    return await response.json();
  },
};

// Admin API functions
export const adminApi = {
  // Authentication
  login: async (email, password) => {
    return await api.post('/api/admin/auth/login', { email, password });
  },

  logout: async () => {
    return await api.post('/api/admin/auth/logout');
  },

  getProfile: async () => {
    return await api.get('/api/admin/auth/profile');
  },

  verify: async () => {
    return await api.get('/api/admin/auth/verify');
  },

  // Dashboard
  getOverview: async () => {
    return await api.get('/api/admin/dashboard/overview');
  },

  getHealth: async () => {
    return await api.get('/api/admin/dashboard/health');
  },

  getActivity: async (params = {}) => {
    return await api.get('/api/admin/dashboard/activity', { params });
  },

  // Redis Management
  getRedisStats: async () => {
    return await api.get('/api/admin/redis/stats');
  },

  getRedisKeys: async (pattern = '*') => {
    return await api.get('/api/admin/redis/keys', { params: { pattern } });
  },

  getRedisKey: async (keyName) => {
    return await api.get(`/api/admin/redis/key/${keyName}`);
  },

  deleteRedisKey: async (keyName) => {
    return await api.delete(`/api/admin/redis/key/${keyName}`);
  },

  flushRedis: async () => {
    return await api.post('/api/admin/redis/flush');
  },

  // Posts management
  getPosts: async () => {
    try {
      const response = await api.get('/api/posts');
      return response;
    } catch (error) {
      return [];
    }
  },

  createPost: async (postData) => {
    return await api.post('/api/posts', postData);
  },

  updatePost: async (id, postData) => {
    return await api.put(`/api/posts/${id}`, postData);
  },

  deletePost: async (id) => {
    return await api.delete(`/api/posts/${id}`);
  },
};

export default adminApi;