'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Progress } from "@/components/ui/progress";
import { Trophy, Activity, Timer, Footprints, Flame, RefreshCw, ChevronRight } from "lucide-react";
import { useGoogleFit } from '@/contexts/GoogleFitContext';
import { WalletAccount } from "@/components/wallet/wallet-account";
import { useWallet } from "@/contexts/WalletContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { isConnected: isWalletConnected } = useWallet();
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Dashboard header section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your fitness progress and earn rewards
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on large screens */}
          <div className="xl:col-span-2 space-y-6">
            {/* Fitness tracking section */}
            <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-primary/5 to-background">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      Fitness Tracking
                      {isConnected && <Badge variant="outline" className="text-xs">Connected</Badge>}
                    </CardTitle>
                    <CardDescription>
                      Track your activity with Google Fit integration
                    </CardDescription>
                  </div>
                  {isConnected && fitnessDataLoaded && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={fetchFitnessData}
                      disabled={fetchingData}
                      className="gap-2"
                    >
                      {fetchingData ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Refresh
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {!isConnected ? (
                  <div className="bg-muted/50 p-6 rounded-lg text-center space-y-4">
                    <p className="text-muted-foreground mb-4">
                      Connect your Google Fit account to track your fitness progress and participate in challenges.
                    </p>
                    <Button 
                      onClick={handleConnectGoogleFit} 
                      disabled={isGoogleFitLoading}
                      className="w-full sm:w-auto"
                    >
                      {isGoogleFitLoading ? 'Connecting...' : 'Connect Google Fit'}
                    </Button>
                  </div>
                ) : !fitnessDataLoaded ? (
                  <div className="bg-muted/50 p-6 rounded-lg text-center space-y-4">
                    <p className="text-muted-foreground mb-4">
                      Your Google Fit account is connected. Load your fitness data to see your stats.
                    </p>
                    <Button 
                      onClick={fetchFitnessData}
                      disabled={fetchingData}
                      className="w-full sm:w-auto"
                    >
                      {fetchingData ? 'Loading Data...' : 'Load Fitness Data'}
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                      <div className="bg-background rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-muted-foreground">Steps</h3>
                          <Footprints className="h-4 w-4 text-primary/70" />
                        </div>
                        <div className="text-2xl font-bold">{fitnessData.steps.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Goal: 10,000 steps</p>
                        <Progress value={(fitnessData.steps / 10000) * 100} className="mt-2 h-1.5" />
                      </div>
                      
                      <div className="bg-background rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-muted-foreground">Distance</h3>
                          <Activity className="h-4 w-4 text-primary/70" />
                        </div>
                        <div className="text-2xl font-bold">{fitnessData.distance.toFixed(2)} km</div>
                        <p className="text-xs text-muted-foreground mt-1">Daily Progress</p>
                        <Progress value={(fitnessData.distance / 5) * 100} className="mt-2 h-1.5" />
                      </div>
                      
                      <div className="bg-background rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-muted-foreground">Active Time</h3>
                          <Timer className="h-4 w-4 text-primary/70" />
                        </div>
                        <div className="text-2xl font-bold">{Math.floor(fitnessData.activeMinutes)} min</div>
                        <p className="text-xs text-muted-foreground mt-1">Goal: 30 minutes</p>
                        <Progress value={(Math.min(fitnessData.activeMinutes, 30) / 30) * 100} className="mt-2 h-1.5" />
                      </div>
                      
                      <div className="bg-background rounded-lg p-4 shadow-sm border">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-muted-foreground">Calories</h3>
                          <Flame className="h-4 w-4 text-primary/70" />
                        </div>
                        <div className="text-2xl font-bold">{Math.round(fitnessData.calories)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Calories Burned</p>
                        <Progress value={(fitnessData.calories / 2000) * 100} className="mt-2 h-1.5" />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Active Challenges */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" />
                    Active Challenges
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.push('/dashboard/challenges')}>
                    View All <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Complete challenges to earn SOL rewards</CardDescription>
              </CardHeader>
              <CardContent>
                {!isConnected || !fitnessDataLoaded ? (
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">
                      Connect your Google Fit account and load your fitness data to see challenges.
                    </p>
                    <div className="flex flex-col gap-2 items-center">
                      {Array(2).fill(0).map((_, i) => (
                        <div key={i} className="w-full max-w-2xl">
                          <Skeleton className="h-20 rounded-lg" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeChallenges.map((challenge) => (
                      <div key={challenge.id} className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{challenge.title}</h3>
                            <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-normal">
                              Ends {formatDate(challenge.deadline)}
                            </Badge>
                            <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white">
                              {challenge.reward} SOL
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-1 mt-4">
                          <div className="flex justify-between text-sm">
                            <span>Progress: {Math.round((challenge.progress / challenge.target) * 100)}%</span>
                            <span className="text-primary font-medium">{challenge.progress} / {challenge.target}</span>
                          </div>
                          <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard/challenges')}>
                  Browse All Challenges
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Wallet section */}
            {isWalletConnected ? (
              <WalletAccount />
            ) : (
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle>Connect Wallet</CardTitle>
                  <CardDescription>Connect your Solana wallet to claim rewards</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-6">
                  <p className="mb-4 text-muted-foreground">
                    You need to connect your Solana wallet to participate in challenges and claim rewards.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick links/stats */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Your activity summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Completed Challenges</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Total Rewards Earned</span>
                    <span className="font-medium">12.5 SOL</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Weekly Activity Streak</span>
                    <span className="font-medium">5 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Rank</span>
                    <Badge>Top 10%</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard/stats')}>
                  View Detailed Stats
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 