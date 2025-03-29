'use client';

import { FC } from 'react';
import { useWalletBalance } from '@/lib/wallet/hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { useWallet } from '@solana/wallet-adapter-react';

export const WalletBalance: FC = () => {
  const { balance, loading } = useWalletBalance();
  const { connected } = useWallet();

  if (!connected) {
    return null;
  }

  if (loading) {
    return <Skeleton className="h-6 w-24" />;
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">
        {balance !== null ? `${balance.toFixed(4)} SOL` : 'Error loading balance'}
      </span>
    </div>
  );
}; 