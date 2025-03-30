"use client"

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, ArrowLeft, Target, 
  Medal, Calendar, BarChart, Users,
  ChevronRight, Star, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompletedChallenge {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  achievement: {
    target: number;
    achieved: number;
    unit: string;
  };
  duration: number;
  completedOn: string;
  prizePool: number;
  finalRank: number;
  totalParticipants: number;
  reward: number;
  performance: "excellent" | "good" | "average" | "failed";
  status: "completed" | "failed";
  entryFee?: number;
}

const completedChallenges: CompletedChallenge[] = [
  {
    id: "1",
    title: "Summer Fitness Challenge",
    type: "Weight Loss",
    difficulty: "Intermediate",
    achievement: {
      target: 5,
      achieved: 6.2,
      unit: "kg"
    },
    duration: 30,
    completedOn: "2024-03-15",
    prizePool: 200,
    finalRank: 3,
    totalParticipants: 234,
    reward: 30,
    performance: "excellent",
    status: "completed"
  },
  {
    id: "2",
    title: "Weekly Steps Challenge",
    type: "Walking",
    difficulty: "Beginner",
    achievement: {
      target: 70000,
      achieved: 65000,
      unit: "steps"
    },
    duration: 7,
    completedOn: "2024-03-10",
    prizePool: 20,
    finalRank: 15,
    totalParticipants: 567,
    reward: 1,
    performance: "good",
    status: "completed"
  },
  {
    id: "3",
    title: "HIIT Warrior Challenge",
    type: "HIIT",
    difficulty: "Advanced",
    achievement: {
      target: 20,
      achieved: 23,
      unit: "sessions"
    },
    duration: 20,
    completedOn: "2024-03-01",
    prizePool: 150,
    finalRank: 1,
    totalParticipants: 89,
    reward: 75,
    performance: "excellent",
    status: "completed"
  },
  {
    id: "4",
    title: "Marathon Prep Challenge",
    type: "Running",
    difficulty: "Advanced",
    achievement: {
      target: 100,
      achieved: 42,
      unit: "km"
    },
    duration: 30,
    completedOn: "2024-02-28",
    prizePool: 300,
    finalRank: 156,
    totalParticipants: 180,
    reward: 0,
    performance: "failed",
    status: "failed",
    entryFee: 0.5
  },
  {
    id: "5",
    title: "Yoga Flow Journey",
    type: "Yoga",
    difficulty: "Beginner",
    achievement: {
      target: 15,
      achieved: 14,
      unit: "sessions"
    },
    duration: 15,
    completedOn: "2024-02-15",
    prizePool: 50,
    finalRank: 25,
    totalParticipants: 345,
    reward: 2,
    performance: "average",
    status: "completed"
  }
];

export default function CompletedChallengesPage() {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPerformanceBadge = (performance: CompletedChallenge['performance']) => {
    switch (performance) {
      case 'excellent':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-500/20',
          text: 'text-emerald-700 dark:text-emerald-400',
          label: 'Excellent'
        };
      case 'good':
        return {
          bg: 'bg-blue-100 dark:bg-blue-500/20',
          text: 'text-blue-700 dark:text-blue-400',
          label: 'Good'
        };
      case 'failed':
        return {
          bg: 'bg-red-100 dark:bg-red-500/20',
          text: 'text-red-700 dark:text-red-400',
          label: 'Failed'
        };
      default:
        return {
          bg: 'bg-orange-100 dark:bg-orange-500/20',
          text: 'text-orange-700 dark:text-orange-400',
          label: 'Average'
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/challenges')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Completed Challenges</h1>
        </div>
        <Button variant="outline" className="gap-2">
          <BarChart className="h-4 w-4" />
          View Stats
        </Button>
      </div>

      {/* Challenge Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {completedChallenges.map((challenge) => (
          <Card 
            key={challenge.id} 
            className="overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            {/* Card Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20">
                    {challenge.type}
                  </Badge>
                  <Badge 
                    className={cn(
                      "rounded-full",
                      getPerformanceBadge(challenge.performance).bg,
                      getPerformanceBadge(challenge.performance).text
                    )}
                  >
                    {getPerformanceBadge(challenge.performance).label}
                  </Badge>
                </div>
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded-full",
                  challenge.status === "failed" 
                    ? "bg-red-100 dark:bg-red-500/20" 
                    : "bg-amber-100 dark:bg-amber-500/20"
                )}>
                  <Trophy className={cn(
                    "h-4 w-4",
                    challenge.status === "failed"
                      ? "text-red-600 dark:text-red-400"
                      : "text-amber-600 dark:text-amber-400"
                  )} />
                  <span className={cn(
                    "font-semibold",
                    challenge.status === "failed"
                      ? "text-red-600 dark:text-red-400"
                      : "text-amber-600 dark:text-amber-400"
                  )}>
                    {challenge.status === "failed" 
                      ? `-${challenge.entryFee || 0.5} SOL` 
                      : `+${challenge.reward} SOL`
                    }
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-semibold line-clamp-1">{challenge.title}</h3>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-4">
              {/* Achievement */}
              <div className={cn(
                "flex items-center justify-between p-3 rounded-xl",
                challenge.status === "failed" 
                  ? "bg-red-100/50 dark:bg-red-500/10" 
                  : "bg-muted/50"
              )}>
                <div className="flex items-center gap-2">
                  <Target className={cn(
                    "h-4 w-4",
                    challenge.status === "failed" 
                      ? "text-red-500" 
                      : "text-primary"
                  )} />
                  <div>
                    <div className="text-sm font-medium">Achievement</div>
                    <div className="text-xs text-muted-foreground">
                      Target: {challenge.achievement.target} {challenge.achievement.unit}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "text-lg font-semibold",
                    challenge.status === "failed" && "text-red-600 dark:text-red-400"
                  )}>
                    {challenge.achievement.achieved}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {challenge.achievement.unit}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                {/* Final Rank */}
                <div className="text-center p-3 rounded-xl bg-primary/10">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Medal className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium">Final Rank</span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    #{challenge.finalRank}
                  </div>
                </div>

                {/* Duration */}
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Duration</span>
                  </div>
                  <div className="text-sm font-semibold">
                    {challenge.duration} Days
                  </div>
                </div>

                {/* Participants */}
                <div className="text-center p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Total</span>
                  </div>
                  <div className="text-sm font-semibold">
                    {challenge.totalParticipants}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 pb-4 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Completed {formatDate(challenge.completedOn)}
              </div>
              <Button 
                variant="ghost" 
                className="h-8 gap-1"
                onClick={() => router.push(`/dashboard/challenges/completed/${challenge.id}`)}
              >
                {challenge.status === "failed" ? "View Details" : "View Certificate"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {completedChallenges.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Medal className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Completed Challenges</h3>
            <p className="text-muted-foreground max-w-sm">
              You haven't completed any challenges yet. Join a challenge to start your fitness journey.
            </p>
            <Button 
              onClick={() => router.push('/dashboard/challenges/available')}
              className="mt-2"
            >
              Browse Challenges
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
} 