import { toast } from "sonner"

const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.body.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.location.read'
]

interface FitnessData {
  steps: number
  calories: number
  distance: number
  activeMinutes: number
  heartRate?: number
}

export class GoogleFitService {
  private static instance: GoogleFitService
  private auth: any
  private isInitialized: boolean = false

  private constructor() {}

  static getInstance(): GoogleFitService {
    if (!GoogleFitService.instance) {
      GoogleFitService.instance = new GoogleFitService()
    }
    return GoogleFitService.instance
  }

  async initialize() {
    if (this.isInitialized) return

    try {
      // Load the Google API client library
      await new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = 'https://apis.google.com/js/api.js'
        script.onload = resolve
        document.body.appendChild(script)
      })

      // Load the required Google API client library modules
      await new Promise((resolve) => {
        window.gapi.load('client:auth2', resolve)
      })

      // Initialize the Google API client
      await window.gapi.client.init({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: GOOGLE_FIT_SCOPES.join(' ')
      })

      this.auth = window.gapi.auth2.getAuthInstance()
      this.isInitialized = true
    } catch (error) {
      console.error('Error initializing Google Fit:', error)
      throw error
    }
  }

  async signIn(): Promise<void> {
    try {
      await this.initialize()
      await this.auth.signIn()
      toast.success('Successfully connected to Google Fit')
    } catch (error) {
      console.error('Error signing in to Google Fit:', error)
      toast.error('Failed to connect to Google Fit')
      throw error
    }
  }

  async signOut(): Promise<void> {
    try {
      if (this.auth) {
        await this.auth.signOut()
        toast.success('Disconnected from Google Fit')
      }
    } catch (error) {
      console.error('Error signing out from Google Fit:', error)
      toast.error('Failed to disconnect from Google Fit')
      throw error
    }
  }

  async getFitnessData(startTime: Date, endTime: Date): Promise<FitnessData> {
    try {
      await this.initialize()
      
      if (!this.auth.isSignedIn.get()) {
        throw new Error('User not signed in to Google Fit')
      }

      const response = await window.gapi.client.fitness.users.dataset.aggregate({
        userId: 'me',
        aggregateBy: [
          {
            dataTypeName: 'com.google.step_count.delta',
          },
          {
            dataTypeName: 'com.google.calories.expended',
          },
          {
            dataTypeName: 'com.google.distance.delta',
          },
          {
            dataTypeName: 'com.google.active_minutes',
          },
        ],
        bucketByTime: { durationMillis: endTime.getTime() - startTime.getTime() },
        startTimeMillis: startTime.getTime(),
        endTimeMillis: endTime.getTime(),
      })

      // Process and return the fitness data
      const fitnessData: FitnessData = {
        steps: 0,
        calories: 0,
        distance: 0,
        activeMinutes: 0,
      }

      response.result.bucket.forEach((bucket: any) => {
        bucket.dataset.forEach((dataset: any) => {
          if (dataset.point && dataset.point.length > 0) {
            switch (dataset.dataSourceId) {
              case 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps':
                fitnessData.steps += dataset.point[0].value[0].intVal
                break
              case 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended':
                fitnessData.calories += dataset.point[0].value[0].fpVal
                break
              case 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta':
                fitnessData.distance += dataset.point[0].value[0].fpVal
                break
              case 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes':
                fitnessData.activeMinutes += dataset.point[0].value[0].intVal
                break
            }
          }
        })
      })

      return fitnessData
    } catch (error) {
      console.error('Error fetching fitness data:', error)
      toast.error('Failed to fetch fitness data')
      throw error
    }
  }

  isSignedIn(): boolean {
    return this.auth?.isSignedIn.get() || false
  }
}

// Add type definitions for the global gapi object
declare global {
  interface Window {
    gapi: any
  }
} 