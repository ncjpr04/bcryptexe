"use client"

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Calendar,
  Search,
  Filter,
  Clock,
  Dumbbell,
  Flame,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  Activity,
  Heart,
  Timer,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for workout history
const workoutHistory = [
  {
    id: 1,
    date: "2024-03-15",
    type: "Strength",
    name: "Upper Body Power",
    duration: "65 min",
    calories: 450,
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", weight: "70kg" },
      { name: "Pull-ups", sets: 4, reps: "8-10", weight: "BW" },
      { name: "Shoulder Press", sets: 3, reps: "10-12", weight: "25kg" }
    ],
    intensity: "High",
    heartRate: { avg: 145, max: 165 },
    mood: "Energetic",
    notes: "Great session, increased bench press weight"
  },
  // Add more workout history entries...
];

export default function HistoryPage() {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header with Filters */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Workout History</h1>
              <p className="text-sm text-muted-foreground">View and analyze your past workouts</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="h-4 w-4" />
              March 2024
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search workouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Workout Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="strength">Strength</SelectItem>
                <SelectItem value="cardio">Cardio</SelectItem>
                <SelectItem value="hiit">HIIT</SelectItem>
                <SelectItem value="flexibility">Flexibility</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Workouts", value: "86", icon: <Activity className="h-4 w-4 text-primary" /> },
            { label: "Time Spent", value: "94h 30m", icon: <Clock className="h-4 w-4 text-blue-500" /> },
            { label: "Calories Burned", value: "48,250", icon: <Flame className="h-4 w-4 text-orange-500" /> },
            { label: "Avg. Duration", value: "66 min", icon: <Timer className="h-4 w-4 text-green-500" /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
            >
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Workout History List */}
        <Card>
          <ScrollArea className="h-[600px]">
            <div className="p-4 space-y-4">
              {workoutHistory.map((workout, index) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="space-y-4">
                      {/* Workout Header */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{workout.name}</h3>
                            <Badge variant="secondary">{workout.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(workout.date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Workout Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workout.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workout.calories} kcal</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workout.heartRate.avg} bpm avg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{workout.intensity} Intensity</span>
                        </div>
                      </div>

                      {/* Exercises */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Exercises</h4>
                          <Button variant="ghost" size="sm" className="text-xs">
                            View Details
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {workout.exercises.map((exercise, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                              <span className="text-sm">{exercise.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {exercise.sets}×{exercise.reps} • {exercise.weight}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {workout.notes && (
                        <div className="text-sm text-muted-foreground border-t pt-2">
                          <span className="font-medium">Notes:</span> {workout.notes}
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
} 