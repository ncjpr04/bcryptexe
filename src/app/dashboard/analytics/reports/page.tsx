"use client"

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Calendar,
  Download,
  Share2,
  TrendingUp,
  BarChart3,
  Activity,
  Dumbbell,
  Heart,
  Timer,
  Flame,
  ArrowUp,
  ArrowDown,
  Target,
  Scale,
  LineChart,
  PieChart
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart
} from 'recharts';

const mockData = {
  progressTrends: [
    { month: 'Jan', strength: 65, cardio: 45, flexibility: 30 },
    { month: 'Feb', strength: 68, cardio: 52, flexibility: 35 },
    { month: 'Mar', strength: 75, cardio: 58, flexibility: 40 },
    { month: 'Apr', strength: 80, cardio: 65, flexibility: 45 },
  ],
  weeklyActivity: [
    { day: 'Mon', workouts: 2, duration: 85, calories: 450 },
    { day: 'Tue', workouts: 1, duration: 45, calories: 280 },
    { day: 'Wed', workouts: 3, duration: 120, calories: 650 },
    { day: 'Thu', workouts: 2, duration: 90, calories: 480 },
    { day: 'Fri', workouts: 1, duration: 60, calories: 320 },
    { day: 'Sat', workouts: 2, duration: 100, calories: 520 },
    { day: 'Sun', workouts: 0, duration: 0, calories: 0 },
  ]
};

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Fitness Reports</h1>
            <p className="text-sm text-muted-foreground">Comprehensive analysis of your fitness journey</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Report Navigation */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Workout Completion",
                  value: "92%",
                  change: "+8%",
                  trend: "up",
                  icon: <Activity className="h-4 w-4 text-primary" />
                },
                {
                  label: "Strength Progress",
                  value: "15%",
                  change: "+5%",
                  trend: "up",
                  icon: <Dumbbell className="h-4 w-4 text-orange-500" />
                },
                {
                  label: "Recovery Score",
                  value: "8.5",
                  change: "-0.2",
                  trend: "down",
                  icon: <Heart className="h-4 w-4 text-red-500" />
                },
                {
                  label: "Goal Progress",
                  value: "78%",
                  change: "+12%",
                  trend: "up",
                  icon: <Target className="h-4 w-4 text-green-500" />
                }
              ].map((metric, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{metric.label}</span>
                    {metric.icon}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    <span className={`text-xs flex items-center ${
                      metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {metric.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {metric.change}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Progress Trends */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold">Progress Trends</h3>
                  <p className="text-sm text-muted-foreground">Performance across different aspects</p>
                </div>
                <Select defaultValue="3months">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockData.progressTrends}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="strength" 
                      stackId="1"
                      stroke="#6366f1" 
                      fill="#6366f1" 
                      fillOpacity={0.2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cardio" 
                      stackId="1"
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.2}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="flexibility" 
                      stackId="1"
                      stroke="#eab308" 
                      fill="#eab308" 
                      fillOpacity={0.2}
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Weekly Activity */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold">Weekly Activity</h3>
                  <p className="text-sm text-muted-foreground">Workout frequency and intensity</p>
                </div>
              </div>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={mockData.weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="workouts" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Legend />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Additional Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Top Achievements</h3>
                <div className="space-y-4">
                  {[
                    { title: "Most Active Week", value: "15 workouts" },
                    { title: "Highest Intensity", value: "85% max HR" },
                    { title: "Longest Streak", value: "21 days" }
                  ].map((achievement, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{achievement.title}</span>
                      <span className="font-medium">{achievement.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Areas for Improvement</h3>
                <div className="space-y-4">
                  {[
                    { area: "Recovery Days", suggestion: "Add more rest between intense workouts" },
                    { area: "Workout Variety", suggestion: "Include more flexibility training" },
                    { area: "Consistency", suggestion: "Maintain regular weekend sessions" }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="font-medium text-sm">{item.area}</div>
                      <p className="text-sm text-muted-foreground">{item.suggestion}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Add content for other tabs */}
        </Tabs>
      </div>
    </div>
  );
} 