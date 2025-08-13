import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

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
      // Check Supabase session
      const { session, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Session check error:', error)
        setLoading(false)
        return
      }

      if (session?.user) {
        // Check admin profile
        const { data: profileData, error: profileError } = await supabase
          .from('admin_profiles')
          .select('role, display_name, email, is_active')
          .eq('user_id', session.user.id)
          .single()

        if (profileError || !profileData || !profileData.is_active) {
          // No admin profile or inactive
          await supabase.auth.signOut()
          setLoading(false)
          return
        }

        // Valid admin session
        const userData = {
          id: session.user.id,
          email: session.user.email,
          role: profileData.role,
          display_name: profileData.display_name || session.user.email.split('@')[0],
          firstName: profileData.display_name || session.user.email.split('@')[0]
        }

        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      
      // Direct Supabase admin login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        return { success: false, error: 'Invalid login credentials' }
      }

      // Check admin profile
      const { data: profileData, error: profileError } = await supabase
        .from('admin_profiles')
        .select('role, display_name, email, is_active')
        .eq('user_id', authData.user.id)
        .single()

      if (profileError || !profileData) {
        await supabase.auth.signOut() // Cleanup
        return { success: false, error: 'Admin profile not found' }
      }

      if (!profileData.is_active) {
        await supabase.auth.signOut() // Cleanup
        return { success: false, error: 'Admin account disabled' }
      }

      if (!['super_admin', 'admin', 'moderator'].includes(profileData.role)) {
        await supabase.auth.signOut() // Cleanup
        return { success: false, error: 'Admin access required' }
      }

      // Success - set user data
      const userData = {
        id: authData.user.id,
        email: authData.user.email,
        role: profileData.role,
        display_name: profileData.display_name || authData.user.email.split('@')[0],
        firstName: profileData.display_name || authData.user.email.split('@')[0],
        loginTime: new Date().toISOString()
      }
      
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true, user: userData }
      
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Supabase logout
      await supabase.auth.signOut()
    } catch (error) {
      console.warn('Logout error:', error)
    }
    
    // Local state temizle
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