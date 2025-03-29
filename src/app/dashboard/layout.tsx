"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Loader } from "@/components/ui/loader"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/AuthContext"
import { Suspense, useEffect, useState } from "react"
import { WalletProvider } from "@/contexts/WalletContext"
import { WalletButton } from "@/components/wallet/wallet-button"

// Memoize the header to prevent unnecessary re-renders
const DashboardHeader = React.memo(function DashboardHeader() {
  const pathname = usePathname()
  
  const getBreadcrumbs = React.useMemo(() => {
    const paths = pathname.split('/').filter(Boolean)
    return paths.map((path, index) => {
      const href = '/' + paths.slice(0, index + 1).join('/')
      return {
        title: path.charAt(0).toUpperCase() + path.slice(1),
        href
      }
    })
  }, [pathname])

  return (
    <div className="sticky top-0 z-50 border-b bg-background w-full">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 max-w-full">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <Breadcrumb>
            <BreadcrumbList>
              {getBreadcrumbs.map((item, index) => (
                <React.Fragment key={item.href}>
                  <BreadcrumbItem>
                    <Link 
                      href={item.href}
                      className="hover:text-foreground text-muted-foreground transition-colors"
                    >
                      {item.title}
                    </Link>
                  </BreadcrumbItem>
                  {index < getBreadcrumbs.length - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <WalletButton />
        </div>
      </div>
    </div>
  )
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const [isReady, setIsReady] = useState(false)
  
  // Simple check for authentication without redirects
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 1000)
    
    if (!isLoading && user) {
      setIsReady(true)
      clearTimeout(timer)
    }
    
    return () => clearTimeout(timer)
  }, [isLoading, user])
  
  if ((isLoading || !isReady) && !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    )
  }
  
  if (!user) {
    return null
  }

  return (
    <WalletProvider>
      <SidebarProvider>
        <div className="flex w-full">
          <AppSidebar className="w-64 shrink-0" />
          <div className="flex-1 flex flex-col w-full">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-6">
              <Suspense fallback={
                <div className="flex items-center justify-center h-full">
                  <Loader size="default" />
                </div>
              }>
                {children}
              </Suspense>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </WalletProvider>
  )
} 