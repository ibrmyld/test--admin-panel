// Admin Panel API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://raliux-backend.up.railway.app';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      profile: '/api/auth/profile'
    },
    admin: {
      stats: '/api/admin/stats',
      users: '/api/admin/users',
      posts: '/api/admin/posts',
      products: '/api/admin/products'
    },
    posts: {
      list: '/api/posts',
      create: '/api/posts',
      update: (id) => `/api/posts/${id}`,
      delete: (id) => `/api/posts/${id}`
    }
  }
};

export const createApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default API_CONFIG;