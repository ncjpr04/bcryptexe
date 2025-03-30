"use client"

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Search,
  UserPlus,
  Users,
  UserCheck,
  Clock,
  Medal,
  Activity,
  MessageCircle,
  MoreHorizontal,
  X,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FriendProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  level: number;
  mutualFriends: number;
  stats: {
    workouts: number;
    achievements: number;
    streak: number;
  };
  status: "pending" | "suggested" | "friend";
  lastActive?: string;
}

const friendProfiles: FriendProfile[] = [
  {
    id: "1",
    username: "sarah_fitness",
    avatarUrl: "/avatars/sarah.jpg",
    level: 32,
    mutualFriends: 5,
    stats: {
      workouts: 248,
      achievements: 45,
      streak: 12
    },
    status: "friend",
    lastActive: "2h ago"
  },
  // ... add more friend profiles
];

export default function FriendsPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Sticky */}
        <div className="hidden lg:block col-span-2">
          <div className="sticky top-4 space-y-6">
            <nav className="space-y-2">
              {[
                { label: 'All Friends', icon: <Users className="h-4 w-4" />, count: 42 },
                { label: 'Requests', icon: <Clock className="h-4 w-4" />, count: 5 },
                { label: 'Suggestions', icon: <UserPlus className="h-4 w-4" />, count: 12 },
                { label: 'Blocked', icon: <X className="h-4 w-4" />, count: 0 },
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  className="w-full justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </div>
                  {item.count > 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Friends</h1>
            <Button size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Friend
            </Button>
          </div>

          {/* Friend Requests Section */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Friend Requests</h2>
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </div>
            <div className="grid gap-4">
              {/* Friend Request Cards */}
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/avatars/user${i}.jpg`} />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">fitness_user_{i}</div>
                      <div className="text-xs text-muted-foreground">4 mutual friends</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="default">Accept</Button>
                    <Button size="sm" variant="outline">Decline</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Friend Suggestions */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Suggested Friends</h2>
              <Button variant="ghost" size="sm" className="text-xs">View All</Button>
            </div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/avatars/suggested${i}.jpg`} />
                      <AvatarFallback>S{i}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">suggested_user_{i}</div>
                      <div className="text-xs text-muted-foreground">Based on your activity</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Friend
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* All Friends */}
          <div className="space-y-4">
            <h2 className="font-semibold">All Friends (42)</h2>
            <div className="grid gap-4">
              {friendProfiles.map((friend) => (
                <Card key={friend.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                        <AvatarImage src={friend.avatarUrl} />
                        <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{friend.username}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <span>Level {friend.level}</span>
                          <span>•</span>
                          <span>{friend.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4 text-center text-sm">
                    <div className="space-y-1">
                      <Activity className="h-4 w-4 mx-auto text-primary" />
                      <div className="font-medium">{friend.stats.workouts}</div>
                      <div className="text-xs text-muted-foreground">Workouts</div>
                    </div>
                    <div className="space-y-1">
                      <Medal className="h-4 w-4 mx-auto text-primary" />
                      <div className="font-medium">{friend.stats.achievements}</div>
                      <div className="text-xs text-muted-foreground">Achievements</div>
                    </div>
                    <div className="space-y-1">
                      <Flame className="h-4 w-4 mx-auto text-primary" />
                      <div className="font-medium">{friend.stats.streak} Days</div>
                      <div className="text-xs text-muted-foreground">Streak</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Sticky */}
        <div className="hidden lg:block col-span-3">
          <div className="sticky top-4 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search friends..." 
                className="pl-9 bg-muted/50"
              />
            </div>

            {/* Friend Activity */}
            <Card>
              <div className="p-4 border-b">
                <h2 className="font-semibold">Friend Activity</h2>
              </div>
              <div className="divide-y">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/avatars/activity${i}.jpg`} />
                        <AvatarFallback>A{i}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">user_{i}</span>
                          <span className="text-muted-foreground"> completed a workout</span>
                        </div>
                        <div className="text-xs text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 