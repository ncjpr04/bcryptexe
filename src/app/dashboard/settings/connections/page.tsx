"use client"

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Link,
  Unlink,
  Smartphone,
  Watch,
  Settings,
  Check,
  AlertTriangle,
  RefreshCw,
  Plus,
  ExternalLink,
  ChevronRight,
  Apple,
  Activity
} from "lucide-react";

interface ConnectedDevice {
  id: string;
  name: string;
  type: string;
  status: "connected" | "syncing" | "error";
  lastSync: string;
  batteryLevel?: number;
}

interface ConnectedApp {
  id: string;
  name: string;
  icon: string;
  status: "connected" | "expired" | "revoked";
  connectedDate: string;
  permissions: string[];
}

export default function ConnectionsSettings() {
  const [devices, setDevices] = useState<ConnectedDevice[]>([
    {
      id: "1",
      name: "Apple Watch Series 7",
      type: "smartwatch",
      status: "connected",
      lastSync: "2 minutes ago",
      batteryLevel: 82
    },
    {
      id: "2",
      name: "Fitbit Charge 5",
      type: "fitness-tracker",
      status: "syncing",
      lastSync: "15 minutes ago",
      batteryLevel: 45
    },
    {
      id: "3",
      name: "iPhone 13 Pro",
      type: "smartphone",
      status: "connected",
      lastSync: "Just now"
    }
  ]);

  const [apps, setApps] = useState<ConnectedApp[]>([
    {
      id: "1",
      name: "Apple Health",
      icon: "/icons/apple-health.png",
      status: "connected",
      connectedDate: "Connected 2 months ago",
      permissions: ["Activity data", "Heart rate", "Workouts"]
    },
    {
      id: "2",
      name: "Strava",
      icon: "/icons/strava.png",
      status: "connected",
      connectedDate: "Connected 1 month ago",
      permissions: ["Activity tracking", "Route mapping"]
    },
    {
      id: "3",
      name: "MyFitnessPal",
      icon: "/icons/myfitnesspal.png",
      status: "expired",
      connectedDate: "Expired 5 days ago",
      permissions: ["Nutrition data", "Weight tracking"]
    }
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Connected Accounts & Devices</h1>
          <p className="text-sm text-muted-foreground">Manage your connected devices, apps, and services</p>
        </div>

        {/* Connected Devices */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Connected Devices</h2>
                <p className="text-sm text-muted-foreground">Manage your synced fitness devices</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Device
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              {devices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4">
                    {device.type === "smartwatch" && <Watch className="h-8 w-8 text-primary" />}
                    {device.type === "smartphone" && <Smartphone className="h-8 w-8 text-primary" />}
                    {device.type === "fitness-tracker" && <Activity className="h-8 w-8 text-primary" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{device.name}</p>
                        <StatusBadge status={device.status} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Last sync: {device.lastSync}</span>
                        {device.batteryLevel && (
                          <>
                            <span>•</span>
                            <span>Battery: {device.batteryLevel}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Unlink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Connected Apps */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Connected Apps</h2>
                <p className="text-sm text-muted-foreground">Manage third-party app connections</p>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Connect App
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              {apps.map((app) => (
                <div key={app.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Apple className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{app.name}</p>
                          <StatusBadge status={app.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">{app.connectedDate}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {app.permissions.map((permission, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="gap-2">
                        Manage
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Data Sync Settings */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Data Sync Settings</h2>
                <p className="text-sm text-muted-foreground">Configure how your data syncs across devices</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              {[
                {
                  title: "Auto-sync Workouts",
                  description: "Automatically sync workout data across connected devices"
                },
                {
                  title: "Background Sync",
                  description: "Allow data sync when the app is in the background"
                },
                {
                  title: "Sync on Cellular",
                  description: "Sync data using cellular network when Wi-Fi is unavailable"
                }
              ].map((setting, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{setting.title}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Helper component for status badges
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "connected":
      return (
        <Badge variant="success" className="text-xs">
          Connected
        </Badge>
      );
    case "syncing":
      return (
        <Badge variant="secondary" className="text-xs">
          Syncing...
        </Badge>
      );
    case "error":
      return (
        <Badge variant="destructive" className="text-xs">
          Error
        </Badge>
      );
    case "expired":
      return (
        <Badge variant="warning" className="text-xs">
          Expired
        </Badge>
      );
    default:
      return null;
  }
} 