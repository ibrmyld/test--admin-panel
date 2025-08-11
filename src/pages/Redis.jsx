import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Database, Activity, Server, Trash2, Eye, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminApi } from '../services/api'

const Redis = () => {
  // Debug info - Redis environment variables
  console.log('🔴 Redis Page Debug:');
  console.log('REDIS_URL (not directly accessible from frontend):', 'Hidden for security');
  console.log('Backend API URL:', adminApi.getBackendUrl?.() || 'Not available');
  const [selectedPrefix, setSelectedPrefix] = useState('')
  const [keyPattern, setKeyPattern] = useState('*')
  const [selectedKey, setSelectedKey] = useState(null)
  const [keyDetail, setKeyDetail] = useState(null)

  // Redis Stats Query - REALTIME (2 saniyede bir)
  const { data: redisStats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['redisStats'],
    queryFn: () => adminApi.getRedisStats(),
    refetchInterval: 2000, // 2 saniye - daha hızlı
    onError: (error) => {
      toast.error('Redis stats yüklenemedi: ' + error.message)
    }
  })

  // Redis Keys Query - REALTIME (10 saniyede bir)
  const { data: redisKeys, isLoading: keysLoading, refetch: refetchKeys } = useQuery({
    queryKey: ['redisKeys', selectedPrefix, keyPattern],
    queryFn: () => adminApi.getRedisKeys(keyPattern),
    enabled: true,
    refetchInterval: 10000, // 10 saniye - keys daha az değişir
    onError: (error) => {
      toast.error('Redis keys yüklenemedi: ' + error.message)
    }
  })

  // Load key detail
  const loadKeyDetail = async (keyName) => {
    try {
      const response = await adminApi.getRedisKey(encodeURIComponent(keyName))
      setKeyDetail(response)
      setSelectedKey(keyName)
    } catch (error) {
      toast.error('Key detayları alınamadı: ' + error.message)
    }
  }

  // Delete key
  const deleteKey = async (keyName) => {
    if (!window.confirm(`"${keyName}" key'ini silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      await adminApi.deleteRedisKey(encodeURIComponent(keyName))
      toast.success('Key başarıyla silindi')
      refetchKeys()
      refetchStats()
      if (selectedKey === keyName) {
        setSelectedKey(null)
        setKeyDetail(null)
      }
    } catch (error) {
      toast.error('Key silinemedi: ' + error.message)
    }
  }

  // Format TTL
  const formatTTL = (ttl) => {
    if (ttl === -1) return 'No expire'
    if (ttl === -2) return 'Expired'
    if (ttl < 60) return `${ttl}s`
    if (ttl < 3600) return `${Math.floor(ttl / 60)}m ${ttl % 60}s`
    if (ttl < 86400) {
      const hours = Math.floor(ttl / 3600)
      const minutes = Math.floor((ttl % 3600) / 60)
      return `${hours}h ${minutes}m`
    }
    const days = Math.floor(ttl / 86400)
    const hours = Math.floor((ttl % 86400) / 3600)
    return `${days}d ${hours}h`
  }

  // Format bytes
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Database className="mr-3 h-6 w-6 text-red-600" />
            Redis Dashboard
          </h1>
          <p className="text-gray-600">Redis veritabanı monitoring ve yönetim</p>
        </div>
        <button
          onClick={() => {
            refetchStats()
            refetchKeys()
          }}
          className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          disabled={statsLoading || keysLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${(statsLoading || keysLoading) ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>

      {/* Redis Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Redis Durumu</p>
              <p className="text-lg font-bold text-green-600">
                {redisStats?.success ? 'Bağlı' : 'Bağlantı Yok'}
              </p>
            </div>
            <Server className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hit Rate</p>
              <p className="text-lg font-bold text-blue-600">
                {redisStats?.performance?.hit_rate || 0}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Memory Usage</p>
              <p className="text-lg font-bold text-purple-600">
                {redisStats?.memory?.used_memory_human || 'N/A'}
              </p>
            </div>
            <Database className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connected Clients</p>
              <p className="text-lg font-bold text-orange-600">
                {redisStats?.stats?.connected_clients || 0}
              </p>
            </div>
            <Server className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Redis Keys Panel */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Redis Keys</h3>
              <span className="text-sm text-gray-500">
                {redisKeys?.total_count || 0} keys
              </span>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedPrefix}
                onChange={(e) => setSelectedPrefix(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Tüm Prefix'ler</option>
                <option value="panel_sessions">Panel Sessions</option>
                <option value="api_ratelimit">Rate Limiting</option>
                <option value="cache">Cache</option>
                <option value="failed_login">Failed Login</option>
              </select>
              
              <input
                type="text"
                value={keyPattern}
                onChange={(e) => setKeyPattern(e.target.value)}
                placeholder="Key pattern (e.g., *user*)"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            {keysLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-gray-500">Yükleniyor...</span>
              </div>
            ) : redisKeys?.keys?.length > 0 ? (
              <div className="space-y-2">
                {redisKeys.keys.map((key) => (
                  <div
                    key={key.key}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedKey === key.key
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => loadKeyDetail(key.key)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {key.key}
                      </p>
                      <p className="text-xs text-gray-500">
                        Type: {key.type} | TTL: {key.ttl_human}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          loadKeyDetail(key.key)
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteKey(key.key)
                        }}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Redis key bulunamadı</p>
              </div>
            )}
          </div>
        </div>

        {/* Key Detail Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Key Detayları</h3>
          </div>
          
          <div className="p-6">
            {selectedKey && keyDetail ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Key</label>
                  <p className="text-sm font-mono bg-gray-50 p-2 rounded break-all">
                    {keyDetail.key}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="text-sm">{keyDetail.type}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">TTL</label>
                  <p className="text-sm">{formatTTL(keyDetail.ttl)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Size</label>
                  <p className="text-sm">{formatBytes(keyDetail.size)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Value</label>
                  <div className="mt-2 max-h-48 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                    <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                      {typeof keyDetail.value === 'object' 
                        ? JSON.stringify(keyDetail.value, null, 2)
                        : keyDetail.value}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Key detaylarını görmek için bir key seçin</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prefix Statistics */}
      {redisStats?.stats?.prefix_counts && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Prefix İstatistikleri</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(redisStats.stats.prefix_counts).map(([prefix, count]) => (
                <div key={prefix} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 capitalize">{prefix}</p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">keys</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Redis
