"use client"

import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function ChallengesPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-7 w-7 text-amber-500" />
          Fitness Challenges
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete challenges to earn SOL rewards and improve your fitness
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="available" onClick={() => router.push('/dashboard/challenges/available')}>Available</TabsTrigger>
          <TabsTrigger value="active" onClick={() => router.push('/dashboard/challenges/active')}>Active</TabsTrigger>
          <TabsTrigger value="completed" onClick={() => router.push('/dashboard/challenges/completed')}>Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-8">
          {/* Active Challenges Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Active Challenges
              </h2>
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/challenges/active')}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Challenge Card 1 */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>10K Steps Challenge</CardTitle>
                      <CardDescription>Complete 10,000 steps daily for 7 days</CardDescription>
                    </div>
                    <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress: 65%</span>
                      <span>6,500 / 10,000 steps</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>5 days left</span>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">
                        5 SOL Reward
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Challenge Card 2 */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Active Minutes Challenge</CardTitle>
                      <CardDescription>Achieve 30 minutes of activity daily</CardDescription>
                    </div>
                    <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress: 83%</span>
                      <span>25 / 30 minutes</span>
                    </div>
                    <Progress value={83} className="h-2" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>1 day left</span>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">
                        3 SOL Reward
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Available Challenges Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-emerald-500" />
                Available Challenges
              </h2>
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/challenges/available')}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Challenge Card 3 */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Distance Runner</CardTitle>
                      <CardDescription>Run 30km within a week</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">Join Challenge</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      <p>Track your runs through connected fitness apps and complete 30km in one week.</p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>7 days duration</span>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">
                        7 SOL Reward
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Challenge Card 4 */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Calorie Crusher</CardTitle>
                      <CardDescription>Burn 3000 calories in 5 days</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">Join Challenge</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      <p>Connect your fitness tracker and burn 3000 calories through any workout activity.</p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>5 days duration</span>
                      </div>
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">
                        4 SOL Reward
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Completed Challenges Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Completed Challenges
              </h2>
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/challenges/completed')}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {/* Challenge Card 5 */}
              <Card className="border-l-4 border-l-green-500 bg-muted/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Weekly Steps Challenge</CardTitle>
                      <CardDescription>Complete 50,000 steps in a week</CardDescription>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Completed: 100%</span>
                      <span>53,249 / 50,000 steps</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Completed May 15, 2023</span>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                        4 SOL Earned
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Challenge Card 6 */}
              <Card className="border-l-4 border-l-green-500 bg-muted/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Weekend Warrior</CardTitle>
                      <CardDescription>Complete 4 workouts in a weekend</CardDescription>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Completed: 100%</span>
                      <span>4 / 4 workouts</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Completed April 30, 2023</span>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                        3 SOL Earned
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
} 