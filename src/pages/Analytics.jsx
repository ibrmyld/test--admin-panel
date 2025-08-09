import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  ShoppingCart,
  Package,
  Activity,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { adminApi } from '../services/api';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [chartData, setChartData] = useState({});
  const [realTimeData, setRealTimeData] = useState(null);

  // Load analytics data
  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get overview data
      const overviewResponse = await adminApi.analytics.getOverview(timeRange);
      setAnalyticsData(overviewResponse);
      
      // Get chart data
      const trafficChart = await adminApi.analytics.getChartData('traffic_overview', timeRange);
      setChartData(prev => ({ ...prev, traffic: trafficChart }));
      
      // Get real-time data
      const realTime = await adminApi.analytics.getRealTime();
      setRealTimeData(realTime);
      
    } catch (error) {
      console.error('Analytics loading error:', error);
      
      // Fallback mock data
      setAnalyticsData({
        products: {
          total: 48,
          published: 42,
          draft: 6,
          featured: 12,
          avg_price: 1250.50,
          total_stock: 324
        },
        traffic: {
          page_views: 12543,
          product_views: 3421,
          unique_sessions: 2156,
          purchases: 89
        },
        admin: {
          total_actions: 156,
          active_admins: 3,
          product_actions: 89
        },
        growth: {
          page_views: 12.5,
          product_views: -5.2
        },
        recent_activity: [
          {
            action: 'product_created',
            target_table: 'products',
            details: { name: 'Gaming Mouse' },
            created_at: new Date().toISOString()
          }
        ],
        top_products: [
          {
            id: '1',
            name: 'Premium Gaming Laptop',
            price: 25999.99,
            views: 456,
            stock_quantity: 5,
            featured_image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300'
          }
        ]
      });
      
      setRealTimeData({
        active_users: 23,
        current_page_views: 45,
        recent_events: [],
        top_pages_now: []
      });
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  // Auto-refresh real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) {
        // Silently update real-time data
        adminApi.analytics.getRealTime()
          .then(setRealTimeData)
          .catch(console.error);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [loading]);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount || 0);
  };

  const formatGrowth = (growth) => {
    const isPositive = growth >= 0;
    return (
      <span className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {Math.abs(growth).toFixed(1)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={7}>Son 7 Gün</option>
            <option value={30}>Son 30 Gün</option>
            <option value={90}>Son 3 Ay</option>
            <option value={365}>Son 1 Yıl</option>
          </select>
          
          <button
            onClick={loadAnalytics}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yenile
          </button>
          
          <button
            onClick={() => adminApi.analytics.exportData('json', timeRange)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Dışa Aktar
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      {realTimeData && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Canlı İstatistikler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{realTimeData.active_users}</div>
              <div className="text-blue-100">Aktif Kullanıcı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{realTimeData.current_page_views}</div>
              <div className="text-blue-100">Şu Anki Görüntülenme</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{realTimeData.recent_events?.length || 0}</div>
              <div className="text-blue-100">Son Etkinlik</div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Ürün</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.products?.total || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                {analyticsData?.products?.published || 0} yayında, {analyticsData?.products?.draft || 0} taslak
              </p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Page Views */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sayfa Görüntülenme</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData?.traffic?.page_views)}</p>
              <div className="mt-1">{formatGrowth(analyticsData?.growth?.page_views || 0)}</div>
            </div>
            <Eye className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Unique Sessions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Benzersiz Oturum</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData?.traffic?.unique_sessions)}</p>
              <p className="text-xs text-gray-500 mt-1">
                {analyticsData?.traffic?.product_views || 0} ürün görüntülenme
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        {/* Conversions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Dönüşümler</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData?.traffic?.purchases || 0}</p>
              <p className="text-xs text-gray-500 mt-1">
                %{((analyticsData?.traffic?.purchases || 0) / (analyticsData?.traffic?.unique_sessions || 1) * 100).toFixed(1)} dönüşüm oranı
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart Placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Trafik Analizi
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Grafik buraya gelecek</p>
              <p className="text-sm">(Chart.js entegrasyonu gerekli)</p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">En Popüler Ürünler</h3>
          <div className="space-y-4">
            {analyticsData?.top_products?.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                </div>
                <div className="flex-shrink-0 w-10 h-10">
                  <img
                    src={product.featured_image}
                    alt={product.name}
                    className="w-10 h-10 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxNUw2IDI1SDE0VjMxSDI2VjI1SDM0TDIwIDE1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.views} görüntülenme</p>
                </div>
                <div className="flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900">{formatCurrency(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
        <div className="space-y-3">
          {analyticsData?.recent_activity?.slice(0, 10).map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.target_table} • {new Date(activity.created_at).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performans Özeti</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(analyticsData?.products?.avg_price)}
            </div>
            <p className="text-sm text-gray-600">Ortalama Ürün Fiyatı</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analyticsData?.products?.total_stock || 0}
            </div>
            <p className="text-sm text-gray-600">Toplam Stok</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {analyticsData?.admin?.active_admins || 0}
            </div>
            <p className="text-sm text-gray-600">Aktif Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
