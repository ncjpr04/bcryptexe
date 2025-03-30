"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, ArrowLeft, Filter, Users, Coins, Target, Medal, Calendar, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/AuthContext';
import { challengeService, Challenge } from '@/lib/challengeService';
import { toast } from 'sonner';

export default function AvailableChallengesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [joiningChallenge, setJoiningChallenge] = useState<string | null>(null);

  // Fetch challenges from Firebase
  useEffect(() => {
    const fetchChallenges = async () => {
      setIsLoading(true);
      try {
        const allChallenges = await challengeService.getAllChallenges();
        // Sort challenges by closest deadline first
        const sortedChallenges = allChallenges.sort((a, b) => {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
        setChallenges(sortedChallenges);
        setFilteredChallenges(sortedChallenges);
      } catch (error) {
        console.error('Error fetching challenges:', error);
        toast.error('Failed to load challenges');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Filter challenges when filter criteria change
  useEffect(() => {
    let result = [...challenges];

    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      result = result.filter(challenge => challenge.difficulty.toLowerCase() === difficultyFilter.toLowerCase());
    }

    // Apply duration filter
    if (durationFilter !== 'all') {
      switch (durationFilter) {
        case 'short':
          result = result.filter(challenge => challenge.duration <= 7);
          break;
        case 'medium':
          result = result.filter(challenge => challenge.duration > 7 && challenge.duration <= 30);
          break;
        case 'long':
          result = result.filter(challenge => challenge.duration > 30);
          break;
      }
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(challenge => challenge.type.toLowerCase() === typeFilter.toLowerCase());
    }

    setFilteredChallenges(result);
  }, [challenges, difficultyFilter, durationFilter, typeFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get all unique challenge types
  const uniqueTypes = Array.from(new Set(challenges.map(challenge => challenge.type)));

  // Function to join a challenge
  const handleJoinChallenge = async (challengeId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('You must be logged in to join a challenge');
      return;
    }

    setJoiningChallenge(challengeId);
    try {
      await challengeService.joinChallenge(challengeId, user.id);
      
      // Update the challenge in the state to reflect new participant count
      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, currentParticipants: challenge.currentParticipants + 1 } 
            : challenge
        )
      );
      
      toast.success('Successfully joined the challenge!');
      
      // Navigate to active challenges
      router.push('/dashboard/challenges/active');
    } catch (error: any) {
      console.error('Error joining challenge:', error);
      toast.error(error.message || 'Failed to join challenge');
    } finally {
      setJoiningChallenge(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/challenges')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Available Challenges</h1>
        </div>
        <Button onClick={() => router.push('/dashboard/challenges/create')}>
          Create Challenge
        </Button>
      </div>
      
      <p className="text-muted-foreground">
        Browse and join new fitness challenges to earn rewards
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select defaultValue="all" onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all" onValueChange={setDurationFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Durations</SelectItem>
              <SelectItem value="short">Short (≤ 7 days)</SelectItem>
              <SelectItem value="medium">Medium (8-30 days)</SelectItem>
              <SelectItem value="long">Long (> 30 days)</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all" onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading challenges...</span>
        </div>
      )}

      {/* No Challenges State */}
      {!isLoading && filteredChallenges.length === 0 && (
        <div className="text-center py-16 border rounded-lg border-dashed">
          <h3 className="text-lg font-medium mb-2">No challenges found</h3>
          <p className="text-muted-foreground mb-4">
            {challenges.length === 0 
              ? "There are no available challenges at the moment." 
              : "No challenges match your current filters."}
          </p>
          {challenges.length === 0 ? (
            <Button onClick={() => router.push('/dashboard/challenges/create')}>
              Create the first challenge
            </Button>
          ) : (
            <Button variant="outline" onClick={() => {
              setDifficultyFilter('all');
              setDurationFilter('all');
              setTypeFilter('all');
            }}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
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
            <CardContent className="pb-0 flex-grow">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {/* Basic Info */}
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{challenge.duration} days</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{challenge.currentParticipants}/{challenge.maxParticipants}</span>
                </div>
                <div className="flex items-center">
                  <Coins className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{challenge.entryFee > 0 ? `${challenge.entryFee} SOL` : 'Free'}</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">{challenge.prizePool} SOL</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Goal Info */}
              <div>
                <div className="flex items-center mb-2">
                  <Target className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-semibold">Goal</span>
                </div>
                <p className="text-center font-medium text-lg">
                  {challenge.goal.target} {challenge.goal.unit} {challenge.goal.type}
                </p>
              </div>
              
              <Separator className="my-4" />
              
              {/* Time Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Registration Deadline:</span>
                  <span className="font-medium">{formatDate(challenge.deadline)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Starts On:</span>
                  <span className="font-medium">{formatDate(challenge.startDate)}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              {/* Prizes */}
              <div>
                <div className="flex items-center mb-2">
                  <Medal className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-semibold">Prizes</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {challenge.prizes.slice(0, 3).map((prize, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cn(
                            "text-center p-1 rounded",
                            index === 0 && "bg-amber-100 dark:bg-amber-900/40",
                            index === 1 && "bg-slate-100 dark:bg-slate-800/60",
                            index === 2 && "bg-orange-100 dark:bg-orange-900/30"
                          )}>
                            <div className="font-medium">{prize.position}</div>
                            <div className="text-sm font-semibold">{prize.amount} SOL</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{prize.percentage}% of prize pool</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
                {challenge.prizes.length > 3 && (
                  <div className="text-sm text-center mt-2 text-muted-foreground">
                    + {challenge.prizes.length - 3} more positions
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-4">
                {challenge.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4 mt-auto">
              <Button 
                className="w-full" 
                onClick={() => handleJoinChallenge(challenge.id)}
                disabled={
                  joiningChallenge === challenge.id || 
                  challenge.currentParticipants >= challenge.maxParticipants
                }
              >
                {joiningChallenge === challenge.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : challenge.currentParticipants >= challenge.maxParticipants ? (
                  'Full'
                ) : (
                  'Join Challenge'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 