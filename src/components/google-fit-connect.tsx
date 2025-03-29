"use client"

import { Button } from "@/components/ui/button"
import { useGoogleFit } from "@/contexts/GoogleFitContext"
import { FcGoogle } from "react-icons/fc"
import { Loader2 } from "lucide-react"

export function GoogleFitConnect() {
  const { isConnected, connectGoogleFit, disconnectGoogleFit, isLoading } = useGoogleFit()

  const handleClick = async () => {
    try {
      if (isConnected) {
        await disconnectGoogleFit()
      } else {
        await connectGoogleFit()
      }
    } catch (error) {
      console.error('Error handling Google Fit connection:', error)
    }
  }

  return (
    <Button
      variant={isConnected ? "destructive" : "outline"}
      onClick={handleClick}
      disabled={isLoading}
      size="sm"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FcGoogle className="mr-2 h-4 w-4" />
      )}
      {isConnected ? "Disconnect Fit" : "Connect Fit"}
    </Button>
  )
} 