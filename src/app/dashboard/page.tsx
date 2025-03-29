'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";
import { Trophy, Activity, Timer, Footprints, Flame } from "lucide-react";
import { useGoogleFit } from '@/contexts/GoogleFitContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  deadline: Date;
  reward: number;
}

interface FitnessData {
  steps: number;
  distance: number;
  calories: number;
  activeMinutes: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { isConnected, connectGoogleFit, getFitnessData, isLoading: isGoogleFitLoading } = useGoogleFit();
  const router = useRouter();
  const [fitnessDataLoaded, setFitnessDataLoaded] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    steps: 0,
    distance: 0,
    calories: 0,
    activeMinutes: 0
  });
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);

  // Only fetch fitness data after explicit connection AND when user clicks to fetch data
  const fetchFitnessData = async () => {
    if (!isConnected) {
      toast.error('Please connect to Google Fit first');
      return;
    }
    
    setFetchingData(true);
    try {
      const endTime = new Date();
      const startTime = new Date();
      startTime.setDate(startTime.getDate() - 7); // Get data from the last 7 days
      
      const data = await getFitnessData(startTime, endTime);
      console.log('Fitness data from API:', data);
      
      // Use exactly what the API returns
      setFitnessData(data);
      setFitnessDataLoaded(true);
      
      toast.success('Fitness data updated', {
        description: 'Your latest fitness data has been loaded'
      });
    } catch (error) {
      console.error('Error fetching fitness data:', error);
      toast.error('Failed to fetch fitness data');
    } finally {
      setFetchingData(false);
    }
  };

  // Update challenges based on fitness data
  useEffect(() => {
    if (fitnessDataLoaded) {
      setActiveChallenges([
        {
          id: '1',
          title: '10K Steps Challenge',
          description: 'Complete 10,000 steps daily for 7 days',
          target: 10000,
          progress: fitnessData.steps,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          reward: 5
        },
        {
          id: '2',
          title: 'Active Minutes Challenge',
          description: 'Achieve 30 minutes of activity daily',
          target: 30,
          progress: fitnessData.activeMinutes,
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
          reward: 3
        }
      ]);
    }
  }, [fitnessData, fitnessDataLoaded]);

  const handleConnectGoogleFit = async () => {
    try {
      await connectGoogleFit();
    } catch (error) {
      console.error('Failed to connect to Google Fit:', error);
      toast.error('Failed to connect to Google Fit');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fitness Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {isConnected 
              ? "Your Google Fit account is connected. You can now view your fitness data."
              : "Connect your Google Fit account to track your fitness progress and participate in challenges."}
          </p>
          
          {!isConnected ? (
            <Button 
              onClick={handleConnectGoogleFit} 
              disabled={isGoogleFitLoading}
              className="w-full"
            >
              {isGoogleFitLoading ? 'Connecting...' : 'Connect Google Fit'}
            </Button>
          ) : (
            <div className="flex gap-4">
              <Button 
                onClick={fetchFitnessData}
                disabled={fetchingData}
                className="flex-1"
              >
                {fetchingData ? 'Loading Data...' : fitnessDataLoaded ? 'Refresh Fitness Data' : 'Load Fitness Data'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && fitnessDataLoaded && (
        <>
          {/* Fitness Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Steps</CardTitle>
                <Footprints className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fitnessData.steps.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Goal: 10,000 steps</p>
                <Progress value={(fitnessData.steps / 10000) * 100} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Distance</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fitnessData.distance.toFixed(2)} km</div>
                <p className="text-xs text-muted-foreground">Daily Progress</p>
                <Progress value={(fitnessData.distance / 5) * 100} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Minutes</CardTitle>
                <Timer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fitnessData.activeMinutes} min</div>
                <p className="text-xs text-muted-foreground">Goal: 30 minutes</p>
                <Progress value={(fitnessData.activeMinutes / 30) * 100} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calories</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(fitnessData.calories)}</div>
                <p className="text-xs text-muted-foreground">Calories Burned</p>
                <Progress value={(fitnessData.calories / 2000) * 100} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Active Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activeChallenges.map((challenge) => (
                  <div key={challenge.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{challenge.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        Reward: {challenge.reward} SOL
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.target) * 100} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 