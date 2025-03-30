"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, ArrowLeft, Filter, Users, Coins, Target, Medal, Calendar, Loader2, BarChart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { challengeService, Challenge } from '@/lib/challengeService';
import { toast } from 'sonner';

export default function ActiveChallengesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch challenges from Firebase
  useEffect(() => {
    const fetchChallenges = async () => {
      if (!isAuthenticated || !user) {
        // Redirect to sign in if not authenticated
        router.push('/signin');
        return;
      }

      setIsLoading(true);
      try {
        const activeChallenges = await challengeService.getChallengesJoinedByUser(user.id);
        // Sort challenges by start date, most recent first
        const sortedChallenges = activeChallenges.sort((a, b) => {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
        setChallenges(sortedChallenges);
      } catch (error) {
        console.error('Error fetching active challenges:', error);
        toast.error('Failed to load your active challenges');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, [user, isAuthenticated, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days remaining in challenge
  const getDaysRemaining = (startDate: string, duration: number) => {
    const start = new Date(startDate).getTime();
    const end = start + (duration * 24 * 60 * 60 * 1000);
    const now = Date.now();
    
    if (now < start) {
      return "Not started";
    }
    
    const daysRemaining = Math.ceil((end - now) / (24 * 60 * 60 * 1000));
    
    if (daysRemaining <= 0) {
      return "Ended";
    }
    
    return `${daysRemaining} days left`;
  };

  // Generate random progress for demo purposes
  // In a real app, this would come from user tracking data
  const getRandomProgress = () => {
    return Math.floor(Math.random() * 100);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/challenges')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Active Challenges</h1>
        </div>
        <Button onClick={() => router.push('/dashboard/challenges/available')}>
          Find New Challenges
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Track your progress in challenges you've joined
      </p>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading your challenges...</span>
        </div>
      )}

      {/* No Challenges State */}
      {!isLoading && challenges.length === 0 && (
        <div className="text-center py-16 border rounded-lg border-dashed">
          <h3 className="text-lg font-medium mb-2">No active challenges</h3>
          <p className="text-muted-foreground mb-4">
            You haven't joined any challenges yet. Explore available challenges to get started.
          </p>
          <Button onClick={() => router.push('/dashboard/challenges/available')}>
            Browse Challenges
          </Button>
        </div>
      )}

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => {
          const progress = getRandomProgress(); // In a real app, get actual progress
          
          return (
            <Card key={challenge.id} className="flex flex-col h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "mb-2",
                        challenge.difficulty === "Beginner" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800",
                        challenge.difficulty === "Intermediate" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800",
                        challenge.difficulty === "Advanced" && "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border-purple-200 dark:border-purple-800"
                      )}
                    >
                      {challenge.difficulty}
                    </Badge>
                    <CardTitle className="text-xl">{challenge.title}</CardTitle>
                  </div>
                  <Badge className="px-2 py-1">
                    {challenge.type}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-1">
                  {challenge.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0 flex-grow space-y-4">
                {/* Time Info */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{challenge.duration} days</span>
                  </div>
                  <Badge variant="outline">
                    {getDaysRemaining(challenge.startDate, challenge.duration)}
                  </Badge>
                </div>
                
                <Separator />
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-semibold">Your Progress</span>
                    </div>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                {/* Goal Info */}
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex items-center mb-2">
                    <Target className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-semibold">Challenge Goal</span>
                  </div>
                  <p className="text-center font-medium">
                    {challenge.goal.target} {challenge.goal.unit} {challenge.goal.type}
                  </p>
                  <div className="mt-2 text-sm text-center text-muted-foreground">
                    <span>Current: </span>
                    <span className="font-medium">
                      {Math.round(challenge.goal.target * progress / 100)} {challenge.goal.unit}
                    </span>
                    <span> of {challenge.goal.target} {challenge.goal.unit}</span>
                  </div>
                </div>
                
                {/* Prize Info */}
                <div>
                  <div className="flex items-center mb-2">
                    <Trophy className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-semibold">Prize Pool</span>
                    <span className="ml-auto font-medium">{challenge.prizePool} SOL</span>
                  </div>
                </div>
                
                {/* Dates */}
                <div className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Started:</span>
                    <span>{formatDate(challenge.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ends:</span>
                    <span>{formatDate(new Date(new Date(challenge.startDate).getTime() + challenge.duration * 24 * 60 * 60 * 1000).toISOString())}</span>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="pt-4 mt-auto">
                <Button className="w-full" variant="outline">
                  View Challenge Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 