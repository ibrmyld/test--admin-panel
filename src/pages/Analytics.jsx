import React, { useEffect } from 'react';
import GoogleAnalytics from '../components/GoogleAnalytics';
import { trackAdminAction } from '../config/googleAnalytics';

const Analytics = () => {
  useEffect(() => {
    // Track admin analytics view
    trackAdminAction('view_analytics', { 
      tab: 'google-analytics'
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Google Analytics entegrasyonu ile detaylı site analitikleri</p>
      </div>

      {/* Google Analytics Content */}
      <GoogleAnalytics />
    </div>
  );
};

export default Analytics;