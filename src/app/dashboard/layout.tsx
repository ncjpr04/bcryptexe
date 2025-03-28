"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Suspense } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Loader } from "@/components/ui/loader"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

// Create a Header component
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
          <WalletMultiButton />
        </div>
      </div>
    </div>
  )
})

// Create a memoized content wrapper
const DashboardContent = React.memo(function DashboardContent({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <Suspense 
        key={pathname}
        fallback={
          <div className="flex items-center justify-center h-full">
            <Loader size="default" />
          </div>
        }
      >
        {children}
      </Suspense>
    </main>
  )
})

function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      {/* <div className="flex min-h-screen w-[100%]"> */}
        <AppSidebar className="w-64 shrink-0" />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <DashboardContent key={pathname}>
            {children}
          </DashboardContent>
        </div>
      {/* </div> */}
    </SidebarProvider>
  )
}

export default DashboardLayout 