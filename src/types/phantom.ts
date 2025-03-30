import { PublicKey, Transaction } from '@solana/web3.js';

export interface PhantomProvider {
  publicKey: PublicKey;
  isConnected: boolean;
  isPhantom: boolean;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, handler: (args: any) => void) => void;
  request: (args: any) => Promise<any>;
}

export interface PhantomWindow extends Window {
  phantom?: {
    solana?: PhantomProvider;
  };
} 