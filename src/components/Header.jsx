import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Menu, Bell, User, LogOut, Shield } from 'lucide-react'

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    if (window.confirm('Çıkış yapmak istediğinizden emin misiniz?')) {
      logout()
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Raliux Yönetim Paneli</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              {user?.role === 'admin' ? (
                <Shield className="w-4 h-4 text-white" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName || user?.display_name || 'Admin'}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Çıkış Yap"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header