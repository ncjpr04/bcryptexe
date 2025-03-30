"use client"

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Heart, MessageCircle, Share2, Trophy,
  Medal, Target, Flame, BarChart,
  ThumbsUp, Users, Filter, Plus,
  TrendingUp, Clock, Calendar, Search,
  BookmarkIcon, MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  user: {
    username: string;
    avatarUrl?: string;
    badges?: string[];
  };
  content: string;
  type: "achievement" | "workout" | "challenge" | "general";
  achievement?: {
    name: string;
    icon: React.ReactNode;
    rarity: "common" | "rare" | "epic" | "legendary";
  };
  workout?: {
    type: string;
    duration: string;
    stats: {
      label: string;
      value: string;
    }[];
  };
  challenge?: {
    name: string;
    progress: number;
    target: number;
    unit: string;
  };
  media?: {
    type: "image" | "video";
    url: string;
  };
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked?: boolean;
}

const posts: Post[] = [
  {
    id: "1",
    user: {
      username: "sarah_runs",
      avatarUrl: "/avatars/sarah.jpg",
      badges: ["Speed Demon", "Marathon Master"]
    },
    content: "Just unlocked a new achievement! 🏃‍♀️✨",
    type: "achievement",
    achievement: {
      name: "Speed Demon",
      icon: <Flame className="h-5 w-5" />,
      rarity: "epic"
    },
    likes: 128,
    comments: 24,
    shares: 12,
    timestamp: "2024-03-20T10:30:00Z",
    isLiked: true
  },
  {
    id: "2",
    user: {
      username: "alex_fitness",
      avatarUrl: "/avatars/alex.jpg",
      badges: ["Iron Warrior"]
    },
    content: "Morning workout complete! 💪 Feeling stronger every day.",
    type: "workout",
    workout: {
      type: "Strength Training",
      duration: "45 min",
      stats: [
        { label: "Exercises", value: "8" },
        { label: "Sets", value: "24" },
        { label: "Weight", value: "1,850 kg" }
      ]
    },
    likes: 85,
    comments: 15,
    shares: 5,
    timestamp: "2024-03-20T08:15:00Z"
  },
  {
    id: "3",
    user: {
      username: "fitness_mike",
      badges: ["30-Day Warrior"]
    },
    content: "Making progress in the monthly challenge! Who else is participating? 🎯",
    type: "challenge",
    challenge: {
      name: "March Marathon Challenge",
      progress: 32.5,
      target: 42.2,
      unit: "km"
    },
    likes: 95,
    comments: 18,
    shares: 8,
    timestamp: "2024-03-19T15:45:00Z"
  }
];

export default function SocialPage() {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Made sticky */}
        <div className="hidden lg:block col-span-2">
          <div className="sticky top-4 space-y-6">
            <nav className="space-y-2">
              {[
                { label: 'Feed', icon: <Users className="h-4 w-4" /> },
                { label: 'My Posts', icon: <BookmarkIcon className="h-4 w-4" /> },
                { label: 'Following', icon: <Heart className="h-4 w-4" /> },
                { label: 'Challenges', icon: <Trophy className="h-4 w-4" /> },
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-start gap-3"
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content - Updated width */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Main Feed Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Community</h1>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Share Update
            </Button>
          </div>

          {/* Feed Filters - Updated size */}
          <div className="flex items-center justify-between">
            <Tabs defaultValue="all" className="w-[300px]">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="following">Following</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Create Post Card - Updated padding */}
          <Card className="p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatars/user.jpg" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
              <Input 
                placeholder="Share your fitness journey..." 
                className="bg-muted/50"
              />
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="text-xs">📷 Photo</Button>
                <Button variant="ghost" size="sm" className="text-xs">🏃‍♂️ Workout</Button>
                <Button variant="ghost" size="sm" className="text-xs">🎯 Challenge</Button>
              </div>
              <Button size="sm">Post</Button>
            </div>
          </Card>

          {/* Posts Feed - Updated card styling */}
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-md transition-all">
                {/* Post Header - Updated padding */}
                <div className="p-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                      <AvatarImage src={post.user.avatarUrl} />
                      <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="font-medium hover:text-primary cursor-pointer text-sm">
                          {post.user.username}
                        </span>
                        {post.user.badges?.map((badge) => (
                          <Badge 
                            key={badge} 
                            variant="secondary" 
                            className="text-[10px] px-1 hover:bg-primary/10 cursor-pointer"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {formatDate(post.timestamp)}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                {/* Post Content - Updated padding */}
                <div className="px-3 pb-3">
                  <p className="text-sm mb-3">{post.content}</p>

                  {/* Achievement Card - Updated padding */}
                  {post.type === "achievement" && post.achievement && (
                    <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        post.achievement.rarity === "epic" && "bg-purple-100 dark:bg-purple-500/20 text-purple-500"
                      )}>
                        {post.achievement.icon}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{post.achievement.name}</div>
                        <div className="text-xs text-muted-foreground">New Achievement Unlocked</div>
                      </div>
                    </div>
                  )}

                  {/* Workout Stats */}
                  {post.type === "workout" && post.workout && (
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{post.workout.type}</span>
                        <span>{post.workout.duration}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {post.workout.stats.map((stat, i) => (
                          <div key={i} className="text-center">
                            <div className="font-semibold">{stat.value}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenge Progress */}
                  {post.type === "challenge" && post.challenge && (
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-medium">{post.challenge.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span>
                          {post.challenge.progress}/{post.challenge.target} {post.challenge.unit}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${(post.challenge.progress / post.challenge.target) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Post Actions - Updated padding */}
                <div className="px-3 py-2 border-t flex items-center justify-between bg-muted/5">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "gap-1.5 text-xs hover:text-primary transition-colors",
                        post.isLiked && "text-primary"
                      )}
                    >
                      <Heart className={cn("h-3.5 w-3.5", post.isLiked && "fill-current")} />
                      <span>{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs hover:text-primary transition-colors">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{post.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs hover:text-primary transition-colors">
                      <Share2 className="h-3.5 w-3.5" />
                      <span>{post.shares}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs hover:text-primary transition-colors">
                    <BookmarkIcon className="h-3.5 w-3.5" />
                    Save
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Made sticky */}
        <div className="hidden lg:block col-span-3">
          <div className="sticky top-4 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search community..." 
                className="pl-9 bg-muted/50"
              />
            </div>

            {/* Trending Challenges */}
            <Card>
              <div className="p-4 border-b">
                <h2 className="font-semibold">Trending Challenges</h2>
              </div>
              <div className="divide-y">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      March Marathon Challenge
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      1.2k participants • 3 days left
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full" size="sm">
                View All Challenges
              </Button>
            </Card>

            {/* Active Users */}
            <Card>
              <div className="p-4 border-b">
                <h2 className="font-semibold">Active Now</h2>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {Array(8).fill(0).map((_, i) => (
                    <Avatar key={i} className="ring-2 ring-primary">
                      <AvatarImage src={`/avatars/user${i + 1}.jpg`} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mt-3 text-center">
                  12 community members active
                </div>
              </div>
            </Card>

            {/* Community Stats */}
            <Card className="p-4 space-y-4">
              <h2 className="font-semibold">Community Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  <div className="font-semibold">2.5k</div>
                  <div className="text-xs text-muted-foreground">Members</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  <div className="font-semibold">150</div>
                  <div className="text-xs text-muted-foreground">Posts Today</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 