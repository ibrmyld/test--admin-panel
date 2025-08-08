import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Database, Users, Activity, Settings } from 'lucide-react'

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Redis Dashboard', href: '/redis', icon: Database },
    { name: 'Kullanıcılar', href: '/users', icon: Users },
    { name: 'Aktiviteler', href: '/activity', icon: Activity },
    { name: 'Ayarlar', href: '/settings', icon: Settings },
  ]

  return (
    <div className={`bg-gray-900 text-white w-64 ${isOpen ? 'block' : 'hidden'} lg:block`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Raliux Admin</h2>
        <p className="text-gray-400 text-sm">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <div className="px-4 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Ana Menü
          </p>
        </div>
        
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white border-r-2 border-blue-400'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 bg-gray-800">
        <div className="text-center">
          <p className="text-xs text-gray-400">
            © 2024 Raliux Admin Panel
          </p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar