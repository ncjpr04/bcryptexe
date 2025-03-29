'use client';

import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { WalletWarning } from './WalletWarning';
import { Loader2 } from 'lucide-react';

export const SolTransfer: FC = () => {
  const { publicKey, sendTransaction, connected } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendSol = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!publicKey) return;

    try {
      setSending(true);
      
      // Validate recipient address
      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipient);
      } catch (error) {
        toast.error('Invalid recipient address');
        setSending(false);
        return;
      }

      // Validate amount
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        toast.error('Invalid amount');
        setSending(false);
        return;
      }

      // Connect to the Solana network
      const connection = new Connection(
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
      );

      // Create the transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports: parsedAmount * LAMPORTS_PER_SOL,
        })
      );

      // Send the transaction
      const signature = await sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast.success('Transaction successful', {
        description: `Sent ${parsedAmount} SOL to ${recipient.slice(0, 4)}...${recipient.slice(-4)}`,
        action: {
          label: "View",
          onClick: () => window.open(`https://explorer.solana.com/tx/${signature}?cluster=devnet`, '_blank')
        }
      });
      
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast.error('Transaction failed', {
        description: (error as Error).message
      });
    } finally {
      setSending(false);
    }
  };

  if (!connected) {
    return (
      <WalletWarning 
        title="Wallet Required" 
        description="You need to connect your wallet to send SOL."
      />
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Send SOL</CardTitle>
        <CardDescription>Send SOL to another wallet address</CardDescription>
      </CardHeader>
      <form onSubmit={handleSendSol}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input 
              id="recipient" 
              placeholder="Enter recipient address" 
              value={recipient} 
              onChange={(e) => setRecipient(e.target.value)} 
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (SOL)</Label>
            <Input 
              id="amount" 
              type="number" 
              placeholder="0.0" 
              step="0.000001" 
              min="0.000001" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={sending} className="w-full">
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send SOL'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}; 