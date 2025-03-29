'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import PageIllustration from "@/components/page-illustration";
import Hero from "@/components/hero-home";
import Solutions from "@/components/solutions";
import Workflows from "@/components/workflows";
import Features from "@/components/features";
import Testimonials from "@/components/testimonials";
import Cta from "@/components/cta";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome, IconLogin, IconUserPlus, IconGauge } from "@tabler/icons-react";
// import { Timeline } from "@/components/ui/timeline";
// import { getTimelineData } from "@/utils/timelineContent";

// Get the timeline data from our utility function
// const timelineData = getTimelineData();

export default function Home() {
  const { user } = useAuth();
  
  // Define navigation items based on user authentication status
  const navItems = user 
    ? [
        { title: "Home", icon: <IconHome />, href: "/" },
        { title: "Dashboard", icon: <IconGauge />, href: "/dashboard" }
      ]
    : [
        { title: "Home", icon: <IconHome />, href: "/" },
        { title: "Sign In", icon: <IconLogin />, href: "/signin" },
        { title: "Sign Up", icon: <IconUserPlus />, href: "/signup" }
      ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gray-950">
      {/* Remove Header and nav, use FloatingDock instead */}
      <FloatingDock 
        items={navItems}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        mobileClassName="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      />

      <main className="grow relative z-10 [&>section]:bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,38,44,0.5),transparent_40%),radial-gradient(circle_at_20%_30%,rgba(37,99,235,0.1),transparent_30%)] z-0"></div>
        <div className="relative z-10">
          <PageIllustration />
          <Hero />
          <Solutions />
          {/* <Timeline data={timelineData} /> */}
          <Features />
          <Workflows />
          <Testimonials />
          <Cta />
        </div>
      </main>
    </div>
  );
}