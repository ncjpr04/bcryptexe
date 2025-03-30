import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleFitProvider } from "@/contexts/GoogleFitContext";
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web3 Fitness Tracker",
  description: "Stake crypto and compete in fitness challenges",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GoogleOAuthProvider clientId={clientId}>
            <AuthProvider>
              <GoogleFitProvider>
                {children}
              </GoogleFitProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
