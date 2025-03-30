"use client"

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Hash,
  Volume2,
  Users,
  MessageCircle,
  Shield,
  Star,
  ArrowRight,
  ExternalLink,
  Bell,
  Settings,
  Crown,
  Activity,
  UserPlus,
  Gamepad2,
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced channel interface with categories
interface DiscordChannel {
  id: string;
  name: string;
  type: "text" | "voice" | "announcement";
  category: "COMMUNITY" | "ACTIVITIES" | "PREMIUM";
  memberCount?: number;
  isLocked?: boolean;
  description?: string;
}

const channels: DiscordChannel[] = [
  { 
    id: "1", 
    name: "announcements", 
    type: "announcement", 
    category: "COMMUNITY",
    description: "Official updates and news" 
  },
  { 
    id: "2", 
    name: "general", 
    type: "text", 
    category: "COMMUNITY",
    memberCount: 42,
    description: "General discussion" 
  },
  // ... add more channels with categories and descriptions
];

// Group channels by category
const groupedChannels = channels.reduce((acc, channel) => {
  if (!acc[channel.category]) {
    acc[channel.category] = [];
  }
  acc[channel.category].push(channel);
  return acc;
}, {} as Record<string, DiscordChannel[]>);

export default function DiscordPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Enhanced */}
        <div className="hidden lg:block col-span-3">
          <div className="sticky top-4 space-y-6">
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarImage src="/discord-server-icon.png" />
                    <AvatarFallback>WF</AvatarFallback>
                  </Avatar>
                  <Badge className="absolute -bottom-1 -right-1 bg-green-500">LIVE</Badge>
                </div>
                <div>
                  <h2 className="font-bold text-lg">Web3 Fitness</h2>
                  <p className="text-sm text-muted-foreground">Official Community Server</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 p-2 bg-muted/50 rounded-lg">
                  <div className="text-center p-2">
                    <div className="font-semibold">2,481</div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                  <div className="text-center p-2">
                    <div className="font-semibold text-green-500">342</div>
                    <div className="text-xs text-muted-foreground">Online</div>
                  </div>
                </div>
                <Button className="w-full gap-2 bg-[#5865F2] hover:bg-[#4752C4]">
                  <ExternalLink className="h-4 w-4" />
                  Open Discord
                </Button>
              </div>
            </Card>

            {/* Enhanced Channels List */}
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  Channels
                </h3>
              </div>
              <div className="divide-y">
                {Object.entries(groupedChannels).map(([category, categoryChannels]) => (
                  <div key={category} className="p-2">
                    <div className="text-xs font-semibold text-muted-foreground px-3 py-2">
                      {category}
                    </div>
                    {categoryChannels.map((channel) => (
                      <Button
                        key={channel.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-between px-3 py-2 h-auto font-normal group",
                          channel.isLocked && "opacity-50"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {channel.type === "text" && <Hash className="h-4 w-4 text-muted-foreground" />}
                          {channel.type === "voice" && <Volume2 className="h-4 w-4 text-muted-foreground" />}
                          {channel.type === "announcement" && <Bell className="h-4 w-4 text-muted-foreground" />}
                          <span>{channel.name}</span>
                          {channel.description && (
                            <span className="hidden group-hover:block text-xs text-muted-foreground">
                              • {channel.description}
                            </span>
                          )}
                        </div>
                        {channel.isLocked ? (
                          <Shield className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          channel.memberCount && (
                            <Badge variant="secondary" className="text-xs">
                              {channel.memberCount}
                            </Badge>
                          )
                        )}
                      </Button>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Main Content - Enhanced */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Discord Community</h1>
              <p className="text-sm text-muted-foreground">Connect, share, and grow together</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Invite Friends
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Server Preview - Enhanced */}
          <Card className="overflow-hidden group relative">
            <div className="h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 relative">
              <div className="absolute inset-0 bg-grid-white/5" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <Avatar className="h-20 w-20 ring-4 ring-background transition-transform group-hover:scale-105">
                  <AvatarImage src="/discord-server-icon.png" />
                  <AvatarFallback>WF</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Web3 Fitness</h2>
                    <Badge className="bg-[#5865F2]">Official</Badge>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    2,481 members • 342 online
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Activity Tabs - New! */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Features - Enhanced */}
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <Users className="h-6 w-6 text-blue-500" />,
                title: "Active Community",
                description: "Connect with other fitness enthusiasts, share tips, and stay motivated together."
              },
              {
                icon: <Gamepad2 className="h-6 w-6 text-purple-500" />,
                title: "Live Events",
                description: "Join weekly workout sessions, challenges, and community gatherings."
              },
              {
                icon: <Trophy className="h-6 w-6 text-yellow-500" />,
                title: "Rewards & Ranks",
                description: "Earn special roles and rewards for your participation and achievements."
              },
              {
                icon: <Crown className="h-6 w-6 text-orange-500" />,
                title: "Premium Benefits",
                description: "Access exclusive channels, custom roles, and special perks."
              }
            ].map((feature, i) => (
              <Card key={i} className="p-4 space-y-2 group hover:shadow-md transition-all">
                <div className="flex items-center gap-2">
                  {feature.icon}
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* Join CTA - Enhanced */}
          <Card className="p-6 text-center space-y-4 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5">
            <div className="inline-block p-3 rounded-full bg-primary/10 mb-2">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Ready to Join Our Community?</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Connect your Discord account to unlock all community features and start engaging with other members.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button size="lg" className="gap-2 bg-[#5865F2] hover:bg-[#4752C4]">
                Connect Discord
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">Learn More</Button>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Enhanced */}
        <div className="hidden lg:block col-span-3">
          <div className="sticky top-4 space-y-6">
            {/* Online Members */}
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-semibold">Online Now</h3>
              </div>
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/avatars/discord${i}.jpg`} />
                      <AvatarFallback>M{i}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">member_{i}</div>
                      <div className="text-xs text-muted-foreground">Working out</div>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View All Members
                </Button>
              </div>
            </Card>

            {/* Integration Status */}
            <Card className="p-4 space-y-4">
              <h3 className="font-semibold">Integration Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Account Connected</span>
                  <span className="text-green-500">Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Notifications</span>
                  <span className="text-green-500">Enabled</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Auto Sync</span>
                  <span className="text-green-500">On</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 