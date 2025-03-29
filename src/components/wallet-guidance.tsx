'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

export function WalletGuidance() {
  const { wallets } = useWallet();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solana Wallet Connection</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            To interact with the blockchain, you need a Solana wallet. Here are some options:
          </p>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <a 
                href="https://phantom.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 p-2 border rounded hover:bg-muted"
              >
                <img src="https://phantom.app/img/logo.png" className="w-5 h-5" alt="Phantom" />
                <span className="text-sm">Phantom</span>
              </a>
              <a 
                href="https://solflare.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 p-2 border rounded hover:bg-muted"
              >
                <img src="https://solflare.com/assets/logo.svg" className="w-5 h-5" alt="Solflare" />
                <span className="text-sm">Solflare</span>
              </a>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            After installing a wallet, refresh this page and click the "Connect Wallet" button.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 