"use client"

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, Clock, ArrowLeft, Target, 
  Medal, Calendar, BarChart, Users,
  ChevronRight, Timer
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ActiveChallenge {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  progress: number;
  target: number;
  unit: string;
  daysLeft: number;
  totalDays: number;
  prizePool: number;
  currentRank: number;
  totalParticipants: number;
  deadline: string;
}

const activeChallengeDummy: ActiveChallenge[] = [
  {
    id: "1",
    title: "30-Day Weight Loss Challenge",
    type: "Weight Loss",
    difficulty: "Intermediate",
    progress: 3.2,
    target: 5,
    unit: "kg",
    daysLeft: 15,
    totalDays: 30,
    prizePool: 200,
    currentRank: 45,
    totalParticipants: 234,
    deadline: "2024-04-15"
  },
  {
    id: "2",
    title: "10K Steps Daily Sprint",
    type: "Walking",
    difficulty: "Beginner",
    progress: 45000,
    target: 70000,
    unit: "steps",
    daysLeft: 3,
    totalDays: 7,
    prizePool: 20,
    currentRank: 123,
    totalParticipants: 567,
    deadline: "2024-04-10"
  }
];

export default function ActiveChallengesPage() {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/challenges')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Active Challenges</h1>
        </div>
        <Button variant="outline" className="gap-2">
          <BarChart className="h-4 w-4" />
          View Stats
        </Button>
      </div>

      {/* Challenge Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {activeChallengeDummy.map((challenge) => (
          <Card 
            key={challenge.id} 
            className="overflow-hidden hover:shadow-lg transition-all duration-300 group"
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
                      challenge.difficulty === "Beginner" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
                      challenge.difficulty === "Intermediate" && "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
                      challenge.difficulty === "Advanced" && "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                    )}
                  >
                    {challenge.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{challenge.prizePool} SOL</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold line-clamp-1">{challenge.title}</h3>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-4">
              {/* Progress Section */}
              <div className="grid grid-cols-2 gap-4">
                {/* Goal Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Progress</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((challenge.progress / challenge.target) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(challenge.progress / challenge.target) * 100} 
                    className="h-2 rounded-full"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {challenge.progress} / {challenge.target} {challenge.unit}
                  </div>
                </div>

                {/* Time Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Timer className="h-4 w-4 text-rose-500" />
                      <span className="text-sm font-medium">Time Left</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((challenge.daysLeft / challenge.totalDays) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={((challenge.totalDays - challenge.daysLeft) / challenge.totalDays) * 100}
                    className="h-2 rounded-full bg-rose-100 dark:bg-rose-500/20"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {challenge.daysLeft} days left
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-muted/50">
                <div className="text-center p-2 rounded-lg bg-amber-100/50 dark:bg-amber-500/20">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Medal className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-medium">Rank</span>
                  </div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    #{challenge.currentRank}
                  </div>
                </div>
                <div className="text-center p-2">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Total</span>
                  </div>
                  <div className="text-sm font-semibold">
                    {challenge.totalParticipants}
                  </div>
                </div>
                <div className="text-center p-2">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">Days</span>
                  </div>
                  <div className="text-sm font-semibold">
                    {challenge.daysLeft}/{challenge.totalDays}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 pb-4">
              <Button 
                className="w-full rounded-full gap-2 text-sm h-9"
                variant="outline"
                onClick={() => router.push(`/dashboard/challenges/active/${challenge.id}`)}
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {activeChallengeDummy.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Trophy className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Active Challenges</h3>
            <p className="text-muted-foreground max-w-sm">
              You haven't joined any challenges yet. Browse available challenges to get started.
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