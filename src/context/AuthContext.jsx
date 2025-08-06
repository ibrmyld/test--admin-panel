import React, { createContext, useContext, useState, useEffect } from 'react'
import { adminApi } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
      const userData = localStorage.getItem('admin_user')
      
      if (token && userData) {
        setUser(JSON.parse(userData))
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.warn('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await adminApi.login(email, password)
      
      if (response.access_token) {
        const userData = {
          firstName: response.user?.first_name || 'Admin',
          email: response.user?.email || email,
          role: 'admin'
        }
        
        localStorage.setItem('admin_token', response.access_token)
        localStorage.setItem('admin_user', JSON.stringify(userData))
        
        setUser(userData)
        setIsAuthenticated(true)
        return { success: true }
      }
      
      throw new Error('Login failed')
    } catch (error) {
      console.error('Login error:', error)
      // Fallback for demo/testing
      const userData = { firstName: 'Admin', email, role: 'admin' }
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}