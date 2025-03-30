"use client"

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Scale,
  Ruler,
  Camera,
  Bell,
  Globe,
  Moon,
  Sun,
  Shield,
  Languages
} from "lucide-react";

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        {/* Profile Information */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <p className="text-sm text-muted-foreground">Update your photo and personal details</p>
            </div>
            <Button 
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="space-y-8">
            {/* Profile Photo */}
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/avatars/user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <Button variant="outline" size="sm">Remove</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: Square JPG, PNG, or GIF, at least 400x400 pixels.
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  disabled={!isEditing}
                  defaultValue="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  disabled={!isEditing}
                  defaultValue="johndoe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  disabled={!isEditing}
                  defaultValue="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 000-0000"
                  disabled={!isEditing}
                  defaultValue="+1 (555) 000-0000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="New York, USA"
                  disabled={!isEditing}
                  defaultValue="New York, USA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select disabled={!isEditing} defaultValue="america-new_york">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america-new_york">Eastern Time (ET)</SelectItem>
                    <SelectItem value="america-los_angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="europe-london">London (GMT)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  disabled={!isEditing}
                  defaultValue="Fitness enthusiast and tech professional. Love challenging myself with new workout routines."
                  className="h-20"
                />
              </div>
            </div>

            {/* Physical Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Physical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    placeholder="175 cm"
                    disabled={!isEditing}
                    defaultValue="175"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    placeholder="70 kg"
                    disabled={!isEditing}
                    defaultValue="70"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthdate">Date of Birth</Label>
                  <Input
                    id="birthdate"
                    type="date"
                    disabled={!isEditing}
                    defaultValue="1990-01-01"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            )}
          </div>
        </Card>

        {/* Preferences */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Preferences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive updates about your workouts</div>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Language</div>
                <div className="text-sm text-muted-foreground">Select your preferred language</div>
              </div>
              <Select defaultValue="en">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Theme</div>
                <div className="text-sm text-muted-foreground">Choose your preferred theme</div>
              </div>
              <Select defaultValue="system">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-6">Privacy Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Profile Visibility</div>
                <div className="text-sm text-muted-foreground">Control who can see your profile</div>
              </div>
              <Select defaultValue="public">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Activity Sharing</div>
                <div className="text-sm text-muted-foreground">Share your workout activities</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 