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
import { useWallet } from '@/contexts/WalletContext';
import { challengeService, Challenge } from '@/lib/challengeService';
import { toast } from 'sonner';
import JoinChallengeButton from '@/components/join-challenge-button';

export default function AvailableChallengesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isConnected } = useWallet();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

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

  const formatDate = (dateString: string | number) => {
    // Handle both string and number formats
    const date = typeof dateString === 'string' ? new Date(dateString) : new Date(dateString);
    
    // Make sure it's a valid date
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get all unique challenge types
  const uniqueTypes = Array.from(new Set(challenges.map(challenge => challenge.type)));

  const isUserJoinedChallenge = (challengeId: string) => {
    return user?.activeChallenges && !!user.activeChallenges[challengeId];
  };

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Available Challenges</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Difficulty</label>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Duration</label>
          <Select value={durationFilter} onValueChange={setDurationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Durations</SelectItem>
              <SelectItem value="short">Short (≤ 7 days)</SelectItem>
              <SelectItem value="medium">Medium (8-30 days)</SelectItem>
              <SelectItem value="long">Long (> 30 days)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Type</label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
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
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No Challenges Found</h3>
          <p className="text-muted-foreground">
            There are no challenges matching your filters. Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{challenge.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {challenge.description.substring(0, 100)}
                      {challenge.description.length > 100 ? '...' : ''}
                    </CardDescription>
                  </div>
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
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Deadline: {formatDate(challenge.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.currentParticipants}/{challenge.maxParticipants}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Target:</h4>
                    <p>
                      {challenge.goal.target} {challenge.goal.unit} {challenge.goal.type}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm">Entry Fee:</h4>
                      <span className="font-medium">{challenge.entryFee > 0 ? `${challenge.entryFee} SOL` : 'Free'}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm">Prize Pool:</h4>
                      <span className="font-medium">{challenge.prizePool} SOL</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Prizes:</h4>
                    <div className="space-y-1">
                      {challenge.prizes.slice(0, 3).map((prize, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span>{prize.position} Place: {prize.amount} SOL</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                {!user ? (
                  <Button disabled className="w-full">Login to Join</Button>
                ) : isUserJoinedChallenge(challenge.id) ? (
                  <Button disabled className="w-full">Already Joined</Button>
                ) : (
                  <JoinChallengeButton 
                    challengeId={challenge.id}
                    title={challenge.title}
                    entryFee={challenge.entryFee}
                    onSuccess={() => {
                      // Update the challenge in the state to reflect new participant count
                      setChallenges(prev => 
                        prev.map(c => 
                          c.id === challenge.id 
                            ? { ...c, currentParticipants: c.currentParticipants + 1 } 
                            : c
                        )
                      );
                      
                      // Navigate to active challenges
                      router.push('/dashboard/challenges/active');
                    }}
                    isDisabled={!isConnected}
                  />
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 