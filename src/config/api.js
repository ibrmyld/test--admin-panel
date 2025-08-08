// Admin Panel API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://raliux-projects-backend.up.railway.app';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      profile: '/api/auth/profile'
    },
    admin: {
      auth: {
        login: '/api/admin/auth/login',
        logout: '/api/admin/auth/logout',
        profile: '/api/admin/auth/profile',
        verify: '/api/admin/auth/verify'
      },
      redis: {
        stats: '/api/admin/redis/stats',
        keys: '/api/admin/redis/keys',
        key: (keyName) => `/api/admin/redis/key/${keyName}`,
        deleteKey: (keyName) => `/api/admin/redis/key/${keyName}`,
        flush: '/api/admin/redis/flush',
        live: '/api/admin/redis/monitor/live'
      },
      dashboard: {
        overview: '/api/admin/dashboard/overview',
        health: '/api/admin/dashboard/health',
        activity: '/api/admin/dashboard/activity',
        users: '/api/admin/dashboard/users',
        cache: '/api/admin/dashboard/cache'
      }
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