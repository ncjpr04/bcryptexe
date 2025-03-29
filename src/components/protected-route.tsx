'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader } from '@/components/ui/loader'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    // Only redirect if we're done loading and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to signin')
      setIsNavigating(true)
      // Use replace instead of push to avoid adding to history
      router.replace('/signin')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading state when checking auth or during navigation
  if (isLoading || isNavigating) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size="lg" text={isNavigating ? "Redirecting..." : "Checking authentication..."} />
      </div>
    )
  }

  // User is authenticated, render children
  if (isAuthenticated) {
    return <>{children}</>
  }

  // Don't render anything while we're about to redirect
  return null
} 