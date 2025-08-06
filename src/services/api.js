import { createApiUrl } from '../config/api';

// Admin API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://raliux-backend.up.railway.app';

// Get auth token
const getAuthToken = () => {
  try {
    return localStorage.getItem('admin_token') || localStorage.getItem('token');
  } catch (e) {
    console.warn('Token access error:', e);
    return null;
  }
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
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication failed');
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

// Admin API functions
export const adminApi = {
  // Authentication
  login: async (email, password) => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  },

  // Dashboard stats
  getStats: async () => {
    try {
      const response = await apiRequest('/api/admin/stats');
      return await response.json();
    } catch (error) {
      // Fallback data for demo
      return {
        total_posts: 25,
        total_users: 150,
        total_products: 8,
        total_comments: 89
      };
    }
  },

  // Posts management
  getPosts: async () => {
    try {
      const response = await apiRequest('/api/posts');
      return await response.json();
    } catch (error) {
      return [];
    }
  },

  createPost: async (postData) => {
    const response = await apiRequest('/api/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
    return await response.json();
  },

  updatePost: async (id, postData) => {
    const response = await apiRequest(`/api/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
    return await response.json();
  },

  deletePost: async (id) => {
    const response = await apiRequest(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  },
};

export default adminApi;