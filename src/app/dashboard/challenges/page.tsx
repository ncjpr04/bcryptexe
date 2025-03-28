"use client"

import { Loader } from "@/components/ui/loader"
import { useState, useEffect } from "react"

export default function ChallengesPage() {
  const [isLoading, setIsLoading] = useState(true)

  // Example usage in a data fetching scenario
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        // Fetch your data here
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching challenges:', error)
        setIsLoading(false)
      }
    }

    fetchChallenges()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader text="Loading challenges..." />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Challenges</h1>
      {/* Add challenges content here */}
    </div>
  )
} 