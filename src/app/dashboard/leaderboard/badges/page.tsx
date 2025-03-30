"use client"

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, Medal, Star, Shield,
  Award, Crown, Target, Flame,
  Dumbbell, Heart, Zap, Timer,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badges: UserBadge[];
}

interface UserBadge {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedBy: number;
  topHolders: {
    username: string;
    avatarUrl?: string;
    unlockedAt: string;
  }[];
  isUnlocked?: boolean;
  progress?: number;
  maxProgress?: number;
}

const badgeCategories: BadgeCategory[] = [
  {
    id: "fitness",
    name: "Fitness Milestones",
    description: "Achievements in your fitness journey",
    icon: <Dumbbell className="h-5 w-5" />,
    color: "text-purple-500",
    badges: [
      {
        id: "1",
        name: "Iron Warrior",
        description: "Complete 100 strength training workouts",
        rarity: "legendary",
        unlockedBy: 125,
        topHolders: [
          { username: "alex_fitness", avatarUrl: "/avatars/alex.jpg", unlockedAt: "2024-03-15" },
          { username: "fitness_mike", unlockedAt: "2024-03-10" }
        ],
        progress: 85,
        maxProgress: 100
      },
      {
        id: "2",
        name: "Speed Demon",
        description: "Run 5km under 20 minutes",
        rarity: "epic",
        unlockedBy: 256,
        topHolders: [
          { username: "sarah_runs", avatarUrl: "/avatars/sarah.jpg", unlockedAt: "2024-03-12" }
        ],
        isUnlocked: true
      }
    ]
  },
  {
    id: "challenges",
    name: "Challenge Champions",
    description: "Achievements from challenge participation",
    icon: <Trophy className="h-5 w-5" />,
    color: "text-amber-500",
    badges: [
      {
        id: "3",
        name: "Challenge Master",
        description: "Win 5 challenges in a month",
        rarity: "legendary",
        unlockedBy: 89,
        topHolders: [
          { username: "alex_fitness", avatarUrl: "/avatars/alex.jpg", unlockedAt: "2024-03-01" }
        ],
        progress: 3,
        maxProgress: 5
      }
    ]
  },
  {
    id: "streaks",
    name: "Consistency Kings",
    description: "Achievements for maintaining streaks",
    icon: <Flame className="h-5 w-5" />,
    color: "text-rose-500",
    badges: [
      {
        id: "4",
        name: "30-Day Warrior",
        description: "Maintain a 30-day workout streak",
        rarity: "epic",
        unlockedBy: 342,
        topHolders: [
          { username: "alex_fitness", avatarUrl: "/avatars/alex.jpg", unlockedAt: "2024-02-28" },
          { username: "sarah_runs", avatarUrl: "/avatars/sarah.jpg", unlockedAt: "2024-02-25" }
        ],
        progress: 15,
        maxProgress: 30
      }
    ]
  }
];

const rarityColors = {
  common: "text-slate-500 bg-slate-100 dark:bg-slate-500/20",
  rare: "text-blue-500 bg-blue-100 dark:bg-blue-500/20",
  epic: "text-purple-500 bg-purple-100 dark:bg-purple-500/20",
  legendary: "text-amber-500 bg-amber-100 dark:bg-amber-500/20"
};

export default function BadgesPage() {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Badges</h1>
          <p className="text-muted-foreground">
            Collect badges and showcase your achievements
          </p>
        </div>
      </div>

      {/* Badge Categories */}
      {badgeCategories.map((category) => (
        <div key={category.id} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className={`${category.color}`}>{category.icon}</div>
            <h2 className="font-semibold">{category.name}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {category.badges.map((badge) => (
              <Card key={badge.id} className="overflow-hidden">
                <div className="p-6 space-y-4">
                  {/* Badge Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-3 rounded-xl",
                        rarityColors[badge.rarity]
                      )}>
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "capitalize",
                        rarityColors[badge.rarity]
                      )}
                    >
                      {badge.rarity}
                    </Badge>
                  </div>

                  {/* Progress or Unlock Status */}
                  {badge.isUnlocked ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Unlocked</span>
                    </div>
                  ) : badge.progress && badge.maxProgress ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{badge.progress}/{badge.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(badge.progress / badge.maxProgress) * 100}
                        className="h-2"
                      />
                    </div>
                  ) : null}

                  {/* Badge Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">
                      Unlocked by {badge.unlockedBy} users
                    </div>
                    {badge.topHolders.length > 0 && (
                      <div className="flex -space-x-2">
                        {badge.topHolders.slice(0, 3).map((holder, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={holder.avatarUrl} />
                            <AvatarFallback>{holder.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Unlocks */}
                {badge.topHolders.length > 0 && (
                  <div className="px-6 py-4 bg-muted/50 border-t">
                    <div className="text-sm font-medium mb-2">Recent Unlocks</div>
                    <div className="space-y-2">
                      {badge.topHolders.slice(0, 2).map((holder, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={holder.avatarUrl} />
                              <AvatarFallback>{holder.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{holder.username}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {formatDate(holder.unlockedAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 