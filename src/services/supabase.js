import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin-specific functions
export const adminAuth = {
  // Admin login with role check
  async login(email, password) {
    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) {
        return { success: false, error: 'Invalid login credentials' }
      }

      // 2. Check admin profile
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

      // 3. Return success with user data
      return {
        success: true,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          role: profileData.role,
          display_name: profileData.display_name || authData.user.email.split('@')[0],
          loginTime: new Date().toISOString()
        }
      }

    } catch (error) {
      console.error('Admin login error:', error)
      return { success: false, error: 'Login failed' }
    }
  },

  // Admin logout
  async logout() {
    const { error } = await supabase.auth.signOut()
    return { success: !error, error: error?.message }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Get admin profile for current user
  async getAdminProfile() {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return { success: false, error: 'No active session' }
    }

    const { data: profileData, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (profileError || !profileData) {
      return { success: false, error: 'Admin profile not found' }
    }

    return {
      success: true,
      profile: profileData
    }
  }
}

// Listen to auth changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}
