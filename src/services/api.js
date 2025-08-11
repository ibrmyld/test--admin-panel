import { API_CONFIG } from '../config/api';
import { createClient } from '@supabase/supabase-js';

// Supabase direkt bağlantı - admin işlemler için
const supabaseUrl = 'https://your-project-id.supabase.co';
const supabaseAnonKey = 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Backend sadece login doğrulama için
const API_BASE_URL = API_CONFIG.BASE_URL;

// Environment variables debug (admin-specific)
console.log('🔧 API Service Debug:');
console.log('Backend URL:', API_BASE_URL);
console.log('Environment:', import.meta.env.MODE);

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
        // JSON parse error - likely HTML response from server
        if (response.status === 404) {
          errorMessage = 'Backend API endpoint not found. Check if backend is deployed correctly.';
        } else if (response.status >= 500) {
          errorMessage = 'Backend server error. Please try again later.';
        }
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
    try {
      return await response.json();
    } catch (error) {
      console.error('❌ JSON Parse Hatası - Backend\'den HTML cevabı geldi:', error);
      
      // Railway environment variables kontrolü
      if (!API_CONFIG.BASE_URL) {
        throw new Error('❌ Backend URL bulunamadı! Railway dashboard\'dan VITE_API_URL environment variable\'ını ayarlayın.');
      }
      
      // Backend erişim hatası
      throw new Error(`❌ Backend API\'ye ulaşılamıyor (${API_CONFIG.BASE_URL}). Railway\'de backend service\'inin çalıştığını kontrol edin.`);
    }
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

// ===== ADMIN API FUNCTIONS =====
export const adminApi = {
  // ===== AUTHENTICATION =====
  auth: {
    login: async (email, password) => {
      return await api.post(API_CONFIG.endpoints.adminAuth.login, { email, password });
    },

    logout: async () => {
      return await api.post(API_CONFIG.endpoints.adminAuth.logout);
    },

    verify: async () => {
      return await api.get(API_CONFIG.endpoints.adminAuth.verify);
    },

    getProfile: async () => {
      return await api.get(API_CONFIG.endpoints.adminAuth.profile);
    }
  },

  // ===== DASHBOARD =====
  dashboard: {
    getOverview: async () => {
      return await api.get(API_CONFIG.endpoints.adminDashboard.overview);
    },

    getHealth: async () => {
      return await api.get(API_CONFIG.endpoints.adminDashboard.health);
    },

    getStats: async () => {
      return await api.get(API_CONFIG.endpoints.adminDashboard.stats);
    }
  },

  // ===== REDIS MANAGEMENT =====
  redis: {
    getStats: async () => {
      return await api.get(API_CONFIG.endpoints.adminRedis.stats);
    },

    getKeys: async (pattern = '*') => {
      return await api.get(API_CONFIG.endpoints.adminRedis.keys, { params: { pattern } });
    },

    getKey: async (keyName) => {
      return await api.get(API_CONFIG.endpoints.adminRedis.key(keyName));
    },

    deleteKey: async (keyName) => {
      return await api.delete(API_CONFIG.endpoints.adminRedis.deleteKey(keyName));
    },

    flush: async () => {
      return await api.post(API_CONFIG.endpoints.adminRedis.flush);
    }
  },

  // ===== CONTENT MANAGEMENT =====
  content: {
    posts: {
      list: async (params = {}) => {
        return await api.get(API_CONFIG.endpoints.adminContent.posts.list, { params });
      },

      create: async (postData) => {
        return await api.post(API_CONFIG.endpoints.adminContent.posts.create, postData);
      },

      update: async (id, postData) => {
        return await api.put(API_CONFIG.endpoints.adminContent.posts.update(id), postData);
      },

      delete: async (id) => {
        return await api.delete(API_CONFIG.endpoints.adminContent.posts.delete(id));
      },

      publish: async (id) => {
        return await api.post(API_CONFIG.endpoints.adminContent.posts.publish(id));
      },

      unpublish: async (id) => {
        return await api.post(API_CONFIG.endpoints.adminContent.posts.unpublish(id));
      }
    },

    users: {
      list: async (params = {}) => {
        return await api.get(API_CONFIG.endpoints.adminContent.users.list, { params });
      },

      detail: async (id) => {
        return await api.get(API_CONFIG.endpoints.adminContent.users.detail(id));
      },

      ban: async (id, reason = '') => {
        return await api.post(API_CONFIG.endpoints.adminContent.users.ban(id), { reason });
      },

      unban: async (id) => {
        return await api.post(API_CONFIG.endpoints.adminContent.users.unban(id));
      },

      updateRole: async (id, role) => {
        return await api.put(API_CONFIG.endpoints.adminContent.users.role(id), { role });
      }
    },

    comments: {
      list: async (params = {}) => {
        return await api.get(API_CONFIG.endpoints.adminContent.comments.list, { params });
      },

      delete: async (id) => {
        return await api.delete(API_CONFIG.endpoints.adminContent.comments.delete(id));
      },

      approve: async (id) => {
        return await api.post(API_CONFIG.endpoints.adminContent.comments.approve(id));
      }
    },

    // ===== PRODUCTS =====
    products: {
      list: async (params = {}) => {
        return await api.get(API_CONFIG.endpoints.adminContent.products.list, { params });
      },

      detail: async (id) => {
        return await api.get(API_CONFIG.endpoints.adminContent.products.detail(id));
      },

      create: async (data) => {
        return await api.post(API_CONFIG.endpoints.adminContent.products.create, data);
      },

      update: async (id, data) => {
        return await api.put(API_CONFIG.endpoints.adminContent.products.update(id), data);
      },

      delete: async (id) => {
        return await api.delete(API_CONFIG.endpoints.adminContent.products.delete(id));
      },

      bulkUpdateStatus: async (productIds, status) => {
        return await api.patch(API_CONFIG.endpoints.adminContent.products.bulkStatus, {
          product_ids: productIds,
          status
        });
      },

      getStats: async () => {
        return await api.get(API_CONFIG.endpoints.adminContent.products.stats);
      }
    },

    // ===== MEDIA =====
    media: {
      upload: async (file, scope = 'general', bucket = 'products') => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('scope', scope);
        formData.append('bucket', bucket);
        
        return await api.post(API_CONFIG.endpoints.adminMedia.upload, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      },

      uploadMultiple: async (files, scope = 'general', bucket = 'products') => {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });
        formData.append('scope', scope);
        formData.append('bucket', bucket);
        
        return await api.post(API_CONFIG.endpoints.adminMedia.uploadMultiple, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      },

      delete: async (url, bucket = 'products') => {
        return await api.delete(`${API_CONFIG.endpoints.adminMedia.delete}?url=${encodeURIComponent(url)}&bucket=${bucket}`);
      }
    },

    // ===== PRODUCT MEDIA =====
    productMedia: {
      uploadFeaturedImage: async (productId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return await api.post(API_CONFIG.endpoints.adminMedia.productFeatured(productId), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      },

      uploadGalleryImages: async (productId, files) => {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });
        
        return await api.post(API_CONFIG.endpoints.adminMedia.productGallery(productId), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      },

      removeGalleryImage: async (productId, url) => {
        const formData = new FormData();
        formData.append('url', url);
        
        return await api.delete(API_CONFIG.endpoints.adminMedia.productGallery(productId), {
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      },

      removeFeaturedImage: async (productId) => {
        return await api.delete(API_CONFIG.endpoints.adminMedia.productFeatured(productId));
      }
    },


  },

  // ===== BACKWARD COMPATIBILITY (old API calls) =====
  login: async (email, password) => adminApi.auth.login(email, password),
  logout: async () => adminApi.auth.logout(),
  verify: async () => adminApi.auth.verify(),
  getProfile: async () => adminApi.auth.getProfile(),
  getOverview: async () => adminApi.dashboard.getOverview(),
  getHealth: async () => adminApi.dashboard.getHealth(),
  getRedisStats: async () => adminApi.redis.getStats(),
  getRedisKeys: async (pattern) => adminApi.redis.getKeys(pattern),
  getRedisKey: async (keyName) => adminApi.redis.getKey(keyName),
  deleteRedisKey: async (keyName) => adminApi.redis.deleteKey(keyName),
  flushRedis: async () => adminApi.redis.flush(),

  // ===== BACKEND CONNECTION TEST =====
  testConnection: async () => {
    try {
      console.log('🔍 Backend bağlantı testi başlıyor...');
      console.log('Test URL:', `${API_CONFIG.BASE_URL}/health`);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Backend bağlantı başarılı:', data);
      return { success: true, data };
      
    } catch (error) {
      console.error('❌ Backend bağlantı hatası:', error);
      return { success: false, error: error.message };
    }
  }
};

export default adminApi;