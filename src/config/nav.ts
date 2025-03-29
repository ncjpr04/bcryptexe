import { LayoutDashboard, Activity, Trophy, Settings } from "lucide-react"

export const navItems = {
  navMain: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Activities",
      href: "/dashboard/activities",
      icon: Activity,
    },
    {
      title: "Challenges",
      href: "/dashboard/challenges",
      icon: Trophy,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    }
  ]
} 