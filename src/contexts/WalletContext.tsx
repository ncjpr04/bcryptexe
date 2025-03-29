"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { phantomWallet, WalletConnection } from '@/lib/wallet/phantom'
import { toast } from 'sonner'

interface WalletContextType {
  publicKey: string | null
  isConnected: boolean
  isPhantomInstalled: boolean
  isLoading: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
  shortenAddress: (address: string | null, chars?: number) => string
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [connection, setConnection] = useState<WalletConnection>({
    publicKey: null,
    isConnected: false,
    isPhantomInstalled: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Check if we're on the client side
  useEffect(() => {
    setIsClient(true)
    const initialConnection = phantomWallet.checkConnection()
    setConnection(initialConnection)

    const removeListener = phantomWallet.addConnectionListener((newConnection) => {
      setConnection(newConnection)
    })

    return () => {
      removeListener()
    }
  }, [])

  const connectWallet = async () => {
    if (!isClient) return
    
    setIsLoading(true)
    try {
      const result = await phantomWallet.connect()
      setConnection(result)
    } catch (error) {
      console.error('Error in connectWallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = async () => {
    if (!isClient) return
    
    setIsLoading(true)
    try {
      await phantomWallet.disconnect()
    } catch (error) {
      console.error('Error in disconnectWallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <WalletContext.Provider
      value={{
        publicKey: connection.publicKey,
        isConnected: connection.isConnected,
        isPhantomInstalled: connection.isPhantomInstalled,
        isLoading,
        connectWallet,
        disconnectWallet,
        shortenAddress: phantomWallet.shortenAddress
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 