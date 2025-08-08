// Admin Panel API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://raliux-projects-backend.up.railway.app';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  endpoints: {
    // ===== ADMIN AUTH =====
    adminAuth: {
      login: '/api/admin/auth/login',
      logout: '/api/admin/auth/logout',
      verify: '/api/admin/auth/verify',
      profile: '/api/admin/auth/profile'
    },
    
    // ===== ADMIN DASHBOARD =====  
    adminDashboard: {
      overview: '/api/admin/dashboard/overview',
      health: '/api/admin/dashboard/health',
      stats: '/api/admin/dashboard/stats'
    },
    
    // ===== ADMIN REDIS MANAGEMENT =====
    adminRedis: {
      stats: '/api/admin/redis/stats',
      keys: '/api/admin/redis/keys',
      key: (keyName) => `/api/admin/redis/key/${keyName}`,
      deleteKey: (keyName) => `/api/admin/redis/key/${keyName}`,
      flush: '/api/admin/redis/flush'
    },
    
    // ===== ADMIN CONTENT MANAGEMENT =====
    adminContent: {
      posts: {
        list: '/api/admin/posts',
        create: '/api/admin/posts',
        update: (id) => `/api/admin/posts/${id}`,
        delete: (id) => `/api/admin/posts/${id}`,
        publish: (id) => `/api/admin/posts/${id}/publish`,
        unpublish: (id) => `/api/admin/posts/${id}/unpublish`
      },
      users: {
        list: '/api/admin/users',
        detail: (id) => `/api/admin/users/${id}`,
        ban: (id) => `/api/admin/users/${id}/ban`,
        unban: (id) => `/api/admin/users/${id}/unban`,
        role: (id) => `/api/admin/users/${id}/role`
      },
      comments: {
        list: '/api/admin/comments',
        delete: (id) => `/api/admin/comments/${id}`,
        approve: (id) => `/api/admin/comments/${id}/approve`
      }
    },
    
    // ===== PUBLIC API (fallback) =====
    public: {
      posts: '/api/posts',
      auth: '/api/auth'
    }
  }
};

export const createApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default API_CONFIG;