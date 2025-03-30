import { toast } from "sonner"

interface FitnessData {
  steps: number
  distance: number
  calories: number
  activeMinutes: number
}

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

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
    // Only set token on client side
    if (isClient) {
      this.accessToken = token
      
      // Optionally store in localStorage for persistence
      if (token) {
        localStorage.setItem('google_fit_token', token)
      } else {
        localStorage.removeItem('google_fit_token')
      }
    }
  }

  async getFitnessData(startTime: Date, endTime: Date): Promise<FitnessData> {
    // Ensure we're on client side
    if (!isClient) {
      console.error('Cannot access Google Fit on server side')
      return { steps: 0, distance: 0, calories: 0, activeMinutes: 0 }
    }
    
    if (!this.accessToken) {
      // Try to recover token from localStorage
      const storedToken = localStorage.getItem('google_fit_token')
      if (storedToken) {
        this.accessToken = storedToken
      } else {
        throw new Error('Not authenticated with Google Fit')
      }
    }

    try {
      // Expand the time range to last 7 days to increase chances of finding data
      const expandedStartTime = new Date();
      expandedStartTime.setDate(expandedStartTime.getDate() - 7); // Last 7 days
      
      console.log('Fetching fitness data from', expandedStartTime, 'to', endTime);
      
      // First try to get steps data, which is usually available
      const stepsData = await this.fetchSingleDataType(
        'com.google.step_count.delta', 
        expandedStartTime, 
        endTime
      );
      
      // Try to get other metrics individually to isolate permission issues
      let distanceData = { distance: 0 };
      let caloriesData = { calories: 0 };
      let activeMinutesData = { activeMinutes: 0 };
      
      try {
        distanceData = await this.fetchSingleDataType(
          'com.google.distance.delta', 
          expandedStartTime, 
          endTime
        );
      } catch (error) {
        console.warn('Could not fetch distance data:', error);
      }
      
      try {
        caloriesData = await this.fetchSingleDataType(
          'com.google.calories.expended', 
          expandedStartTime, 
          endTime
        );
      } catch (error) {
        console.warn('Could not fetch calories data:', error);
      }
      
      try {
        activeMinutesData = await this.fetchSingleDataType(
          'com.google.activity.segment', 
          expandedStartTime, 
          endTime
        );
      } catch (error) {
        console.warn('Could not fetch active minutes data:', error);
      }
      
      // Combine all available data
      const combinedData = {
        steps: stepsData.steps || 0,
        distance: distanceData.distance || 0,
        calories: caloriesData.calories || 0,
        activeMinutes: activeMinutesData.activeMinutes || 0
      };
      
      console.log('Combined fitness data:', combinedData);
      
      // Return the actual data, even if it's all zeros
      return combinedData;
    } catch (error) {
      console.error('Error fetching fitness data:', error);
      
      // Return zeros instead of mock data
      return {
        steps: 0,
        distance: 0,
        calories: 0,
        activeMinutes: 0
      };
    }
  }

  // Helper method to fetch a single data type
  private async fetchSingleDataType(dataTypeName: string, startTime: Date, endTime: Date): Promise<any> {
    if (!isClient || !this.accessToken) {
      return {}; // Empty result if not on client or no token
    }
    
    const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [
          { dataTypeName }
        ],
        bucketByTime: { durationMillis: endTime.getTime() - startTime.getTime() },
        startTimeMillis: startTime.getTime(),
        endTimeMillis: endTime.getTime(),
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google Fit API error for ${dataTypeName}:`, response.status, errorText);
      throw new Error(`Failed to fetch ${dataTypeName} data: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log(`Raw ${dataTypeName} data:`, JSON.stringify(data, null, 2));
    
    // Process data based on type
    const result: any = {};
    
    // Early return if no data
    if (!data.bucket || data.bucket.length === 0) {
      return result;
    }
    
    // The way Google Fit aggregates data depends on the data type
    data.bucket.forEach((bucket: any) => {
      if (!bucket.dataset || !Array.isArray(bucket.dataset)) return;
      
      bucket.dataset.forEach((dataset: any) => {
        if (!dataset.point || !Array.isArray(dataset.point)) return;
        
        // Some valid datasets might have empty point arrays, that's normal
        if (dataset.point.length === 0) return;
        
        dataset.point.forEach((point: any) => {
          if (!point.value || !Array.isArray(point.value)) return;
          
          // For activity segments, we need to calculate active minutes differently
          if (dataTypeName === 'com.google.activity.segment') {
            // Get activity type and duration
            const activityType = point.value[0]?.intVal || 0;
            const startTimeMillis = parseInt(point.startTimeNanos) / 1000000 || 0;
            const endTimeMillis = parseInt(point.endTimeNanos) / 1000000 || 0;
            const durationMinutes = (endTimeMillis - startTimeMillis) / (1000 * 60);
            
            // Activity types 7-9 are walking, running, biking
            // Activity types 9-19 are various fitness activities
            // Full list: https://developers.google.com/fit/rest/v1/reference/activity-types
            if (activityType >= 7 && activityType <= 19) {
              result.activeMinutes = (result.activeMinutes || 0) + durationMinutes;
            }
            return;
          }
          
          // For other data types, aggregate the values
          point.value.forEach((valueObj: any) => {
            if (dataTypeName === 'com.google.step_count.delta') {
              result.steps = (result.steps || 0) + (valueObj.intVal || 0);
            } else if (dataTypeName === 'com.google.distance.delta') {
              result.distance = (result.distance || 0) + ((valueObj.fpVal || 0) / 1000); // Convert to kilometers
            } else if (dataTypeName === 'com.google.calories.expended') {
              result.calories = (result.calories || 0) + (valueObj.fpVal || 0);
            }
          });
        });
      });
    });
    
    return result;
  }
}

// Only create instance on client side
export const googleFit = isClient ? GoogleFitService.getInstance() : {} as GoogleFitService;

// Add type definitions for the global gapi object
declare global {
  interface Window {
    gapi: any
  }
} 