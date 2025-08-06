import React from 'react'

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-4">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
    </header>
  )
}

export default Header