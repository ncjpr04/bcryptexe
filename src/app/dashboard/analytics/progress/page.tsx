"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  TrendingUp,
  Calendar,
  Timer,
  Dumbbell,
  Flame,
  Target,
  Award,
  ChevronUp,
  ChevronDown,
  Scale,
  Heart,
  Zap,
  BarChart,
  ArrowRight,
  Info,
  Medal,
  Trophy,
  Clock,
  Download
} from "lucide-react";
import {
  Tooltip as TippyTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// You'll need to install recharts
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';

const mockData = {
  weeklyActivity: [
    { day: 'Mon', workouts: 2, calories: 450, duration: 65, steps: 8200 },
    { day: 'Tue', workouts: 1, calories: 320, duration: 45, steps: 7500 },
    { day: 'Wed', workouts: 3, calories: 550, duration: 90, steps: 12000 },
    { day: 'Thu', workouts: 2, calories: 400, duration: 60, steps: 9000 },
    { day: 'Fri', workouts: 1, calories: 300, duration: 40, steps: 6800 },
    { day: 'Sat', workouts: 4, calories: 680, duration: 120, steps: 15000 },
    { day: 'Sun', workouts: 2, calories: 420, duration: 70, steps: 10500 }
  ],
  monthlyProgress: [
    { week: 'W1', weight: 75, strength: 80, cardio: 65, recovery: 75 },
    { week: 'W2', weight: 74.5, strength: 82, cardio: 68, recovery: 78 },
    { week: 'W3', weight: 74, strength: 85, cardio: 72, recovery: 82 },
    { week: 'W4', weight: 73.2, strength: 87, cardio: 75, recovery: 85 }
  ],
  personalBests: [
    { exercise: "Bench Press", current: "75kg", previous: "70kg", improvement: "+7.1%" },
    { exercise: "Squats", current: "100kg", previous: "92kg", improvement: "+8.7%" },
    { exercise: "Deadlift", current: "120kg", previous: "110kg", improvement: "+9.1%" }
  ],
  weeklyGoals: {
    workouts: { target: 15, current: 12 },
    calories: { target: 5000, current: 3120 },
    steps: { target: 70000, current: 52000 }
  },
  achievements: [
    { title: "Workout Warrior", description: "Completed 100 workouts", date: "2024-03-15", icon: <Trophy className="h-4 w-4" /> },
    { title: "Early Bird", description: "5 morning workouts in a row", date: "2024-03-12", icon: <Clock className="h-4 w-4" /> },
    { title: "Strength Master", description: "New PR in all lifts", date: "2024-03-10", icon: <Medal className="h-4 w-4" /> }
  ]
};

// Add new mock data for additional charts
const additionalMockData = {
  workoutDistribution: [
    { name: 'Strength', value: 45, color: '#6366f1' },
    { name: 'Cardio', value: 30, color: '#22c55e' },
    { name: 'Flexibility', value: 15, color: '#eab308' },
    { name: 'Recovery', value: 10, color: '#ec4899' },
  ],
  performanceMetrics: [
    { name: 'Strength', value: 85, fill: '#6366f1' },
    { name: 'Endurance', value: 75, fill: '#22c55e' },
    { name: 'Speed', value: 65, fill: '#eab308' },
    { name: 'Power', value: 80, fill: '#ec4899' },
  ],
};

// Add this new component for animated stats
const AnimatedStat = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.toString().replace(/[^0-9]/g, ''));
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default function ProgressPage() {
  const [timeRange, setTimeRange] = useState("30days");
  const [selectedMetric, setSelectedMetric] = useState("workouts");
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Calculate goal progress percentages
  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Progress Analytics</h1>
            <p className="text-sm text-muted-foreground">Track your fitness journey and achievements</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="default" size="sm">
              <Award className="h-4 w-4 mr-2" />
              View Goals
            </Button>
          </div>
        </div>

        {/* Weekly Goals - New Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(mockData.weeklyGoals).map(([key, { target, current }]) => (
            <Card key={key} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{key} Goal</span>
                  <Badge variant="outline" className="text-xs">Weekly</Badge>
                </div>
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{current}</span>
                  <span className="text-muted-foreground">/ {target}</span>
                </div>
                <Progress value={calculateProgress(current, target)} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {target - current} more to reach your goal
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Workouts",
              value: "24",
              change: "+12%",
              trend: "up",
              icon: <Activity className="h-4 w-4 text-green-500" />,
              metric: "vs last month",
              tooltip: "Total number of workouts completed this month"
            },
            {
              title: "Calories Burned",
              value: "12,450",
              change: "+8%",
              icon: <Flame className="h-4 w-4 text-orange-500" />,
              metric: "kcal this month"
            },
            {
              title: "Workout Duration",
              value: "32h 15m",
              change: "+15%",
              icon: <Timer className="h-4 w-4 text-blue-500" />,
              metric: "total time"
            },
            {
              title: "Achievement Rate",
              value: "85%",
              change: "+5%",
              icon: <Target className="h-4 w-4 text-purple-500" />,
              metric: "goal completion"
            }
          ].map((stat, i) => (
            <Card key={i} className="p-6 space-y-2 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{stat.title}</span>
                  <TooltipProvider>
                    <TippyTooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{stat.tooltip}</p>
                      </TooltipContent>
                    </TippyTooltip>
                  </TooltipProvider>
                </div>
                {stat.icon}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <Badge 
                  variant={stat.trend === 'up' ? 'success' : 'destructive'} 
                  className="flex items-center gap-1"
                >
                  {stat.trend === 'up' ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">{stat.metric}</span>
            </Card>
          ))}
        </div>

        {/* Enhanced Charts Section */}
        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <Tabs defaultValue="workouts" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Weekly Activity</h3>
                    <p className="text-sm text-muted-foreground">Workouts and calories burned</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger value="workouts">Workouts</TabsTrigger>
                      <TabsTrigger value="calories">Calories</TabsTrigger>
                      <TabsTrigger value="steps">Steps</TabsTrigger>
                    </TabsList>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <AnimatePresence mode="wait">
                  <TabsContent value="workouts" className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={mockData.weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="workouts" 
                          fill="#6366f1"
                          radius={[4, 4, 0, 0]}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </TabsContent>

                  <TabsContent value="calories" className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockData.weeklyActivity}>
                        <defs>
                          <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="calories" 
                          stroke="#6366f1" 
                          fillOpacity={1}
                          fill="url(#colorCalories)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </TabsContent>

                  <TabsContent value="steps" className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData.weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="steps" 
                          stroke="#6366f1" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </AnimatePresence>
              </Tabs>
            </Card>
          </motion.div>

          {/* Enhanced Progress Tracking */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold">Monthly Progress</h3>
                  <p className="text-sm text-muted-foreground">Strength and cardio improvements</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="strength">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strength">Strength</SelectItem>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                      <SelectItem value="recovery">Recovery</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData.monthlyProgress}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="strength" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="cardio" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enhanced Achievements Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">Recent Achievements</h3>
                <p className="text-sm text-muted-foreground">Your latest milestones</p>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {mockData.achievements.map((achievement, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <time className="text-xs text-muted-foreground">
                          {new Date(achievement.date).toLocaleDateString()}
                        </time>
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </motion.div>

        {/* Enhanced Detailed Metrics with Interactive Elements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Bests with Progress Visualization */}
          <Card className="p-6 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Personal Bests</h3>
                <Badge variant="outline">Updated</Badge>
              </div>
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-4">
              {mockData.personalBests.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.exercise}</span>
                    <Badge variant="success" className="text-xs">
                      {item.improvement}
                    </Badge>
                  </div>
                  <div className="relative pt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Previous: {item.previous}</span>
                      <span>Current: {item.current}</span>
                    </div>
                    <Progress 
                      value={parseInt(item.improvement)} 
                      className="h-1.5" 
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">View All Records</Button>
          </Card>

          {/* Body Metrics */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Body Metrics</h3>
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              {[
                { metric: "Weight", value: "73.2kg (-1.8kg)" },
                { metric: "Body Fat", value: "15% (-2%)" },
                { metric: "Muscle Mass", value: "35kg (+1kg)" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.metric}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">Update Measurements</Button>
          </Card>

          {/* Health Metrics */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Health Metrics</h3>
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              {[
                { metric: "Resting HR", value: "65 bpm" },
                { metric: "Avg. Active HR", value: "145 bpm" },
                { metric: "Recovery Score", value: "8.5/10" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.metric}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">View Health Data</Button>
          </Card>
        </div>

        {/* Performance Overview - New Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Workout Distribution</h3>
                <p className="text-sm text-muted-foreground">Activity type breakdown</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={additionalMockData.workoutDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {additionalMockData.workoutDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value}%`}
                    contentStyle={{ background: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold">Performance Metrics</h3>
                <p className="text-sm text-muted-foreground">Current fitness levels</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" 
                  cy="50%" 
                  innerRadius="20%" 
                  outerRadius="80%" 
                  data={additionalMockData.performanceMetrics}
                  startAngle={180} 
                  endAngle={0}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise={true}
                    dataKey="value"
                    cornerRadius={12}
                  />
                  <Legend 
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Animated Stats Row - New Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Minutes", value: "1945", icon: <Clock className="h-4 w-4" /> },
            { label: "Calories Burned", value: "12450", icon: <Flame className="h-4 w-4" /> },
            { label: "Workouts", value: "24", icon: <Activity className="h-4 w-4" /> },
            { label: "Achievement Score", value: "850", icon: <Trophy className="h-4 w-4" /> },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold">
                  <AnimatedStat value={stat.value} />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 