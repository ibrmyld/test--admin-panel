import React from 'react'

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">🚀 Admin Panel</h1>
        <p className="text-gray-600 mt-1">Railway deploy başarılı!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900">✅ Deployment</h3>
          <p className="text-gray-600 mt-2">Railway'e başarıyla deploy edildi</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900">🔧 Next Steps</h3>
          <p className="text-gray-600 mt-2">Redis monitor ve diğer özellikler</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900">⚡ Status</h3>
          <p className="text-green-600 mt-2 font-medium">All Systems Online</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard