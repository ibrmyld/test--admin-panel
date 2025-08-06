import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Raliux Admin</h2>
          <p className="text-gray-400 mt-2">🚀 Deployment Test</p>
          <p className="text-green-400 mt-4 text-lg">✅ SUCCESS!</p>
        </div>
      </div>
    </div>
  )
}

export default Login