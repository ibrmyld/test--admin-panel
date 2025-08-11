import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { adminApi } from '../services/api'
import { API_CONFIG } from '../config/api'
import { 
  BarChart3, 
  Users, 
  FileText, 
  Package, 
  TrendingUp, 
  Activity,
  Shield,
  Database,
  Server,
  Wifi,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total_posts: 0,
    total_users: 0,
    total_products: 0,
    total_comments: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [connectionTest, setConnectionTest] = useState(null)
  const [systemStatus, setSystemStatus] = useState({
    api: 'checking',
    database: 'checking',
    cache: 'checking'
  })

  useEffect(() => {
    loadDashboardData()
    checkSystemHealth()
    
    // REALTIME - Her 5 saniyede dashboard verilerini güncelle
    const dashboardInterval = setInterval(() => {
      loadDashboardData()
    }, 5000)
    
    // REALTIME - Her 3 saniyede sistem durumunu kontrol et
    const healthInterval = setInterval(() => {
      checkSystemHealth()
    }, 3000)
    
    // Cleanup intervals
    return () => {
      clearInterval(dashboardInterval)
      clearInterval(healthInterval)
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Backend'den overview data çek
      const overviewData = await adminApi.getOverview()
      
      if (overviewData.success) {
        setStats({
          total_posts: overviewData.overview?.posts?.total || 0,
          total_users: overviewData.overview?.users?.total || 0, 
          total_products: overviewData.overview?.products?.total || 0,
          total_comments: overviewData.overview?.comments?.total || 0
        })
      } else {
        // API başarısız response döndü
        setError('Backend API\'den geçersiz response alındı')
        setStats({
          total_posts: 0,
          total_users: 0,
          total_products: 0,
          total_comments: 0
        })
      }
      
    } catch (error) {
      console.error('❌ Backend API bağlantı hatası:', error)
      setError(error.message || 'Backend API\'ye bağlanılamıyor')
      
      // Hata durumunda boş stats
      setStats({
        total_posts: 0,
        total_users: 0,
        total_products: 0,
        total_comments: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const testBackendConnection = async () => {
    setConnectionTest({ status: 'testing', message: 'Backend bağlantısı test ediliyor...' });
    
    const result = await adminApi.testConnection();
    
    if (result.success) {
      setConnectionTest({ 
        status: 'success', 
        message: 'Backend bağlantısı başarılı!',
        data: result.data 
      });
    } else {
      setConnectionTest({ 
        status: 'error', 
        message: `Backend bağlantı hatası: ${result.error}` 
      });
    }
  }

  const checkSystemHealth = async () => {
    try {
      // Backend health check
      const healthData = await adminApi.getHealth()
      
      if (healthData.success) {
        setSystemStatus({
          api: 'online',
          database: healthData.services?.supabase?.connected ? 'online' : 'offline',
          cache: healthData.services?.redis?.connected ? 'online' : 'offline'
        })
      } else {
        setSystemStatus({
          api: 'offline',
          database: 'offline',
          cache: 'offline'
        })
      }
    } catch (error) {
      console.error('❌ System health check hatası:', error)
      // Backend'e ulaşılamıyorsa offline olarak işaretle
      setSystemStatus({
        api: 'offline',
        database: 'offline', 
        cache: 'offline'
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-500'
      case 'offline': return 'text-red-500'
      case 'checking': return 'text-yellow-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '✅'
      case 'offline': return '❌'
      case 'checking': return '🔄'
      default: return '❓'
    }
  }

  const statCards = [
    {
      title: 'Toplam Postlar',
      value: stats.total_posts,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Aktif Kullanıcılar',
      value: stats.total_users,
      icon: Users,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Ürünler',
      value: stats.total_products,
      icon: Package,
      color: 'from-purple-500 to-purple-600',
      change: '+5%'
    },
    {
      title: 'Yorumlar',
      value: stats.total_comments,
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      change: '+15%'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Hoş geldin, {user?.firstName || 'Admin'}! 👋
            </h1>
            <p className="text-slate-300 text-lg">Raliux Admin Panel Dashboard</p>
            <div className="flex items-center mt-4 text-sm text-slate-400">
              <Clock className="w-4 h-4 mr-2" />
              Son giriş: {new Date().toLocaleString('tr-TR')}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Backend Connection Test */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Server className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">Backend Bağlantı Testi</h2>
          </div>
          <button
            onClick={testBackendConnection}
            disabled={connectionTest?.status === 'testing'}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${connectionTest?.status === 'testing' ? 'animate-spin' : ''}`} />
            Test Et
          </button>
        </div>
        
        {connectionTest && (
          <div className={`p-4 rounded-lg ${
            connectionTest.status === 'success' ? 'bg-green-50 border border-green-200' :
            connectionTest.status === 'error' ? 'bg-red-50 border border-red-200' :
            'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center gap-2">
              {connectionTest.status === 'success' && <span className="text-green-500">✅</span>}
              {connectionTest.status === 'error' && <span className="text-red-500">❌</span>}
              {connectionTest.status === 'testing' && <span className="text-yellow-500">🔄</span>}
              <span className={`font-medium ${
                connectionTest.status === 'success' ? 'text-green-800' :
                connectionTest.status === 'error' ? 'text-red-800' :
                'text-yellow-800'
              }`}>
                {connectionTest.message}
              </span>
            </div>
            
            {connectionTest.data && (
              <div className="mt-3 text-sm text-gray-600">
                <p><strong>Backend Version:</strong> {connectionTest.data.version}</p>
                <p><strong>Environment:</strong> {connectionTest.data.environment}</p>
                <p><strong>Services:</strong> {JSON.stringify(connectionTest.data.services)}</p>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          <p><strong>Backend URL:</strong> {API_CONFIG.BASE_URL || 'Tanımlı değil'}</p>
          <p><strong>Environment Mode:</strong> {import.meta.env.MODE}</p>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Activity className="w-6 h-6 mr-3 text-blue-500" />
          Sistem Durumu
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <Server className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">API Server</h3>
                <p className="text-sm text-gray-500">Backend durumu</p>
              </div>
            </div>
            <div className={`flex items-center ${getStatusColor(systemStatus.api)}`}>
              <span className="mr-2">{getStatusIcon(systemStatus.api)}</span>
              <span className="font-medium capitalize">{systemStatus.api}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Database</h3>
                <p className="text-sm text-gray-500">Supabase bağlantısı</p>
              </div>
            </div>
            <div className={`flex items-center ${getStatusColor(systemStatus.database)}`}>
              <span className="mr-2">{getStatusIcon(systemStatus.database)}</span>
              <span className="font-medium capitalize">{systemStatus.database}</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <Wifi className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <h3 className="font-semibold text-gray-900">Cache</h3>
                <p className="text-sm text-gray-500">Redis cache</p>
              </div>
            </div>
            <div className={`flex items-center ${getStatusColor(systemStatus.cache)}`}>
              <span className="mr-2">{getStatusIcon(systemStatus.cache)}</span>
              <span className="font-medium capitalize">{systemStatus.cache}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className={`bg-gradient-to-r ${card.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold opacity-90">{card.title}</h3>
                    <p className="text-3xl font-bold mt-2">
                      {loading ? (
                        <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
                      ) : (
                        card.value.toLocaleString()
                      )}
                    </p>
                  </div>
                  <Icon className="w-12 h-12 opacity-80" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{card.change}</span>
                  <span className="text-gray-500 text-sm ml-1">bu ay</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-colors group">
            <FileText className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Yeni Post</h3>
            <p className="text-sm text-gray-500">Blog yazısı ekle</p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-400 hover:bg-green-50 transition-colors group">
            <Users className="w-8 h-8 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600">Kullanıcı Yönetimi</h3>
            <p className="text-sm text-gray-500">Kullanıcıları görüntüle</p>
          </button>

          <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-colors group">
            <Package className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">Ürün Ekle</h3>
            <p className="text-sm text-gray-500">Yeni ürün tanımla</p>
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start">
          <Shield className="w-6 h-6 text-blue-500 mr-3 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">🔒 Güvenlik Bildirimi</h3>
            <p className="text-blue-700 text-sm">
              Bu admin paneli bcrypt şifreleme ve JWT token sistemi ile korunmaktadır. 
              Tüm API çağrıları SSL üzerinden şifrelenmektedir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard