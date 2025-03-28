"use client"

import { Button } from "@/components/ui/button"
import { useGoogleFit } from "@/contexts/GoogleFitContext"
import { FcGoogle } from "react-icons/fc"
import { toast } from "sonner"

export function GoogleFitConnect() {
  const { isConnected, connectGoogleFit, disconnectGoogleFit, isLoading } = useGoogleFit()

  const handleConnect = async () => {
    try {
      await connectGoogleFit()
      toast.success('Successfully connected to Google Fit')
    } catch (error) {
      toast.error('Failed to connect to Google Fit')
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnectGoogleFit()
      toast.success('Successfully disconnected from Google Fit')
    } catch (error) {
      toast.error('Failed to disconnect from Google Fit')
    }
  }

  return (
    <Button
      variant={isConnected ? "destructive" : "outline"}
      onClick={isConnected ? handleDisconnect : handleConnect}
      disabled={isLoading}
      className="w-full"
    >
      <FcGoogle className="mr-2 h-4 w-4" />
      {isConnected ? "Disconnect Google Fit" : "Connect Google Fit"}
    </Button>
  )
} 