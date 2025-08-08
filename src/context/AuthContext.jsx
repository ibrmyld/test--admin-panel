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

  const checkAuthStatus = async () => {
    try {
      const userData = localStorage.getItem('admin_user')
      
      if (userData) {
        // Backend'de session kontrolü
        try {
          const response = await adminApi.verify()
          if (response.success && response.valid) {
            setUser(JSON.parse(userData))
            setIsAuthenticated(true)
          } else {
            // Session expired
            localStorage.removeItem('admin_user')
            localStorage.removeItem('admin_login_time')
          }
        } catch (error) {
          // API erişilemiyorsa demo mode devam et
          console.warn('Auth verify failed, using local session:', error)
          setUser(JSON.parse(userData))
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.warn('Auth check error:', error)
      localStorage.removeItem('admin_user')
      localStorage.removeItem('admin_login_time')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      
      // Backend admin login API çağrısı
      const response = await adminApi.login(email, password)
      
      if (response.success) {
        // Backend'den gelen user data
        const userData = {
          id: response.user.id,
          email: response.user.email,
          role: response.user.role,
          display_name: response.user.display_name || response.user.email.split('@')[0],
          firstName: response.user.display_name || response.user.email.split('@')[0],
          loginTime: new Date().toISOString()
        }
        
        // Session cookie backend'de set edilir, biz sadece user data'yı saklarız
        localStorage.setItem('admin_user', JSON.stringify(userData))
        localStorage.setItem('admin_login_time', Date.now().toString())
        
        setUser(userData)
        setIsAuthenticated(true)
        return { success: true, user: userData }
      } else {
        throw new Error(response.message || 'Login failed')
      }
      
    } catch (error) {
      console.error('Login error:', error)
      
      // Fallback demo credentials (development için)
      const demoCredentials = {
        'admin@raliux.com': 'admin123',
        'test@admin.com': 'test123',
        'ibrahim@raliux.com': 'ibrahim123'
      }
      
      if (demoCredentials[email] && demoCredentials[email] === password) {
        const userData = {
          firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          email,
          role: 'admin',
          id: Math.random().toString(36).substr(2, 9),
          loginTime: new Date().toISOString()
        }
        
        localStorage.setItem('admin_user', JSON.stringify(userData))
        localStorage.setItem('admin_login_time', Date.now().toString())
        
        setUser(userData)
        setIsAuthenticated(true)
        return { success: true, user: userData }
      }
      
      return { 
        success: false, 
        error: error.message || 'Invalid credentials. Please check your email and password.' 
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Backend logout çağrısı
      await adminApi.logout()
    } catch (error) {
      console.warn('Backend logout failed:', error)
    }
    
    // Local state temizle
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_login_time')
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