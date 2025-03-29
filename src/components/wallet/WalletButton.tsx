'use client';

import { FC, useCallback, useEffect, useState, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet as WalletIcon } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export const WalletButton: FC = () => {
  const { publicKey, wallet, disconnect, connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(false);

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const content = useMemo(() => {
    if (connecting) return 'Connecting...';
    if (connected) return shortenAddress(base58!);
    return 'Connect Wallet';
  }, [connecting, connected, base58]);

  const shortenAddress = (address: string, chars = 4): string => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };

  const copyAddress = useCallback(async () => {
    if (base58) {
      await navigator.clipboard.writeText(base58);
      setCopied(true);
      toast.success('Address copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [base58]);

  const openModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error(error);
      toast.error('Failed to disconnect');
    }
  }, [disconnect]);

  useEffect(() => {
    if (wallet && connected && publicKey) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [wallet, connected, publicKey]);

  if (!connected) {
    return (
      <Button 
        variant="outline" 
        onClick={openModal} 
        disabled={connecting}
        className="relative"
      >
        {connecting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <WalletIcon className="mr-2 h-4 w-4" />
        )}
        {content}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`relative ${active ? "bg-primary/10" : ""}`}
        >
          <WalletIcon className="mr-2 h-4 w-4" />
          {content}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyAddress}>
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`https://explorer.solana.com/address/${base58}?cluster=devnet`, '_blank')}>
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect}>
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 