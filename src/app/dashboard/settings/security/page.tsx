"use client"

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Key,
  Smartphone,
  Mail,
  AlertTriangle,
  Check,
  X,
  Eye,
  EyeOff,
  LogOut,
  History,
  Lock,
  Fingerprint
} from "lucide-react";

export default function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Mock login history
  const loginHistory = [
    {
      device: "Windows PC - Chrome",
      location: "New York, USA",
      time: "Just now",
      status: "Current session"
    },
    {
      device: "iPhone 13 - Safari",
      location: "New York, USA",
      time: "2 hours ago",
      status: "Active"
    },
    {
      device: "MacBook Pro - Firefox",
      location: "Boston, USA",
      time: "Yesterday",
      status: "Expired"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account security and authentication methods</p>
        </div>

        {/* Password Section */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Change Password</h2>
                <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
              </div>
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter current password"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    onChange={(e) => {
                      // Simple password strength calculation
                      const value = e.target.value;
                      let strength = 0;
                      if (value.length >= 8) strength++;
                      if (/[A-Z]/.test(value)) strength++;
                      if (/[0-9]/.test(value)) strength++;
                      if (/[^A-Za-z0-9]/.test(value)) strength++;
                      setPasswordStrength(strength);
                    }}
                  />
                </div>
                <div className="flex gap-1 mt-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-full rounded-full ${
                        i < passwordStrength
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <Button className="w-full">Update Password</Button>
            </div>
          </div>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Authenticator App</p>
                    <p className="text-sm text-muted-foreground">Use an authenticator app to generate codes</p>
                  </div>
                </div>
                <Button variant="outline">Setup</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Authentication</p>
                    <p className="text-sm text-muted-foreground">Receive codes via email</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Fingerprint className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Biometric Authentication</p>
                    <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
                  </div>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Sessions */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Active Sessions</h2>
                <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
              </div>
              <Button variant="destructive" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out All
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              {loginHistory.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium">{session.device}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{session.location}</span>
                      <span>•</span>
                      <span>{session.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.status === "Current session" ? (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Current session
                      </span>
                    ) : (
                      <Button variant="outline" size="sm">
                        Sign Out
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Security Log */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Security Activity</h2>
                <p className="text-sm text-muted-foreground">Recent security events on your account</p>
              </div>
              <History className="h-5 w-5 text-muted-foreground" />
            </div>

            <Separator />

            <div className="space-y-4">
              {[
                {
                  event: "Password changed",
                  time: "2 days ago",
                  location: "New York, USA",
                  status: "success"
                },
                {
                  event: "Failed login attempt",
                  time: "3 days ago",
                  location: "Unknown location",
                  status: "warning"
                },
                {
                  event: "Two-factor authentication enabled",
                  time: "1 week ago",
                  location: "New York, USA",
                  status: "success"
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.status === "success" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
                      <p className="font-medium">{activity.event}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{activity.location}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 