'use client';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { LAMPORTS_PER_SOL, Connection, PublicKey } from '@solana/web3.js';

// Hook to get the current wallet balance
export function useWalletBalance() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBalance = async () => {
      if (!publicKey || !connected) {
        setBalance(null);
        return;
      }

      try {
        setLoading(true);
        const connection = new Connection(
          process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
        );
        const balance = await connection.getBalance(publicKey);
        
        if (isMounted) {
          setBalance(balance / LAMPORTS_PER_SOL);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        if (isMounted) {
          setBalance(null);
          setLoading(false);
        }
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // Refresh every 30 seconds

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [publicKey, connected]);

  return { balance, loading };
}

// Hook to check if the Phantom wallet is installed
export function usePhantomWallet() {
  const [isPhantomInstalled, setIsPhantomInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkForPhantom = () => {
      if (typeof window !== 'undefined' && window.solana && window.solana.isPhantom) {
        setIsPhantomInstalled(true);
      } else {
        setIsPhantomInstalled(false);
      }
    };

    // Wait for the window object to be available
    if (typeof window !== 'undefined') {
      checkForPhantom();
    } else {
      // If SSR, set to null until we can check
      setIsPhantomInstalled(null);
    }
  }, []);

  return { isPhantomInstalled };
} 