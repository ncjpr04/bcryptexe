import { toast } from "sonner"

interface FitnessData {
  steps: number
  distance: number
  calories: number
  activeMinutes: number
}

export class GoogleFitService {
  private static instance: GoogleFitService
  private accessToken: string | null = null

  private constructor() {}

  static getInstance(): GoogleFitService {
    if (!GoogleFitService.instance) {
      GoogleFitService.instance = new GoogleFitService()
    }
    return GoogleFitService.instance
  }

  setAccessToken(token: string | null) {
    this.accessToken = token
  }

  async getFitnessData(startTime: Date, endTime: Date): Promise<FitnessData> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Google Fit')
    }

    try {
      const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aggregateBy: [
            {
              dataTypeName: 'com.google.step_count.delta',
              dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
            },
            {
              dataTypeName: 'com.google.distance.delta',
              dataSourceId: 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta'
            },
            {
              dataTypeName: 'com.google.calories.expended',
              dataSourceId: 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended'
            },
            {
              dataTypeName: 'com.google.active_minutes',
              dataSourceId: 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes'
            }
          ],
          bucketByTime: { durationMillis: endTime.getTime() - startTime.getTime() },
          startTimeMillis: startTime.getTime(),
          endTimeMillis: endTime.getTime(),
        })
      })

      if (!response.ok) {
        throw new Error('Failed to fetch fitness data')
      }

      const data = await response.json()
      const fitnessData: FitnessData = {
        steps: 0,
        distance: 0,
        calories: 0,
        activeMinutes: 0
      }

      data.bucket.forEach((bucket: any) => {
        bucket.dataset.forEach((dataset: any) => {
          const value = dataset.point[0]?.value[0]
          if (!value) return

          switch (dataset.dataSourceId) {
            case 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps':
              fitnessData.steps += value.intVal || 0
              break
            case 'derived:com.google.distance.delta:com.google.android.gms:merge_distance_delta':
              fitnessData.distance += (value.fpVal || 0) / 1000 // Convert to kilometers
              break
            case 'derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended':
              fitnessData.calories += value.fpVal || 0
              break
            case 'derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes':
              fitnessData.activeMinutes += value.intVal || 0
              break
          }
        })
      })

      return fitnessData
    } catch (error) {
      console.error('Error fetching fitness data:', error)
      throw error
    }
  }
}

export const googleFit = GoogleFitService.getInstance()

// Add type definitions for the global gapi object
declare global {
  interface Window {
    gapi: any
  }
} 