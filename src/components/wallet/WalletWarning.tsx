'use client';

import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePhantomWallet } from '@/lib/wallet/hooks';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WalletButton } from '@/components/wallet/WalletButton';
import Link from 'next/link';

interface WalletWarningProps {
  title?: string;
  description?: string;
}

export const WalletWarning: FC<WalletWarningProps> = ({
  title = 'Wallet Not Connected',
  description = 'You need to connect your wallet to use this feature.'
}) => {
  const { connected } = useWallet();
  const { isPhantomInstalled } = usePhantomWallet();

  if (connected) {
    return null;
  }

  return (
    <Alert>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {description}
        <div className="mt-4 flex items-center space-x-4">
          <WalletButton />
          {!isPhantomInstalled && (
            <Link href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
              Install Phantom Wallet
            </Link>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}; 