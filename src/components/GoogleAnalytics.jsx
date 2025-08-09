import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GoogleAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    realTimeUsers: 0,
    sessionsToday: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    userFlow: [],
    deviceStats: {},
    trafficSources: {}
  });

  const [timeRange, setTimeRange] = useState('7days');
  const [loading, setLoading] = useState(true);

  // Simüle edilmiş Google Analytics verisi (gerçek API entegrasyonu için)
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      
      // Gerçek GA API çağrısı buraya gelecek
      // Şimdilik mock data kullanıyoruz
      setTimeout(() => {
        setAnalyticsData({
          realTimeUsers: Math.floor(Math.random() * 50) + 10,
          sessionsToday: Math.floor(Math.random() * 500) + 100,
          pageViews: Math.floor(Math.random() * 2000) + 500,
          bounceRate: (Math.random() * 30 + 40).toFixed(1),
          avgSessionDuration: (Math.random() * 300 + 120).toFixed(0),
          topPages: [
            { page: '/products', views: 1250, rate: 15.2 },
            { page: '/', views: 980, rate: 12.1 },
            { page: '/about', views: 750, rate: 9.3 },
            { page: '/contact', views: 420, rate: 5.2 },
            { page: '/product-detail', views: 380, rate: 4.7 }
          ],
          userFlow: generateMockTimeSeriesData(),
          deviceStats: {
            desktop: 45,
            mobile: 35,
            tablet: 20
          },
          trafficSources: {
            organic: 40,
            direct: 25,
            social: 20,
            referral: 15
          }
        });
        setLoading(false);
      }, 1000);
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const generateMockTimeSeriesData = () => {
    const labels = [];
    const data = [];
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }));
      data.push(Math.floor(Math.random() * 200) + 50);
    }
    
    return { labels, data };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const userFlowChartData = {
    labels: analyticsData.userFlow.labels || [],
    datasets: [
      {
        label: 'Günlük Kullanıcılar',
        data: analyticsData.userFlow.data || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const deviceChartData = {
    labels: ['Masaüstü', 'Mobil', 'Tablet'],
    datasets: [
      {
        data: [
          analyticsData.deviceStats.desktop || 0,
          analyticsData.deviceStats.mobile || 0,
          analyticsData.deviceStats.tablet || 0
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const trafficSourcesData = {
    labels: ['Organik', 'Direkt', 'Sosyal Medya', 'Referans'],
    datasets: [
      {
        label: 'Trafik Kaynakları (%)',
        data: [
          analyticsData.trafficSources.organic || 0,
          analyticsData.trafficSources.direct || 0,
          analyticsData.trafficSources.social || 0,
          analyticsData.trafficSources.referral || 0
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 69, 19, 0.8)',
          'rgba(147, 51, 234, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Zaman Aralığı Seçici */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Google Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7days">Son 7 Gün</option>
          <option value="30days">Son 30 Gün</option>
          <option value="90days">Son 90 Gün</option>
        </select>
      </div>

      {/* Gerçek Zamanlı Kullanıcılar */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Gerçek Zamanlı Kullanıcılar</h3>
            <p className="text-3xl font-bold">{analyticsData.realTimeUsers}</p>
          </div>
          <div className="animate-pulse">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Ana Metrikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Günlük Oturumlar</h3>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.sessionsToday.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Sayfa Görüntülemeleri</h3>
          <p className="text-2xl font-bold text-gray-900">{analyticsData.pageViews.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Çıkış Oranı</h3>
          <p className="text-2xl font-bold text-gray-900">%{analyticsData.bounceRate}</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Ort. Oturum Süresi</h3>
          <p className="text-2xl font-bold text-gray-900">{Math.floor(analyticsData.avgSessionDuration / 60)}:{(analyticsData.avgSessionDuration % 60).toString().padStart(2, '0')}</p>
        </div>
      </div>

      {/* Grafik ve Tablolar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kullanıcı Akışı */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı Akışı</h3>
          <Line data={userFlowChartData} options={chartOptions} />
        </div>

        {/* En Popüler Sayfalar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">En Popüler Sayfalar</h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{page.page}</span>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">{page.views.toLocaleString()}</span>
                  <span className="block text-sm text-gray-500">%{page.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cihaz Dağılımı */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cihaz Dağılımı</h3>
          <div className="w-64 h-64 mx-auto">
            <Doughnut data={deviceChartData} />
          </div>
        </div>

        {/* Trafik Kaynakları */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trafik Kaynakları</h3>
          <Bar data={trafficSourcesData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalytics;
