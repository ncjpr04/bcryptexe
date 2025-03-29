"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/contexts/WalletContext"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

export function WalletAccount() {
  const { isConnected, publicKey, shortenAddress } = useWallet()
  const [solBalance, setSolBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
    const fetchBalance = async () => {
      if (!isConnected || !publicKey) {
        setSolBalance(null)
        return
      }
      
      setIsLoading(true)
      try {
        // This is using the Solana web3.js library - you would need to install and import it
        // const connection = new Connection('https://api.devnet.solana.com')
        // const balance = await connection.getBalance(new PublicKey(publicKey))
        // setSolBalance(balance / LAMPORTS_PER_SOL)
        
        // For now, just show a mock balance
        setSolBalance(5.23)
      } catch (error) {
        console.error('Error fetching balance:', error)
        setSolBalance(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBalance()
  }, [isConnected, publicKey])
  
  if (!isConnected) {
    return null
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription>Your Solana wallet details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">Address</div>
          <div className="p-2 bg-muted rounded-md text-xs break-all font-mono">
            {publicKey}
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">Balance</div>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold">
              {solBalance !== null ? `${solBalance} SOL` : 'Error loading balance'}
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => publicKey && window.open(`https://explorer.solana.com/address/${publicKey}?cluster=devnet`, '_blank')}
            className="flex-1"
          >
            View on Explorer
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://solfaucet.com', '_blank')}
            className="flex-1"
          >
            Get Devnet SOL
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 