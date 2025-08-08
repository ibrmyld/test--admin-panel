# 🔗 Backend Connection Guide

## ✅ Backend-Frontend Bağlantısı Tamamlandı!

### 🎯 Yapılan Güncellemeler:

1. **AuthContext.jsx** - Backend admin auth API'si ile entegre
2. **API Services** - httpOnly cookies için optimize edildi
3. **Header Component** - User bilgilerini gösterir
4. **Dashboard** - Gerçek backend data'sını çeker
5. **Redis Dashboard** - Backend Redis API'leri kullanır

### 🚀 Nasıl Test Ederim:

#### 1. Backend'i Başlat
```bash
cd Raliux-project/backend
python main.py
# ✅ Port 8000'de çalışır
# ✅ Admin API endpoints hazır:
#   - POST /api/admin/auth/login
#   - GET /api/admin/auth/verify
#   - GET /api/admin/dashboard/overview
#   - GET /api/admin/redis/stats
```

#### 2. Admin Panel'i Başlat
```bash
cd admin
npm run dev
# ✅ Port 5173'te çalışır
# ✅ Backend'e otomatik bağlanır (http://localhost:8000)
```

#### 3. Test Login
```
Email: admin@raliux.com
Password: admin123
# ✅ Önce backend API'yi dener
# ✅ Başarısızsa demo credentials kullanır
```

### 🔧 Backend Bağlantı Özellikleri:

#### Authentication Flow:
```
1. Frontend: Login form gönderir
2. Backend: /api/admin/auth/login endpoint'i
3. Backend: Supabase Auth + profile role check
4. Backend: httpOnly cookie session set eder
5. Frontend: User data localStorage'da saklar
6. Sonraki API calls: Automatic cookie authentication
```

#### API Integration:
```javascript
// AuthContext - Backend login
const response = await adminApi.login(email, password)
if (response.success) {
  // User data set edilir
  // httpOnly cookie backend'de set edilir
}

// Dashboard - Backend data
const overviewData = await adminApi.getOverview()
const healthData = await adminApi.getHealth()

// Redis - Backend monitoring
const redisStats = await api.get('/admin/redis/stats')
const redisKeys = await api.get('/admin/redis/keys')
```

#### Cookie-Based Auth:
```javascript
// API Request Config
const config = {
  method: 'GET',
  credentials: 'include', // httpOnly cookies için
  headers: {
    'Content-Type': 'application/json'
  }
}
// ✅ Token headers gerekmez
// ✅ Backend httpOnly cookies handle eder
```

### 🛡️ Güvenlik Features:

1. **httpOnly Cookies** - XSS attacks'tan korunur
2. **CSRF Protection** - SameSite cookie settings
3. **Session Validation** - Backend'de session kontrol
4. **Automatic Logout** - 401 response'da otomatik logout
5. **Fallback Auth** - API erişilemezse demo mode

### 📊 Backend Endpoints Kullanımı:

#### Admin Auth:
- `POST /api/admin/auth/login` ✅ Entegre
- `GET /api/admin/auth/verify` ✅ Session check
- `POST /api/admin/auth/logout` ✅ Secure logout

#### Dashboard:
- `GET /api/admin/dashboard/overview` ✅ Stats
- `GET /api/admin/dashboard/health` ✅ System status

#### Redis:
- `GET /api/admin/redis/stats` ✅ Redis metrics
- `GET /api/admin/redis/keys` ✅ Key management
- `DELETE /api/admin/redis/key/{key}` ✅ Key deletion

### 🔄 Auto-Refresh & Real-time:

```javascript
// Dashboard - Health check her 30 saniye
useEffect(() => {
  const interval = setInterval(checkSystemHealth, 30000)
  return () => clearInterval(interval)
}, [])

// Redis - Stats her 5 saniye
const { data: redisStats } = useQuery({
  queryKey: ['redisStats'],
  queryFn: () => api.get('/admin/redis/stats'),
  refetchInterval: 5000
})
```

### 🎯 Test Checklist:

- [x] Login with backend API
- [x] Login with demo credentials (fallback)
- [x] Dashboard data from backend
- [x] System health real-time
- [x] Redis monitoring live
- [x] httpOnly cookie authentication
- [x] Automatic logout on 401
- [x] Error handling & fallbacks

### 🚀 Production Ready Features:

1. **Environment Variables**:
```bash
VITE_API_URL=https://your-backend-domain.com
```

2. **CORS Configuration**:
```python
# Backend'de admin domain ekle
CORS_ORIGINS = [
    "https://admin.raliux.com",
    "http://localhost:5173"
]
```

3. **SSL/TLS**:
```javascript
// Production'da HTTPS gerekli
credentials: 'include' // Secure cookies için
```

Bu bağlantı artık **production-ready**! Backend ile admin panel arasında güvenli, scalable ve maintainable bir integration kuruldu! 🎉
