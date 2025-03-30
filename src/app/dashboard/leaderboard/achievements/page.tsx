"use client"

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, Medal, Star, Shield,
  Award, Crown, Target, Flame,
  Zap, Timer, Dumbbell, Heart,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof achievementIcons;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

interface UserAchievements {
  id: string;
  rank: number;
  username: string;
  avatarUrl?: string;
  level: number;
  totalScore: number;
  achievements: Achievement[];
  isCurrentUser?: boolean;
}

const achievementIcons = {
  trophy: Trophy,
  medal: Medal,
  star: Star,
  shield: Shield,
  award: Award,
  crown: Crown,
  target: Target,
  flame: Flame,
  zap: Zap,
  timer: Timer,
  dumbbell: Dumbbell,
  heart: Heart
};

const achievementColors = {
  common: "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/20",
  rare: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20",
  epic: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20",
  legendary: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20"
};

const users: UserAchievements[] = [
  {
    id: "1",
    rank: 1,
    username: "alex_fitness",
    avatarUrl: "/avatars/alex.jpg",
    level: 42,
    totalScore: 8750,
    achievements: [
      {
        id: "1",
        name: "Marathon Master",
        description: "Complete 10 marathon challenges",
        icon: "trophy",
        rarity: "legendary",
        progress: 10,
        maxProgress: 10,
        unlockedAt: "2024-03-15"
      },
      {
        id: "2",
        name: "Streak Champion",
        description: "Maintain a 30-day workout streak",
        icon: "flame",
        rarity: "epic",
        progress: 30,
        maxProgress: 30,
        unlockedAt: "2024-03-10"
      },
      {
        id: "3",
        name: "Early Bird",
        description: "Complete 50 morning workouts",
        icon: "timer",
        rarity: "rare",
        progress: 45,
        maxProgress: 50
      }
    ]
  },
  {
    id: "2",
    rank: 2,
    username: "sarah_runs",
    avatarUrl: "/avatars/sarah.jpg",
    level: 38,
    totalScore: 7920,
    achievements: [
      {
        id: "4",
        name: "Speed Demon",
        description: "Run 5km under 20 minutes",
        icon: "zap",
        rarity: "epic",
        progress: 1,
        maxProgress: 1,
        unlockedAt: "2024-03-12"
      }
    ]
  },
  {
    id: "5",
    rank: 15,
    username: "current_user",
    avatarUrl: undefined,
    level: 25,
    totalScore: 4580,
    isCurrentUser: true,
    achievements: [
      {
        id: "5",
        name: "Consistency King",
        description: "Complete 100 workouts",
        icon: "crown",
        rarity: "rare",
        progress: 85,
        maxProgress: 100
      }
    ]
  }
];

export default function UserAchievementsPage() {
  const router = useRouter();
  const currentUser = users.find(user => user.isCurrentUser);

  // Group achievements by rarity
  const groupedAchievements = {
    legendary: currentUser?.achievements.filter(a => a.rarity === "legendary") || [],
    epic: currentUser?.achievements.filter(a => a.rarity === "epic") || [],
    rare: currentUser?.achievements.filter(a => a.rarity === "rare") || [],
    common: currentUser?.achievements.filter(a => a.rarity === "common") || []
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">My Achievements</h1>
        </div>

        {/* User Stats Card */}
        <Card className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={currentUser?.avatarUrl} />
              <AvatarFallback>{currentUser?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="text-xl font-semibold">{currentUser?.username}</div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>Level {currentUser?.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>{currentUser?.totalScore} points</span>
                </div>
                <div className="flex items-center gap-1">
                  <Medal className="h-4 w-4" />
                  <span>Rank #{currentUser?.rank}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievement Categories */}
      <div className="space-y-6">
        {Object.entries(groupedAchievements).map(([rarity, achievements]) => (
          achievements.length > 0 && (
            <div key={rarity} className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={cn(
                    "capitalize px-3 py-1",
                    achievementColors[rarity as keyof typeof achievementColors]
                  )}
                >
                  {rarity}
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {achievements.length} achievement{achievements.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="grid gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievementIcons[achievement.icon];
                  const isCompleted = achievement.progress === achievement.maxProgress;

                  return (
                    <Card 
                      key={achievement.id}
                      className={cn(
                        "transition-all duration-200",
                        isCompleted && "bg-gradient-to-r from-muted/50 via-muted/25 to-transparent"
                      )}
                    >
                      <div className="p-6 flex items-start gap-4">
                        <div className={cn(
                          "p-3 rounded-xl",
                          achievementColors[achievement.rarity]
                        )}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="font-semibold">{achievement.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {achievement.description}
                              </div>
                            </div>
                            {isCompleted && (
                              <div className="text-sm text-green-600 dark:text-green-400">
                                Unlocked {achievement.unlockedAt && formatDate(achievement.unlockedAt)}
                              </div>
                            )}
                          </div>
                          {!isCompleted && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <div className="text-muted-foreground">
                                  Progress: {achievement.progress}/{achievement.maxProgress}
                                </div>
                                <div className="text-muted-foreground">
                                  {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                                </div>
                              </div>
                              <Progress 
                                value={(achievement.progress / achievement.maxProgress) * 100}
                                className="h-2"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Empty State */}
      {!currentUser?.achievements.length && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Award className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">No Achievements Yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Start completing challenges to earn achievements and climb the ranks!
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