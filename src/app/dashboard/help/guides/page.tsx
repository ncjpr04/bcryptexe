"use client"

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Book,
  PlayCircle,
  ChevronRight,
  Clock,
  Star,
  Bookmark,
  Award,
  Dumbbell,
  Heart,
  Wallet,
  Users,
  ArrowRight,
  Filter
} from "lucide-react";

interface Guide {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "video" | "article";
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  bookmarked?: boolean;
}

export default function GuidesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const guides: Guide[] = [
    {
      id: "1",
      title: "Getting Started with Web3 Fitness",
      description: "Learn the basics of connecting your wallet and earning rewards",
      category: "basics",
      type: "video",
      duration: "5 min",
      difficulty: "beginner",
      bookmarked: true
    },
    {
      id: "2",
      title: "Understanding Fitness Rewards",
      description: "Complete guide to earning and staking fitness tokens",
      category: "rewards",
      type: "article",
      duration: "8 min",
      difficulty: "intermediate"
    },
    // Add more guides...
  ];

  const categories = [
    { id: "all", name: "All Guides", icon: <Book className="h-4 w-4" /> },
    { id: "basics", name: "Getting Started", icon: <Award className="h-4 w-4" /> },
    { id: "workouts", name: "Workouts", icon: <Dumbbell className="h-4 w-4" /> },
    { id: "rewards", name: "Rewards", icon: <Wallet className="h-4 w-4" /> },
    { id: "health", name: "Health", icon: <Heart className="h-4 w-4" /> },
    { id: "community", name: "Community", icon: <Users className="h-4 w-4" /> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Help Guides</h1>
          <p className="text-sm text-muted-foreground">Browse tutorials and guides to get the most out of Web3 Fitness</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm">
              Most Recent
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className="gap-2 whitespace-nowrap"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>

        {/* Featured Guide */}
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5" />
          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="space-y-4 flex-1">
                <Badge variant="secondary">Featured Guide</Badge>
                <h2 className="text-2xl font-bold">Complete Guide to Fitness Rewards</h2>
                <p className="text-muted-foreground">
                  Learn everything about earning, staking, and maximizing your fitness rewards in this comprehensive guide.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <PlayCircle className="h-4 w-4" />
                    <span>Video Guide</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>15 min</span>
                  </div>
                  <Badge>Beginner Friendly</Badge>
                </div>
                <Button className="gap-2">
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="w-full md:w-[300px] h-[200px] bg-muted rounded-lg">
                {/* Placeholder for guide thumbnail/preview */}
              </div>
            </div>
          </div>
        </Card>

        {/* Guide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Card key={guide.id} className="flex flex-col">
              <div className="p-6 space-y-4 flex-1">
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="capitalize">
                    {guide.category}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={guide.bookmarked ? "text-primary" : ""}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground">{guide.description}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {guide.type === "video" ? (
                      <PlayCircle className="h-4 w-4" />
                    ) : (
                      <Book className="h-4 w-4" />
                    )}
                    <span className="capitalize">{guide.type}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{guide.duration}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Button variant="outline" className="w-full gap-2">
                  View Guide
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Quick Start Guides",
              description: "Get started with basic platform features",
              icon: <Award className="h-6 w-6 text-primary" />,
              count: 5
            },
            {
              title: "Workout Tutorials",
              description: "Learn proper form and techniques",
              icon: <Dumbbell className="h-6 w-6 text-green-500" />,
              count: 12
            },
            {
              title: "Rewards & Tokens",
              description: "Understanding the reward system",
              icon: <Wallet className="h-6 w-6 text-yellow-500" />,
              count: 8
            }
          ].map((category, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="p-2 w-fit rounded-lg bg-muted">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{category.count} guides</Badge>
                  <Button variant="ghost" size="sm" className="gap-2">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 