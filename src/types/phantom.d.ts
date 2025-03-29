interface Window {
  solana?: {
    isPhantom?: boolean;
    connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: any }>;
    disconnect: () => Promise<void>;
  };
} 