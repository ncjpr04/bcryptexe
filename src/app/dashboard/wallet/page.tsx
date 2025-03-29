'use client';

import { SolTransfer } from '@/components/wallet/SolTransfer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WalletWarning } from '@/components/wallet/WalletWarning';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWalletBalance } from '@/lib/wallet/hooks';

export default function WalletPage() {
  const { publicKey, connected } = useWallet();
  const { balance, loading } = useWalletBalance();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
      <p className="text-muted-foreground">
        Manage your Solana wallet and transactions
      </p>

      {!connected && (
        <WalletWarning 
          title="Connect Your Wallet" 
          description="Connect your Solana wallet to view your balance and send transactions."
        />
      )}

      {connected && publicKey && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Info</CardTitle>
              <CardDescription>Your wallet details and balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Address</div>
                <div className="break-all rounded bg-muted p-2 text-xs">
                  {publicKey.toString()}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Balance</div>
                <div className="text-3xl font-bold">
                  {loading ? 'Loading...' : `${balance?.toFixed(6) || '0'} SOL`}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open(`https://explorer.solana.com/address/${publicKey.toString()}?cluster=devnet`, '_blank')}
                >
                  View on Explorer
                </Button>
                {balance !== null && balance < 0.1 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open('https://solfaucet.com/', '_blank')}
                  >
                    Get Devnet SOL
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <SolTransfer />
        </div>
      )}
    </div>
  );
}

import { FC } from 'react';
import { Button } from '@/components/ui/button'; 