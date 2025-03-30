"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { googleFit } from '@/lib/googleFit'
import { useAuth } from './AuthContext'
import { userService } from '@/lib/userService'
import { toast } from 'sonner'

interface GoogleFitContextType {
  isConnected: boolean
  connectGoogleFit: () => Promise<void>
  disconnectGoogleFit: () => Promise<void>
  getFitnessData: (startTime: Date, endTime: Date) => Promise<any>
  isLoading: boolean
}

const GoogleFitContext = createContext<GoogleFitContextType | undefined>(undefined)

export function GoogleFitProviderContent({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // Check if Google Fit is connected on mount (client-side only)
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('google_fit_token')
      if (storedToken) {
        googleFit.setAccessToken(storedToken)
        setIsConnected(true)
      }
    }
  }, [])

  const login = useGoogleLogin({
    scope: [
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read',
      'https://www.googleapis.com/auth/fitness.heart_rate.read',
      'https://www.googleapis.com/auth/fitness.location.read'
    ].join(' '),
    onSuccess: async (tokenResponse) => {
      try {
        googleFit.setAccessToken(tokenResponse.access_token)
        setIsConnected(true)
        
        if (user) {
          try {
            await userService.updateUser(user.id, {
              googleFitToken: tokenResponse.access_token
            })
          } catch (error) {
            console.error('Failed to update user profile:', error)
            // Don't block the UI or show error for database issues
          }
        }
        
        toast.success('Successfully connected to Google Fit')
      } catch (error) {
        console.error('Error connecting to Google Fit:', error)
        toast.error('Failed to connect to Google Fit')
      }
    },
    onError: (error) => {
      console.error('Google Fit login error:', error)
      toast.error('Failed to connect to Google Fit')
    }
  })

  const connectGoogleFit = async () => {
    setIsLoading(true)
    try {
      login()
      // The login function handles success/error via callbacks
    } catch (error) {
      console.error('Error connecting to Google Fit:', error)
      toast.error('Failed to connect to Google Fit')
      setIsLoading(false)
    }
  }

  const disconnectGoogleFit = async () => {
    setIsLoading(true)
    try {
      // Update UI state immediately
      googleFit.setAccessToken(null)
      setIsConnected(false)
      
      // Update database in the background
      if (user) {
        userService.updateUser(user.id, {
          googleFitToken: null
        }).catch(error => {
          console.error('Failed to update user profile:', error)
        })
      }
      
      toast.success('Disconnected from Google Fit')
    } catch (error) {
      console.error('Error disconnecting from Google Fit:', error)
      toast.error('Failed to disconnect from Google Fit')
    } finally {
      setIsLoading(false)
    }
  }

  const getFitnessData = useCallback(async (startTime: Date, endTime: Date) => {
    if (typeof window === 'undefined') {
      console.error('Cannot fetch fitness data on server side')
      return {
        steps: 0,
        distance: 0,
        calories: 0,
        activeMinutes: 0
      }
    }
    
    try {
      return await googleFit.getFitnessData(startTime, endTime)
    } catch (error) {
      console.error('Error fetching fitness data:', error)
      throw error
    }
  }, [])

  return (
    <GoogleFitContext.Provider
      value={{
        isConnected,
        connectGoogleFit,
        disconnectGoogleFit,
        getFitnessData,
        isLoading
      }}
    >
      {children}
    </GoogleFitContext.Provider>
  )
}

export function GoogleFitProvider({ children }: { children: React.ReactNode }) {
  return <GoogleFitProviderContent>{children}</GoogleFitProviderContent>
}

export function useGoogleFit() {
  const context = useContext(GoogleFitContext)
  if (context === undefined) {
    throw new Error('useGoogleFit must be used within a GoogleFitProvider')
  }
  return context
} 