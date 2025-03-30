"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { googleFit } from '@/lib/googleFit'
import { userService } from '@/lib/userService'

export interface User {
  id: string
  name: string
  email: string
  picture: string
  accessToken: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Optimize the auth check to only run once and be more efficient
  useEffect(() => {
    const checkAuth = async () => {
      console.time('auth-check') // Debug performance
      setIsLoading(true)
      
      try {
        // Check cookie first as it's faster
        const savedUser = Cookies.get('user')
        
        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser)
            
            if (userData && userData.id && userData.accessToken) {
              setUser(userData)
              setIsAuthenticated(true)
              // Update localStorage for backup
              localStorage.setItem('user', savedUser)
            } else {
              throw new Error('Invalid user data')
            }
          } catch (e) {
            console.error('Error parsing user data:', e)
            Cookies.remove('user', { path: '/' })
            localStorage.removeItem('user')
            setUser(null)
            setIsAuthenticated(false)
          }
        } else {
          // Try localStorage as fallback
          const localUser = localStorage.getItem('user')
          if (localUser) {
            try {
              const userData = JSON.parse(localUser)
              
              if (userData && userData.id && userData.accessToken) {
                setUser(userData)
                setIsAuthenticated(true)
                // Restore cookie from localStorage
                Cookies.set('user', localUser, { expires: 7, path: '/' })
              } else {
                throw new Error('Invalid user data in localStorage')
              }
            } catch (e) {
              localStorage.removeItem('user')
              setUser(null)
              setIsAuthenticated(false)
            }
          } else {
            setUser(null)
            setIsAuthenticated(false)
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
        console.timeEnd('auth-check') // Debug performance
      }
    }

    // Only run on client side
    if (typeof window !== 'undefined') {
      checkAuth()
    } else {
      setIsLoading(false) // Not loading on server side
    }
  }, [])

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user info using the access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        })

        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info')
        }

        const userInfo = await userInfoResponse.json()

        const userData: User = {
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          accessToken: tokenResponse.access_token
        }

        // Save user data to state and cookies/localStorage
        setUser(userData)
        setIsAuthenticated(true)
        
        // Set cookie with user data (expires in 7 days)
        Cookies.set('user', JSON.stringify(userData), { expires: 7 })
        
        // Store user data in Firebase Realtime Database using the userService
        try {
          await userService.saveUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            picture: userData.picture
            // Don't store accessToken in Firebase for security reasons
          });
          console.log('User saved to Firebase Realtime Database');
        } catch (error) {
          console.error('Error saving user to Firebase:', error)
          // Continue the login process even if Firebase storage fails
          // We don't want to block login if the database operation fails
        }
        
        toast.success('Successfully signed in')
        router.push('/dashboard')
      } catch (error) {
        console.error('Error signing in:', error)
        toast.error('Failed to sign in')
        setIsLoading(false)
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error)
      toast.error('Failed to sign in')
      setIsLoading(false)
    },
    scope: 'email profile'
  })

  const signIn = async () => {
    setIsLoading(true)
    try {
      login()
    } catch (error) {
      console.error('Error signing in:', error)
      toast.error('Failed to sign in')
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      // Disconnect Google Fit if connected
      googleFit.setAccessToken(null)
      
      // Clear user data
      setUser(null)
      setIsAuthenticated(false)
      
      // Clear ALL cookies to ensure complete logout
      document.cookie.split(';').forEach(c => {
        document.cookie = c
          .replace(/^ +/, '')
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
      
      // Remove cookies using js-cookie as backup
      Cookies.remove('user', { path: '/' });
      
      // Clear localStorage items related to auth
      localStorage.removeItem('user');
      localStorage.removeItem('auth_state');
      localStorage.removeItem('google_fit_token');
      
      // Use router instead of window.location to avoid full page reload issues
      router.push('/signin');
      
      // Show success message
      toast.success('Successfully signed out');
      
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  if (!clientId) {
    console.error('Google OAuth client ID is not configured')
    return <>{children}</>
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </GoogleOAuthProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 