"use client"

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, Medal, Star, Crown,
  Target, Flame, Award, Users,
  ChevronRight, ArrowRight
} from "lucide-react";

interface LeaderboardCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  count: number;
  topUsers: {
    username: string;
    avatarUrl?: string;
    score: string | number;
    position: number;
  }[];
  link: string;
}

const leaderboardCategories: LeaderboardCategory[] = [
  {
    id: "overall",
    title: "Overall Rankings",
    description: "Top performers across all challenges and activities",
    icon: <Trophy className="h-5 w-5 text-amber-500" />,
    count: 1250,
    topUsers: [
      { username: "alex_fitness", avatarUrl: "/avatars/alex.jpg", score: "8,750 pts", position: 1 },
      { username: "sarah_runs", avatarUrl: "/avatars/sarah.jpg", score: "7,920 pts", position: 2 },
      { username: "fitness_mike", score: "7,580 pts", position: 3 }
    ],
    link: "/dashboard/leaderboard/top"
  },
  {
    id: "achievements",
    title: "Achievement Masters",
    description: "Users with the most unlocked achievements",
    icon: <Medal className="h-5 w-5 text-indigo-500" />,
    count: 850,
    topUsers: [
      { username: "alex_fitness", avatarUrl: "/avatars/alex.jpg", score: "42 achievements", position: 1 },
      { username: "sarah_runs", avatarUrl: "/avatars/sarah.jpg", score: "38 achievements", position: 2 },
      { username: "fitness_mike", score: "35 achievements", position: 3 }
    ],
    link: "/dashboard/leaderboard/achievements"
  },
  {
    id: "monthly",
    title: "Monthly Challenge",
    description: "Top performers in this month's featured challenge",
    icon: <Flame className="h-5 w-5 text-rose-500" />,
    count: 456,
    topUsers: [
      { username: "sarah_runs", avatarUrl: "/avatars/sarah.jpg", score: "42.5 km", position: 1 },
      { username: "alex_fitness", avatarUrl: "/avatars/alex.jpg", score: "40.2 km", position: 2 },
      { username: "fitness_mike", score: "38.7 km", position: 3 }
    ],
    link: "/dashboard/challenges/monthly"
  },
  {
    id: "streaks",
    title: "Longest Streaks",
    description: "Users with the longest active workout streaks",
    icon: <Star className="h-5 w-5 text-amber-500" />,
    count: 325,
    topUsers: [
      { username: "alex_fitness", avatarUrl: "/avatars/alex.jpg", score: "45 days", position: 1 },
      { username: "fitness_mike", score: "38 days", position: 2 },
      { username: "sarah_runs", avatarUrl: "/avatars/sarah.jpg", score: "32 days", position: 3 }
    ],
    link: "/dashboard/leaderboard/streaks"
  }
];

export default function LeaderboardPage() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          Track your progress and compete with other fitness enthusiasts
        </p>
      </div>

      {/* Leaderboard Categories */}
      <div className="grid md:grid-cols-2 gap-6">
        {leaderboardCategories.map((category) => (
          <Card 
            key={category.id}
            className="group hover:shadow-md transition-all duration-300"
          >
            {/* Category Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {category.icon}
                    <h2 className="font-semibold">{category.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.count} users
                </Badge>
              </div>
            </div>

            {/* Top Users */}
            <div className="divide-y">
              {category.topUsers.map((user) => (
                <div 
                  key={user.username}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center">
                      {user.position === 1 && <Crown className="h-4 w-4 text-amber-500" />}
                      {user.position === 2 && <Medal className="h-4 w-4 text-slate-500" />}
                      {user.position === 3 && <Award className="h-4 w-4 text-orange-500" />}
                      {user.position > 3 && <span className="text-sm text-muted-foreground">#{user.position}</span>}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <div className="text-sm font-medium">{user.score}</div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="p-4 bg-muted/50">
              <Button 
                variant="ghost" 
                className="w-full justify-between group-hover:bg-background"
                onClick={() => router.push(category.link)}
              >
                View Full Rankings
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Your Rankings */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-semibold">Your Rankings</h2>
            <p className="text-sm text-muted-foreground">
              Track your position across different categories
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            View All
          </Button>
        </div>
        <div className="grid md:grid-cols-4 gap-6 mt-6">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="text-sm text-muted-foreground mb-1">Overall Rank</div>
            <div className="text-2xl font-bold">#15</div>
            <div className="text-sm text-muted-foreground">4,580 points</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="text-sm text-muted-foreground mb-1">Achievements</div>
            <div className="text-2xl font-bold">#25</div>
            <div className="text-sm text-muted-foreground">12 unlocked</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="text-sm text-muted-foreground mb-1">Monthly Challenge</div>
            <div className="text-2xl font-bold">#8</div>
            <div className="text-sm text-muted-foreground">35.2 km</div>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="text-sm text-muted-foreground mb-1">Current Streak</div>
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-muted-foreground">days</div>
          </div>
        </div>
      </Card>
    </div>
  );
} 