"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/contexts/WalletContext"
import { Loader2, Wallet as WalletIcon, ExternalLink, Copy, LogOut } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

export function WalletButton() {
  const { 
    isConnected, 
    publicKey, 
    isLoading, 
    connectWallet, 
    disconnectWallet, 
    shortenAddress,
    isPhantomInstalled
  } = useWallet()
  
  const [mounted, setMounted] = useState(false)
  
  // Only show component after it's mounted to prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <Button variant="outline" disabled className="w-[140px]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Wallet
      </Button>
    )
  }
  
  if (!isPhantomInstalled) {
    return (
      <Button 
        variant="outline" 
        onClick={() => window.open('https://phantom.app/', '_blank')}
        className="gap-2"
      >
        <WalletIcon className="h-4 w-4" />
        Install Phantom
      </Button>
    )
  }
  
  if (!isConnected) {
    return (
      <Button 
        variant="outline" 
        onClick={connectWallet} 
        disabled={isLoading}
        className="gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <WalletIcon className="h-4 w-4" />
        )}
        Connect Wallet
      </Button>
    )
  }

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey)
      toast.success('Address copied to clipboard')
    }
  }

  const viewOnExplorer = () => {
    if (publicKey) {
      window.open(`https://explorer.solana.com/address/${publicKey}?cluster=devnet`, '_blank')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <WalletIcon className="h-4 w-4" />
          {shortenAddress(publicKey)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyAddress} className="gap-2 cursor-pointer">
          <Copy className="h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={viewOnExplorer} className="gap-2 cursor-pointer">
          <ExternalLink className="h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={disconnectWallet} 
          disabled={isLoading}
          className="gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 