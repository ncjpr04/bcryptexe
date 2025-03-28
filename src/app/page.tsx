'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">Web3 Fitness</div>
        <div className="space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user.email}</span>
              <Button asChild>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Transform Your Fitness Journey with Web3
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our community of fitness enthusiasts, earn crypto rewards, and achieve your fitness goals with daily challenges and support.
          </p>
          {!user && (
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Daily Challenges</h3>
            <p className="text-gray-300">
              Complete daily fitness challenges and earn rewards for your dedication.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Crypto Rewards</h3>
            <p className="text-gray-300">
              Earn cryptocurrency rewards for achieving your fitness goals and participating in challenges.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Community Support</h3>
            <p className="text-gray-300">
              Connect with like-minded individuals and get support on your fitness journey.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {!user && (
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Fitness Journey?
          </h2>
          <p className="text-gray-300 mb-8">
            Join our community today and start earning rewards for your fitness achievements.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">Create Your Account</Link>
          </Button>
        </div>
      )}
    </div>
  );
} 