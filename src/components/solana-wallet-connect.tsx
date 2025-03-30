import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ExclamationTriangleIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { userService } from '@/lib/userService';
import { solanaClient } from '@/lib/solanaClient';
import { PhantomProvider } from '@/types/phantom';

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider;
    };
  }
}

export default function SolanaWalletConnect() {
  const { user } = useAuthContext();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Phantom is installed and available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const provider = window.phantom?.solana;
      setProvider(provider || null);
      
      // If user already has a wallet address, set it
      if (user?.walletAddress) {
        setWalletAddress(user.walletAddress);
        setConnected(true);
      }
    }
  }, [user]);

  // Connect to Phantom wallet
  const connectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!provider) {
        throw new Error('Phantom wallet not found. Please install it from https://phantom.app/');
      }
      
      if (!user?.id) {
        throw new Error('You must be logged in to connect your wallet');
      }
      
      // Connect to wallet
      const { publicKey } = await provider.connect();
      const address = publicKey.toString();
      
      console.log('Wallet connected:', address);
      setWalletAddress(address);
      setConnected(true);
      
      // Save wallet address to user profile
      await userService.updateWalletAddress(user.id, address);
      
      // Initialize the Solana program with the wallet
      await solanaClient.initializeProgram({
        publicKey,
        signTransaction: provider.signTransaction,
        signAllTransactions: provider.signAllTransactions,
      });
      
      console.log('Solana program initialized with wallet');
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  }, [provider, user]);

  // Disconnect from wallet
  const disconnectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (provider) {
        await provider.disconnect();
      }
      
      setWalletAddress('');
      setConnected(false);
      
      // Update user profile to remove wallet address
      if (user?.id) {
        await userService.updateWalletAddress(user.id, '');
      }
      
      console.log('Wallet disconnected');
    } catch (err: any) {
      console.error('Error disconnecting wallet:', err);
      setError(err.message || 'Failed to disconnect wallet');
    } finally {
      setLoading(false);
    }
  }, [provider, user]);

  if (!user) {
    return (
      <Alert>
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          Please log in to connect your Solana wallet.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Solana Wallet
          {connected && (
            <Badge variant="success" className="ml-2">
              <CheckCircledIcon className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Connect your Solana wallet to participate in fitness challenges
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {connected ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Wallet Address:</p>
            <p className="text-xs text-muted-foreground break-all p-2 bg-muted rounded-md">
              {walletAddress}
            </p>
          </div>
        ) : (
          <div>
            {!provider ? (
              <Alert className="mb-4">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Wallet Not Found</AlertTitle>
                <AlertDescription>
                  <p>Phantom wallet is not installed. Please install it to continue.</p>
                  <a 
                    href="https://phantom.app/" 
                    target="_blank" 
                    rel="noreferrer noopener"
                    className="text-primary underline mt-2 inline-block"
                  >
                    Download Phantom
                  </a>
                </AlertDescription>
              </Alert>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">
                Connect your Phantom wallet to join fitness challenges and earn rewards.
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {connected ? (
          <Button 
            variant="outline" 
            onClick={disconnectWallet}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Disconnecting..." : "Disconnect Wallet"}
          </Button>
        ) : (
          <Button 
            onClick={connectWallet}
            disabled={loading || !provider}
            className="w-full"
          >
            {loading ? "Connecting..." : "Connect Phantom Wallet"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 