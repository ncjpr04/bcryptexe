import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/components/WalletContextProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { Loader } from "@/components/ui/loader"
import { GoogleFitProvider } from "@/contexts/GoogleFitContext"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web3 Fitness Tracker",
  description: "Stake crypto and compete in fitness challenges",
};

function RootLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader size="lg" text="Loading..." className="text-muted-foreground" />
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <GoogleFitProvider>
              <WalletContextProvider>
                <main>
                  <Suspense fallback={<RootLoading />}>
                    {children}
                  </Suspense>
                </main>
              </WalletContextProvider>
            </GoogleFitProvider>
          </AuthProvider>
        </ThemeProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
