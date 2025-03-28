"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { GoogleFitService } from '@/lib/googleFit'
import { useAuth } from './AuthContext'
import { database } from '@/lib/database'

interface GoogleFitContextType {
  isConnected: boolean
  connectGoogleFit: () => Promise<void>
  disconnectGoogleFit: () => Promise<void>
  getFitnessData: (startTime: Date, endTime: Date) => Promise<any>
  isLoading: boolean
}

const GoogleFitContext = createContext<GoogleFitContextType | undefined>(undefined)

export function GoogleFitProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const googleFit = GoogleFitService.getInstance()

  useEffect(() => {
    const initializeGoogleFit = async () => {
      if (user) {
        try {
          await googleFit.initialize()
          setIsConnected(googleFit.isSignedIn())
        } catch (error) {
          console.error('Error initializing Google Fit:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    initializeGoogleFit()
  }, [user])

  const connectGoogleFit = async () => {
    try {
      setIsLoading(true)
      await googleFit.signIn()
      setIsConnected(true)
      
      // Update user profile with Google Fit connection status
      if (user) {
        await database.updateUserProfile(user.uid, {
          isGoogleFitConnected: true
        })
      }
    } catch (error) {
      console.error('Error connecting to Google Fit:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectGoogleFit = async () => {
    try {
      setIsLoading(true)
      await googleFit.signOut()
      setIsConnected(false)
      
      // Update user profile with Google Fit connection status
      if (user) {
        await database.updateUserProfile(user.uid, {
          isGoogleFitConnected: false
        })
      }
    } catch (error) {
      console.error('Error disconnecting from Google Fit:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getFitnessData = async (startTime: Date, endTime: Date) => {
    try {
      return await googleFit.getFitnessData(startTime, endTime)
    } catch (error) {
      console.error('Error fetching fitness data:', error)
      throw error
    }
  }

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

export function useGoogleFit() {
  const context = useContext(GoogleFitContext)
  if (context === undefined) {
    throw new Error('useGoogleFit must be used within a GoogleFitProvider')
  }
  return context
} 