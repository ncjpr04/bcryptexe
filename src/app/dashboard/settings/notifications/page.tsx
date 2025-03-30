"use client"

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Trophy,
  Calendar,
  MessageSquare,
  Heart,
  Users,
  Star,
  Settings,
  Mail,
  Smartphone,
  Monitor,
  Clock
} from "lucide-react";

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  options: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  frequency: "immediate" | "daily" | "weekly" | "never";
}

export default function NotificationsSettings() {
  const [notifications, setNotifications] = useState<NotificationCategory[]>([
    {
      id: "workouts",
      title: "Workout Reminders",
      description: "Get notified about upcoming workouts and missed sessions",
      icon: <Calendar className="h-5 w-5 text-blue-500" />,
      options: { email: true, push: true, inApp: true },
      frequency: "immediate"
    },
    {
      id: "achievements",
      title: "Achievements",
      description: "Notifications for completed goals and earned badges",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      options: { email: true, push: true, inApp: true },
      frequency: "immediate"
    },
    {
      id: "social",
      title: "Social Activity",
      description: "Friend requests and social interactions",
      icon: <Users className="h-5 w-5 text-green-500" />,
      options: { email: false, push: true, inApp: true },
      frequency: "daily"
    },
    {
      id: "challenges",
      title: "Challenges",
      description: "Updates about ongoing and new challenges",
      icon: <Star className="h-5 w-5 text-purple-500" />,
      options: { email: true, push: true, inApp: true },
      frequency: "immediate"
    },
    {
      id: "community",
      title: "Community Updates",
      description: "News and updates from your fitness community",
      icon: <MessageSquare className="h-5 w-5 text-pink-500" />,
      options: { email: true, push: false, inApp: true },
      frequency: "weekly"
    }
  ]);

  const updateNotificationOption = (
    categoryId: string,
    option: 'email' | 'push' | 'inApp',
    value: boolean
  ) => {
    setNotifications(notifications.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          options: {
            ...category.options,
            [option]: value
          }
        };
      }
      return category;
    }));
  };

  const updateFrequency = (categoryId: string, frequency: string) => {
    setNotifications(notifications.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          frequency: frequency as NotificationCategory['frequency']
        };
      }
      return category;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notification Settings</h1>
          <p className="text-sm text-muted-foreground">Manage how you receive notifications and updates</p>
        </div>

        {/* Quick Settings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Quick Settings</h2>
              <p className="text-sm text-muted-foreground">Control all notifications at once</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Bell className="h-4 w-4" />
                Pause All
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Reset Defaults
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Email</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Push</span>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">In-App</span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Notification Categories */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Notification Categories</h2>
          <div className="space-y-6">
            {notifications.map((category, index) => (
              <div key={category.id}>
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-muted/50">
                    {category.icon}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-medium">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Notification Methods</Label>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`${category.id}-email`} className="text-sm">
                              Email Notifications
                            </Label>
                            <Switch
                              id={`${category.id}-email`}
                              checked={category.options.email}
                              onCheckedChange={(checked) => 
                                updateNotificationOption(category.id, 'email', checked)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`${category.id}-push`} className="text-sm">
                              Push Notifications
                            </Label>
                            <Switch
                              id={`${category.id}-push`}
                              checked={category.options.push}
                              onCheckedChange={(checked) => 
                                updateNotificationOption(category.id, 'push', checked)
                              }
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`${category.id}-inapp`} className="text-sm">
                              In-App Notifications
                            </Label>
                            <Switch
                              id={`${category.id}-inapp`}
                              checked={category.options.inApp}
                              onCheckedChange={(checked) => 
                                updateNotificationOption(category.id, 'inApp', checked)
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Frequency</Label>
                        <Select
                          value={category.frequency}
                          onValueChange={(value) => updateFrequency(category.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="weekly">Weekly Summary</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator className="my-6" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Quiet Hours */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Quiet Hours</h2>
              <p className="text-sm text-muted-foreground">Set times when you don't want to receive notifications</p>
            </div>
            <Switch />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Select defaultValue="22:00">
                <SelectTrigger>
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Select defaultValue="07:00">
                <SelectTrigger>
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 