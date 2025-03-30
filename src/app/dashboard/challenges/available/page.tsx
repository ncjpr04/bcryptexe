"use client"

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, ArrowLeft, Filter, Users, Coins, Target, Medal, Calendar } from "lucide-react";
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

// Dummy data for a challenge
interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  duration: number;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  deadline: string;
  startDate: string;
  goal: {
    type: string;
    target: number;
    unit: string;
  };
  prizes: {
    position: string;
    amount: number;
    percentage: number;
  }[];
  tags: string[];
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Marathon Master Challenge",
    description: "Push your limits with this intensive running challenge. Track your progress and compete with runners worldwide.",
    type: "Running",
    difficulty: "Advanced",
    duration: 30,
    entryFee: 0.5,
    prizePool: 100,
    maxParticipants: 1000,
    currentParticipants: 456,
    deadline: "2024-04-15",
    startDate: "2024-04-01",
    goal: {
      type: "Distance",
      target: 42.2,
      unit: "km"
    },
    prizes: [
      { position: "1st", amount: 50, percentage: 50 },
      { position: "2nd", amount: 30, percentage: 30 },
      { position: "3rd", amount: 20, percentage: 20 }
    ],
    tags: ["Running", "Endurance", "Global", "High Stakes"]
  },
  {
    id: "2",
    title: "30-Day Weight Loss Challenge",
    description: "Transform your body with this comprehensive weight loss challenge. Includes nutrition guidance and workout plans.",
    type: "Weight Loss",
    difficulty: "Intermediate",
    duration: 30,
    entryFee: 1,
    prizePool: 200,
    maxParticipants: 500,
    currentParticipants: 234,
    deadline: "2024-04-10",
    startDate: "2024-04-15",
    goal: {
      type: "Weight",
      target: 5,
      unit: "kg"
    },
    prizes: [
      { position: "1st", amount: 100, percentage: 50 },
      { position: "2nd", amount: 60, percentage: 30 },
      { position: "3rd", amount: 40, percentage: 20 }
    ],
    tags: ["Weight Loss", "Transformation", "Nutrition", "Workout"]
  },
  {
    id: "3",
    title: "HIIT Warriors Competition",
    description: "High-intensity interval training challenge. Complete daily HIIT workouts and compete for the top spot.",
    type: "HIIT",
    difficulty: "Advanced",
    duration: 14,
    entryFee: 0.3,
    prizePool: 50,
    maxParticipants: 200,
    currentParticipants: 178,
    deadline: "2024-04-05",
    startDate: "2024-04-08",
    goal: {
      type: "Workouts",
      target: 14,
      unit: "sessions"
    },
    prizes: [
      { position: "1st", amount: 25, percentage: 50 },
      { position: "2nd", amount: 15, percentage: 30 },
      { position: "3rd", amount: 10, percentage: 20 }
    ],
    tags: ["HIIT", "Cardio", "Strength", "Daily"]
  },
  {
    id: "4",
    title: "Yoga & Mindfulness Journey",
    description: "Combine yoga practice with mindfulness meditation. Perfect for beginners looking to start their wellness journey.",
    type: "Yoga",
    difficulty: "Beginner",
    duration: 21,
    entryFee: 0.2,
    prizePool: 30,
    maxParticipants: 300,
    currentParticipants: 145,
    deadline: "2024-04-12",
    startDate: "2024-04-15",
    goal: {
      type: "Sessions",
      target: 21,
      unit: "classes"
    },
    prizes: [
      { position: "1st", amount: 15, percentage: 50 },
      { position: "2nd", amount: 9, percentage: 30 },
      { position: "3rd", amount: 6, percentage: 20 }
    ],
    tags: ["Yoga", "Mindfulness", "Wellness", "Beginner Friendly"]
  },
  {
    id: "5",
    title: "Strength Training Challenge",
    description: "Build muscle and increase strength with this progressive overload challenge. Track your lifts and compete with others.",
    type: "Strength",
    difficulty: "Intermediate",
    duration: 28,
    entryFee: 0.8,
    prizePool: 150,
    maxParticipants: 400,
    currentParticipants: 289,
    deadline: "2024-04-20",
    startDate: "2024-04-25",
    goal: {
      type: "Workouts",
      target: 20,
      unit: "sessions"
    },
    prizes: [
      { position: "1st", amount: 75, percentage: 50 },
      { position: "2nd", amount: 45, percentage: 30 },
      { position: "3rd", amount: 30, percentage: 20 }
    ],
    tags: ["Strength", "Muscle Gain", "Progressive", "Gym"]
  },
  {
    id: "6",
    title: "10K Steps Daily Sprint",
    description: "Hit 10,000 steps every day for a week. Perfect for those looking to increase their daily activity level.",
    type: "Walking",
    difficulty: "Beginner",
    duration: 7,
    entryFee: 0.1,
    prizePool: 20,
    maxParticipants: 1000,
    currentParticipants: 567,
    deadline: "2024-04-08",
    startDate: "2024-04-10",
    goal: {
      type: "Steps",
      target: 70000,
      unit: "steps"
    },
    prizes: [
      { position: "1st", amount: 10, percentage: 50 },
      { position: "2nd", amount: 6, percentage: 30 },
      { position: "3rd", amount: 4, percentage: 20 }
    ],
    tags: ["Walking", "Daily Activity", "Steps", "Beginner Friendly"]
  }
];

export default function AvailableChallengesPage() {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/challenges')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Available Challenges</h1>
        </div>
      </div>
      
      <p className="text-muted-foreground">
        Browse and join new fitness challenges to earn rewards
      </p>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Durations</SelectItem>
              <SelectItem value="short">Short (1-3 days)</SelectItem>
              <SelectItem value="medium">Medium (4-7 days)</SelectItem>
              <SelectItem value="long">Long (8+ days)</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Reward Amount" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rewards</SelectItem>
              <SelectItem value="low">1-3 SOL</SelectItem>
              <SelectItem value="medium">4-7 SOL</SelectItem>
              <SelectItem value="high">8+ SOL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Challenge Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="group flex flex-col overflow-hidden rounded-3xl border border-border/50 hover:shadow-lg transition-all duration-300">
            {/* Top Banner with Challenge Type and Difficulty */}
            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full bg-primary/10 text-primary border-primary/20 font-medium">
                  {challenge.type}
                </Badge>
                <Badge 
                  className={cn(
                    "rounded-full font-medium",
                    challenge.difficulty === "Beginner" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
                    challenge.difficulty === "Intermediate" && "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
                    challenge.difficulty === "Advanced" && "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                  )}
                >
                  {challenge.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{challenge.currentParticipants}/{challenge.maxParticipants}</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-6 space-y-4">
              {/* Title and Prize Pool */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold">{challenge.title}</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-primary/10">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{challenge.prizePool} SOL</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {challenge.description}
              </p>

              {/* Challenge Goal */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Goal</div>
                  <div className="text-lg font-semibold">
                    {challenge.goal.target} <span className="text-muted-foreground font-normal">{challenge.goal.unit}</span>
                  </div>
                </div>
              </div>

              {/* Challenge Info Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 rounded-2xl bg-muted/30">
                  <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-sm font-medium">{challenge.duration} Days</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-2xl bg-muted/30">
                  <Coins className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-sm font-medium">{challenge.entryFee} SOL</span>
                  <span className="text-xs text-muted-foreground">Entry</span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center p-3 rounded-2xl bg-amber-100/50 dark:bg-amber-500/20">
                        <Medal className="h-4 w-4 text-amber-600 dark:text-amber-400 mb-1" />
                        <span className="text-sm font-medium">{challenge.prizes[0].amount} SOL</span>
                        <span className="text-xs text-muted-foreground">1st Place</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="flex flex-col gap-1">
                      <p className="text-xs">2nd Place: {challenge.prizes[1].amount} SOL</p>
                      <p className="text-xs">3rd Place: {challenge.prizes[2].amount} SOL</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {challenge.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="rounded-full text-xs px-2.5 py-0.5 bg-muted/50"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pt-4 pb-6 mt-4">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Starts {formatDate(challenge.startDate)}
                  </div>
                  <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
                    <Clock className="h-4 w-4" />
                    Ends {formatDate(challenge.deadline)}
                  </div>
                </div>
                <Button 
                  className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11"
                >
                  Join Challenge
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 