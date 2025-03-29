'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export function CustomWalletButton() {
  const { wallet, connect, connecting, connected, disconnect, publicKey } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle connection errors
  useEffect(() => {
    if (wallet?.adapter.connected && !connected) {
      toast.error('Wallet connection failed', {
        description: 'Please try again or use a different wallet.'
      });
    }
  }, [wallet, connected]);

  // Save wallet connection status in localStorage
  useEffect(() => {
    if (isClient && connected) {
      localStorage.setItem('walletConnected', 'true');
    } else if (isClient && !connected) {
      localStorage.removeItem('walletConnected');
    }
  }, [isClient, connected]);

  // Try to reconnect on mount if previously connected
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected') === 'true';
    if (isClient && wasConnected && wallet && !connecting && !connected) {
      connect().catch((error) => {
        console.error('Error auto-connecting wallet:', error);
      });
    }
  }, [isClient, wallet, connect, connecting, connected]);

  const handleConnectClick = async () => {
    try {
      setIsLoading(true);
      await connect();
      toast.success('Wallet connected successfully');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectClick = async () => {
    try {
      setIsLoading(true);
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast.error('Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // For non-client-side rendering or when loading
  if (!isClient || connecting || isLoading) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{connecting ? 'Connecting...' : 'Wallet'}</span>
      </Button>
    );
  }

  // When connected
  if (connected && publicKey) {
    const walletAddress = publicKey.toString();
    const shortenedAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;

    return (
      <Button variant="outline" onClick={handleDisconnectClick} className="gap-2">
        <Wallet className="h-4 w-4" />
        {shortenedAddress}
      </Button>
    );
  }

  // When not connected
  return (
    <Button variant="outline" onClick={handleConnectClick} className="gap-2">
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
} 