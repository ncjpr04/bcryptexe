"use client"

import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Coins, ArrowUp, ArrowDown, Trophy,
  Medal, Calendar, History, Wallet,
  ChevronRight, Clock, ArrowRight,
  TrendingUp, CircleDollarSign, Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EarningTransaction {
  id: string;
  type: "reward" | "entry" | "withdrawal" | "deposit";
  amount: number;
  status: "completed" | "pending" | "failed";
  description: string;
  date: string;
  challengeId?: string;
  challengeTitle?: string;
}

const transactions: EarningTransaction[] = [
  {
    id: "1",
    type: "reward",
    amount: 30,
    status: "completed",
    description: "Challenge Reward",
    date: "2024-03-15",
    challengeId: "1",
    challengeTitle: "Summer Fitness Challenge"
  },
  {
    id: "2",
    type: "entry",
    amount: -0.5,
    status: "completed",
    description: "Challenge Entry Fee",
    date: "2024-03-01",
    challengeId: "4",
    challengeTitle: "Marathon Prep Challenge"
  },
  {
    id: "3",
    type: "reward",
    amount: 75,
    status: "completed",
    description: "Challenge Reward",
    date: "2024-03-01",
    challengeId: "3",
    challengeTitle: "HIIT Warrior Challenge"
  },
  {
    id: "4",
    type: "withdrawal",
    amount: -50,
    status: "completed",
    description: "Withdrawal to Wallet",
    date: "2024-02-20"
  },
  {
    id: "5",
    type: "deposit",
    amount: 10,
    status: "completed",
    description: "Deposit from Wallet",
    date: "2024-02-15"
  }
];

export default function EarningsPage() {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalEarnings = transactions.reduce((sum, tx) => 
    tx.type === "reward" ? sum + tx.amount : sum, 0
  );

  const totalSpent = Math.abs(transactions.reduce((sum, tx) => 
    tx.type === "entry" ? sum + tx.amount : sum, 0
  ));

  const balance = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Earnings Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Balance Card */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Current Balance</span>
            </div>
            <div className="text-3xl font-bold text-primary">
              {balance.toFixed(2)} SOL
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full gap-2">
              Withdraw Funds
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>

          {/* Total Earnings Card */}
          <Card className="p-6 bg-gradient-to-br from-emerald-100/50 via-emerald-50/50 to-transparent dark:from-emerald-500/20 dark:via-emerald-500/10 dark:to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium">Total Earnings</span>
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalEarnings.toFixed(2)} SOL
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              From {transactions.filter(tx => tx.type === "reward").length} completed challenges
            </div>
          </Card>

          {/* Entry Fees Card */}
          <Card className="p-6 bg-gradient-to-br from-orange-100/50 via-orange-50/50 to-transparent dark:from-orange-500/20 dark:via-orange-500/10 dark:to-transparent">
            <div className="flex items-center gap-2 mb-2">
              <CircleDollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium">Total Entry Fees</span>
            </div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {totalSpent.toFixed(2)} SOL
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              From {transactions.filter(tx => tx.type === "entry").length} challenge entries
            </div>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            View All
          </Button>
        </div>

        <Card>
          <div className="divide-y">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2 rounded-full",
                    tx.type === "reward" && "bg-emerald-100 dark:bg-emerald-500/20",
                    tx.type === "entry" && "bg-orange-100 dark:bg-orange-500/20",
                    tx.type === "withdrawal" && "bg-red-100 dark:bg-red-500/20",
                    tx.type === "deposit" && "bg-blue-100 dark:bg-blue-500/20"
                  )}>
                    {tx.type === "reward" && <Trophy className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                    {tx.type === "entry" && <Target className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                    {tx.type === "withdrawal" && <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />}
                    {tx.type === "deposit" && <ArrowUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div>
                    <div className="font-medium">{tx.description}</div>
                    {tx.challengeTitle && (
                      <div className="text-sm text-muted-foreground">{tx.challengeTitle}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={cn(
                      "font-semibold",
                      tx.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    )}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)} SOL
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(tx.date)}
                    </div>
                  </div>
                  {tx.challengeId && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => router.push(`/dashboard/challenges/completed/${tx.challengeId}`)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 