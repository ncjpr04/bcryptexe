"use client"

import { toast } from "sonner"

export interface PhantomWindow extends Window {
  phantom?: {
    solana?: {
      isPhantom: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: any }>;
      disconnect: () => Promise<void>;
      signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
      signTransaction: (transaction: any) => Promise<any>;
      signAllTransactions: (transactions: any[]) => Promise<any[]>;
      request: (request: any) => Promise<any>;
      on: (event: string, callback: (args: any) => void) => void;
      publicKey?: { toString: () => string };
    }
  }
}

declare const window: PhantomWindow;

export interface WalletConnection {
  publicKey: string | null;
  isConnected: boolean;
  isPhantomInstalled: boolean;
}

class PhantomWalletService {
  private static instance: PhantomWalletService;
  private _isConnected: boolean = false;
  private _publicKey: string | null = null;
  private _listeners: Array<(connection: WalletConnection) => void> = [];

  private constructor() {
    // Initialize on client side only
    if (typeof window !== 'undefined') {
      this.checkConnection();
      
      // Add event listener for connection changes
      if (window.phantom?.solana) {
        window.phantom.solana.on('connect', () => {
          this.updateConnection(true, window.phantom?.solana?.publicKey?.toString() || null);
        });
        
        window.phantom.solana.on('disconnect', () => {
          this.updateConnection(false, null);
        });
      }
    }
  }

  public static getInstance(): PhantomWalletService {
    if (!PhantomWalletService.instance) {
      PhantomWalletService.instance = new PhantomWalletService();
    }
    return PhantomWalletService.instance;
  }

  private updateConnection(isConnected: boolean, publicKey: string | null) {
    this._isConnected = isConnected;
    this._publicKey = publicKey;
    
    // Notify all listeners
    this._listeners.forEach(listener => {
      listener(this.getConnectionInfo());
    });
  }

  public checkConnection(): WalletConnection {
    if (typeof window === 'undefined') {
      return {
        publicKey: null,
        isConnected: false,
        isPhantomInstalled: false
      };
    }

    const isPhantomInstalled = window.phantom?.solana?.isPhantom || false;
    this._isConnected = window.phantom?.solana?.isConnected || false;
    this._publicKey = window.phantom?.solana?.publicKey?.toString() || null;
    
    return {
      publicKey: this._publicKey,
      isConnected: this._isConnected,
      isPhantomInstalled
    };
  }

  public getConnectionInfo(): WalletConnection {
    return {
      publicKey: this._publicKey,
      isConnected: this._isConnected,
      isPhantomInstalled: typeof window !== 'undefined' && !!window.phantom?.solana?.isPhantom
    };
  }

  public async connect(): Promise<WalletConnection> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot connect to Phantom wallet in server environment');
    }
    
    if (!window.phantom?.solana) {
      toast.error('Phantom wallet not found', {
        description: 'Please install Phantom wallet extension first.',
        action: {
          label: 'Install',
          onClick: () => window.open('https://phantom.app/', '_blank')
        }
      });
      throw new Error('Phantom wallet not installed');
    }
    
    try {
      const response = await window.phantom.solana.connect();
      const publicKey = response.publicKey.toString();
      
      this.updateConnection(true, publicKey);
      toast.success('Wallet connected successfully');
      
      return {
        publicKey,
        isConnected: true,
        isPhantomInstalled: true
      };
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      toast.error('Failed to connect wallet', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot disconnect Phantom wallet in server environment');
    }
    
    if (!window.phantom?.solana) {
      throw new Error('Phantom wallet not installed');
    }
    
    try {
      await window.phantom.solana.disconnect();
      this.updateConnection(false, null);
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting from Phantom wallet:', error);
      toast.error('Failed to disconnect wallet');
      throw error;
    }
  }

  public addConnectionListener(listener: (connection: WalletConnection) => void): () => void {
    this._listeners.push(listener);
    
    // Return a function to remove the listener
    return () => {
      this._listeners = this._listeners.filter(l => l !== listener);
    };
  }

  // Helper to get a shortened address for display
  public shortenAddress(address: string | null, chars = 4): string {
    if (!address) return '';
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  }
}

export const phantomWallet = PhantomWalletService.getInstance(); 