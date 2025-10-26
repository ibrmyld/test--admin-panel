# TEST Admin Panel

Railway'e deploy edilmek üzere optimize edilmiş React admin paneli.

## 🚀 Özellikler

- ⚡ **Vite**: Hızlı development ve build
- 🎨 **Tailwind CSS**: Modern responsive tasarım
- 🔐 **Authentication**: JWT token tabanlı güvenlik
- 📊 **Dashboard**: İstatistikler ve yönetim paneli
- 🚀 **Railway Deploy**: Otomatik deployment
- 📱 **Responsive**: Mobil uyumlu tasarım

## 📦 Kurulum

```bash
npm install
```

## 🔧 Environment Variables

`.env` dosyası oluştur:
```env
# Backend API URL (Railway)
VITE_API_URL=https://test-backend.up.railway.app

# Admin Panel Config
VITE_APP_NAME=test Admin Panel
```

## 🛠 Development

```bash
npm run dev
```
Admin panel: `http://localhost:3000`

## 🚀 Railway Deploy

Bu admin panel Railway'e deploy edilmek üzere hazırlanmıştır:

1. **Repository'yi Railway'e bağla**
2. **Environment variables'ları ayarla**
3. **Otomatik deploy başlatılır**

### Railway Konfigürasyonu:
- `nixpacks.toml`: Build ve start konfigürasyonu
- `railway.json`: Deploy ayarları
- Port: `$PORT` (Railway tarafından belirlenir)

## 📚 Backend Bağlantısı

Admin panel, Raliux Backend API'si ile çalışır:
- **Backend URL**: `https://test-backend.up.railway.app`
- **API Endpoints**: `/api/admin/*`
- **Authentication**: JWT Bearer token

## 🔐 Authentication

Admin paneli JWT token tabanlı authentication kullanır:
- Login: `POST /api/auth/login`
- Token localStorage'da saklanır
- Otomatik logout (401 durumunda)

## 📊 API Endpoints

- `GET /api/admin/stats` - Dashboard istatistikleri
- `GET /api/posts` - Blog yazıları
- `POST /api/posts` - Yeni yazı oluştur
- `PUT /api/posts/:id` - Yazı güncelle
- `DELETE /api/posts/:id` - Yazı sil

## 🛠 Teknolojiler

- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React Query** - Data fetching
- **Framer Motion** - Animations
- **Railway** - Deployment
