"use client"

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, Medal, Crown, Star,
  Flame, Target, Filter, Users,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  id: string;
  rank: number;
  username: string;
  avatarUrl?: string;
  score: number;
  progress: number;
  target: number;
  unit: string;
  challengeCount: number;
  totalEarnings: number;
  streak: number;
  isCurrentUser?: boolean;
}

const topPerformers: LeaderboardUser[] = [
  {
    id: "1",
    rank: 1,
    username: "alex_fitness",
    avatarUrl: "/avatars/alex.jpg",
    score: 2850,
    progress: 42.5,
    target: 40,
    unit: "km",
    challengeCount: 15,
    totalEarnings: 245.5,
    streak: 12
  },
  {
    id: "2",
    rank: 2,
    username: "sarah_runs",
    avatarUrl: "/avatars/sarah.jpg",
    score: 2720,
    progress: 38.2,
    target: 40,
    unit: "km",
    challengeCount: 12,
    totalEarnings: 180.75,
    streak: 8
  },
  {
    id: "3",
    rank: 3,
    username: "fitness_mike",
    avatarUrl: "/avatars/mike.jpg",
    score: 2680,
    progress: 37.8,
    target: 40,
    unit: "km",
    challengeCount: 10,
    totalEarnings: 165.25,
    streak: 6
  },
  {
    id: "4",
    rank: 4,
    username: "emma_wellness",
    score: 2540,
    progress: 36.5,
    target: 40,
    unit: "km",
    challengeCount: 8,
    totalEarnings: 142.5,
    streak: 5
  },
  {
    id: "5",
    rank: 25,
    username: "current_user",
    score: 1850,
    progress: 28.5,
    target: 40,
    unit: "km",
    challengeCount: 5,
    totalEarnings: 85.5,
    streak: 3,
    isCurrentUser: true
  }
];

export default function TopLeaderboardPage() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Top 3 Podium */}
        <div className="grid md:grid-cols-3 gap-4">
          {topPerformers.slice(0, 3).map((user, index) => (
            <Card 
              key={user.id}
              className={cn(
                "p-6 relative overflow-hidden",
                index === 0 && "bg-gradient-to-br from-amber-100/50 via-amber-50/50 to-transparent dark:from-amber-500/20 dark:via-amber-500/10 dark:to-transparent",
                index === 1 && "bg-gradient-to-br from-slate-100/50 via-slate-50/50 to-transparent dark:from-slate-500/20 dark:via-slate-500/10 dark:to-transparent",
                index === 2 && "bg-gradient-to-br from-orange-100/50 via-orange-50/50 to-transparent dark:from-orange-500/20 dark:via-orange-500/10 dark:to-transparent"
              )}
            >
              {/* Position Badge */}
              <div className={cn(
                "absolute top-3 right-3 p-1.5 rounded-full",
                index === 0 && "bg-amber-100 dark:bg-amber-500/20",
                index === 1 && "bg-slate-100 dark:bg-slate-500/20",
                index === 2 && "bg-orange-100 dark:bg-orange-500/20"
              )}>
                {index === 0 && <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                {index === 1 && <Medal className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
                {index === 2 && <Trophy className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
              </div>

              {/* User Info */}
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 mb-3">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm text-muted-foreground mb-4">Rank #{user.rank}</div>

                {/* Stats */}
                <div className="w-full grid grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="text-muted-foreground">Score</div>
                    <div className="font-semibold">{user.score}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50">
                    <div className="text-muted-foreground">Progress</div>
                    <div className="font-semibold">{user.progress} {user.unit}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <Card>
        <div className="divide-y">
          {topPerformers.map((user) => (
            <div 
              key={user.id}
              className={cn(
                "p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors",
                user.isCurrentUser && "bg-primary/5"
              )}
            >
              {/* Rank */}
              <div className="w-12 text-center">
                <div className={cn(
                  "font-bold text-lg",
                  user.rank === 1 && "text-amber-600 dark:text-amber-400",
                  user.rank === 2 && "text-slate-600 dark:text-slate-400",
                  user.rank === 3 && "text-orange-600 dark:text-orange-400"
                )}>
                  #{user.rank}
                </div>
              </div>

              {/* User */}
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{user.username}</div>
                  {user.isCurrentUser && (
                    <Badge variant="outline" className="text-xs">You</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {user.challengeCount} challenges completed
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Score</div>
                  <div className="font-semibold">{user.score}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="font-semibold">{user.progress} {user.unit}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Earnings</div>
                  <div className="font-semibold">{user.totalEarnings} SOL</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                    <Flame className="h-4 w-4" />
                    <span className="font-semibold">{user.streak}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
} 