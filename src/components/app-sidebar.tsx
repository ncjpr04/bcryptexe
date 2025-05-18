"use client"

import * as React from "react"
import {
  Home,
  Trophy,
  Wallet,
  Medal,
  Users,
  Settings2,
  HelpCircle,
  User,
  Bell,
  Shield,
  Store,
  Calendar,
  BadgeCheck,
  MessageSquare,
  LineChart,
} from "lucide-react"
import Link from "next/link"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"

// Updated navigation data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Challenges",
      url: "/dashboard/challenges",
      icon: Trophy,
      items: [
        {
          title: "Join Challenges",
          url: "/dashboard/challenges/available",
        },
        {
          title: "Create Challenges",
          url: "/dashboard/challenges/create",
        },
        {
          title: "My Challenges",
          url: "/dashboard/challenges/active",
        },
        {
          title: "Completed",
          url: "/dashboard/challenges/completed",
        },
      ],
    },
    {
      title: "Earnings & Wallet",
      url: "/dashboard/earnings",
      icon: Wallet
    },
    {
      title: "Leaderboard",
      url: "/dashboard/leaderboard",
      icon: Medal,
      items: [
        {
          title: "Top Performers",
          url: "/dashboard/leaderboard/top",
        },
        {
          title: "My Achievements",
          url: "/dashboard/leaderboard/achievements",
        },
        {
          title: "NFT Badges",
          url: "/dashboard/leaderboard/badges",
        },
      ],
    },
    {
      title: "Community",
      url: "/dashboard/community",
      icon: Users,
      items: [
        {
          title: "Social",
          url: "/dashboard/community/social",
        },
        {
          title: "Friends",
          url: "/dashboard/community/friends",
        },
        {
          title: "Discord",
          url: "/dashboard/community/discord",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: LineChart,
      items: [
        {
          title: "Progress",
          url: "/dashboard/analytics/progress",
        },
        {
          title: "History",
          url: "/dashboard/analytics/history",
        },
        {
          title: "Reports",
          url: "/dashboard/analytics/reports",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
        },
        {
          title: "Security",
          url: "/dashboard/settings/security",
        },
        {
          title: "Connected Apps",
          url: "/dashboard/settings/connections",
        },
      ],
    },
    {
      title: "Help & Support",
      url: "/dashboard/help",
      icon: HelpCircle,
      items: [
        {
          title: "FAQs & Guides",
          url: "/dashboard/help/guides",
        },
        {
          title: "Support Ticket",
          url: "/dashboard/help/support",
        },
        {
          title: "Contact Us",
          url: "/dashboard/help/contact",
        },
      ],
    },
  ],
  // Optional future features
  futureFeatures: [
    {
      title: "Marketplace",
      url: "/dashboard/marketplace",
      icon: Store,
      items: [
        {
          title: "NFT Store",
          url: "/dashboard/marketplace/nft",
        },
        {
          title: "Fitness Gear",
          url: "/dashboard/marketplace/gear",
        },
      ],
    },
    {
      title: "Workout Plans",
      url: "/dashboard/workouts",
      icon: Calendar,
      items: [
        {
          title: "My Plans",
          url: "/dashboard/workouts/plans",
        },
        {
          title: "Create Plan",
          url: "/dashboard/workouts/create",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const userData = {
    name: user?.displayName || 'User',
    email: user?.email || '',
    avatar: user?.photoURL || '/avatars/default.png',
    signOut: handleSignOut
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/dashboard" className="px-6 text-lg font-semibold hover:text-foreground transition-colors">
          BCryptExe
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
