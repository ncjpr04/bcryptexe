import { Connection, PublicKey, Transaction, SystemProgram, Keypair, Signer } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import { userService } from './userService';
import { database } from './database';
import { ref, set, get, update } from 'firebase/database';
import * as idlJson from './idl/idl.json';
import { getFirebaseDatabase } from './firebase';

// The program ID from our deployed contract
const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS'
);

// Types
export interface SolanaChallenge {
  id: string;
  title: string;
  entryFee: number; // In lamports
  prizePool: number; // In lamports
  maxParticipants: number;
  currentParticipants: number;
  deadline: number; // UNIX timestamp
  startDate: number; // UNIX timestamp
  isActive: boolean;
  isCancelled: boolean;
  creator: string; // Public key as string
  publicKey: string; // PDA public key as string
}

// Types for our wallet adapter
export interface Wallet {
  publicKey: PublicKey;
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
}

// Convert from raw account data to our type
function parseChallengeAccount(account: any, pubkey: PublicKey): SolanaChallenge {
  return {
    id: account.challengeId,
    title: account.title,
    entryFee: account.entryFee.toNumber(),
    prizePool: account.prizePool.toNumber(),
    maxParticipants: account.maxParticipants,
    currentParticipants: account.currentParticipants,
    deadline: account.deadlineTimestamp.toNumber(),
    startDate: account.startTimestamp.toNumber(),
    isActive: account.isActive,
    isCancelled: account.isCancelled,
    creator: account.creator.toString(),
    publicKey: pubkey.toString()
  };
}

class SolanaClient {
  private connection: Connection;
  private program: Program | null = null;
  private wallet: Wallet | null = null;

  constructor() {
    // Initialize the connection to Solana devnet
    this.connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );
  }

  // Initialize the Anchor program (client-side only)
  async initializeProgram(wallet: Wallet) {
    try {
      if (typeof window === 'undefined') {
        console.error('Solana client can only be initialized in browser');
        return null;
      }

      // Check if the program ID is the placeholder
      if (PROGRAM_ID.toString() === 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS') {
        console.warn('Using placeholder program ID. This will not work with a real Solana program.');
        console.warn('Please set NEXT_PUBLIC_SOLANA_PROGRAM_ID environment variable to your deployed program ID.');
      }

      this.wallet = wallet;
      
      // Create AnchorProvider with our wallet
      const provider = new AnchorProvider(
        this.connection,
        wallet,
        { preflightCommitment: 'processed' }
      );
      
      // Use the imported IDL
      this.program = new Program(
        idlJson as any, 
        PROGRAM_ID, 
        provider
      );
      
      console.log('Solana program initialized successfully with ID:', PROGRAM_ID.toString());
      return this.program;
    } catch (error: any) {
      console.error('Error initializing Solana program:', error);
      throw new Error(`Failed to initialize Solana program: ${error.message}`);
    }
  }

  // Create a new challenge
  async createChallenge(
    challengeId: string, 
    title: string, 
    entryFee: number, 
    prizePool: number, 
    maxParticipants: number,
    startTimestamp: number,
    deadlineTimestamp: number
  ) {
    try {
      if (!this.program || !this.wallet) {
        throw new Error('Program not initialized');
      }

      // For development/testing only - bypass blockchain call if using placeholder program ID
      if (PROGRAM_ID.toString() === 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS') {
        console.warn('Using placeholder program ID - bypassing actual blockchain transaction');
        
        // Generate a mock challenge PDA
        const challengePda = Keypair.generate().publicKey;
        const mockTx = 'mock_tx_' + Date.now();
        
        // Save the challenge data to Firebase
        await this.syncChallengeToFirebase(challengeId, {
          id: challengeId,
          title,
          entryFee,
          prizePool,
          maxParticipants,
          currentParticipants: 0,
          deadline: deadlineTimestamp,
          startDate: startTimestamp,
          isActive: true,
          isCancelled: false,
          creator: this.wallet.publicKey.toString(),
          publicKey: challengePda.toString()
        });
        
        return { signature: mockTx, challengeAddress: challengePda.toString() };
      }

      // Derive the challenge PDA
      const [challengePda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('challenge'),
          Buffer.from(challengeId),
        ],
        PROGRAM_ID
      );

      // Call the contract to initialize the challenge
      const tx = await this.program.methods
        .initializeChallenge(
          challengeId,
          title,
          new BN(entryFee),
          new BN(prizePool),
          maxParticipants,
          new BN(deadlineTimestamp),
          new BN(startTimestamp)
        )
        .accounts({
          challenge: challengePda,
          creator: this.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('Challenge created with transaction signature:', tx);
      
      // Save the same challenge data to Firebase
      await this.syncChallengeToFirebase(challengeId, {
        id: challengeId,
        title,
        entryFee,
        prizePool,
        maxParticipants,
        currentParticipants: 0,
        deadline: deadlineTimestamp,
        startDate: startTimestamp,
        isActive: true,
        isCancelled: false,
        creator: this.wallet.publicKey.toString(),
        publicKey: challengePda.toString()
      });
      
      return { signature: tx, challengeAddress: challengePda.toString() };
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  }

  // Join a challenge
  async joinChallenge(challengeId: string, userFirebaseUid: string) {
    try {
      if (!this.program || !this.wallet) {
        throw new Error('Program not initialized');
      }

      // Derive the challenge PDA
      const [challengePda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('challenge'),
          Buffer.from(challengeId),
        ],
        PROGRAM_ID
      );
      
      // Derive the participant PDA
      const [participantPda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('participant'),
          challengePda.toBuffer(),
          this.wallet.publicKey.toBuffer(),
        ],
        PROGRAM_ID
      );
      
      // Call the contract to join the challenge
      const tx = await this.program.methods
        .joinChallenge(userFirebaseUid)
        .accounts({
          challenge: challengePda,
          participant: participantPda,
          user: this.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
      
      console.log('Challenge joined with transaction signature:', tx);
      
      // Update user's active challenges in Firebase
      await this.addChallengeToUserProfile(userFirebaseUid, challengeId, this.wallet.publicKey.toString());
      
      // Update challenge participants count in Firebase
      await this.updateChallengeParticipantsCount(challengeId);
      
      return { signature: tx, participantAddress: participantPda.toString() };
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  }

  // Get all challenges from the blockchain
  async getAllChallenges(): Promise<SolanaChallenge[]> {
    try {
      if (!this.program) {
        throw new Error('Program not initialized');
      }
      
      // Fetch all challenge accounts
      const challengeAccounts = await this.program.account.challenge.all();
      
      // Parse the accounts into our type
      return challengeAccounts.map(account => 
        parseChallengeAccount(account.account, account.publicKey)
      );
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }
  }

  // Get a specific challenge
  async getChallenge(challengeId: string): Promise<SolanaChallenge | null> {
    try {
      if (!this.program) {
        throw new Error('Program not initialized');
      }
      
      // Derive the challenge PDA
      const [challengePda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('challenge'),
          Buffer.from(challengeId),
        ],
        PROGRAM_ID
      );
      
      // Fetch the challenge account
      const challengeAccount = await this.program.account.challenge.fetch(challengePda);
      
      return parseChallengeAccount(challengeAccount, challengePda);
    } catch (error) {
      console.error(`Error fetching challenge ${challengeId}:`, error);
      return null;
    }
  }

  // Sync challenge data to Firebase
  private async syncChallengeToFirebase(challengeId: string, challengeData: SolanaChallenge) {
    try {
      if (typeof window === 'undefined') {
        console.warn('Cannot sync to Firebase from server side');
        return;
      }
      
      const db = getFirebaseDatabase();
      if (!db) {
        console.error('Firebase database not initialized');
        return;
      }
      
      const challengeRef = ref(db, `challenges/${challengeId}`);
      await update(challengeRef, challengeData);
      console.log(`Challenge ${challengeId} synced to Firebase`);
    } catch (error: any) {
      console.error('Error syncing challenge to Firebase:', error);
    }
  }

  // Add challenge to user profile
  private async addChallengeToUserProfile(userId: string, challengeId: string, walletAddress: string) {
    try {
      // Get current timestamp
      const now = Date.now();
      
      // Update user's active challenges
      await userService.updateUser(userId, {
        activeChallenges: {
          [challengeId]: {
            joinedAt: now,
            walletAddress,
            status: 'active',
            progress: 0
          }
        }
      });
      
      console.log(`Challenge ${challengeId} added to user ${userId} profile`);
    } catch (error: any) {
      console.error('Error adding challenge to user profile:', error);
      throw error;
    }
  }

  // Update challenge participants count
  private async updateChallengeParticipantsCount(challengeId: string) {
    try {
      if (typeof window === 'undefined') {
        console.warn('Cannot update Firebase from server side');
        return;
      }
      
      const db = getFirebaseDatabase();
      if (!db) {
        console.error('Firebase database not initialized');
        return;
      }
      
      const challengeRef = ref(db, `challenges/${challengeId}`);
      
      // Get current challenge data
      const snapshot = await get(challengeRef);
      if (snapshot.exists()) {
        const challengeData = snapshot.val();
        
        // Increment participants count
        await update(challengeRef, {
          currentParticipants: (challengeData.currentParticipants || 0) + 1
        });
        
        console.log(`Updated participants count for challenge ${challengeId}`);
      }
    } catch (error: any) {
      console.error('Error updating challenge participants count:', error);
      throw error;
    }
  }

  // Complete a challenge (admin function)
  async completeChallenge(challengeId: string, winnerPositions: string[]) {
    try {
      if (!this.program || !this.wallet) {
        throw new Error('Program not initialized');
      }

      // Derive the challenge PDA
      const [challengePda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('challenge'),
          Buffer.from(challengeId),
        ],
        PROGRAM_ID
      );

      // Convert winner positions to PublicKeys
      const winnerPublicKeys = winnerPositions.map(pos => new PublicKey(pos));

      // Call the contract to complete the challenge
      const tx = await this.program.methods
        .completeChallenge(winnerPublicKeys)
        .accounts({
          challenge: challengePda,
          creator: this.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log('Challenge completed with transaction signature:', tx);
      
      // Update the challenge in Firebase
      if (typeof window === 'undefined') {
        console.warn('Cannot update Firebase from server side');
        return { signature: tx };
      }
      
      const db = getFirebaseDatabase();
      if (!db) {
        console.error('Firebase database not initialized');
        return { signature: tx };
      }
      
      const challengeRef = ref(db, `challenges/${challengeId}`);
      const snapshot = await get(challengeRef);
      if (snapshot.exists()) {
        const challenge = snapshot.val();
        challenge.isActive = false;
        
        // Update the challenge
        await set(challengeRef, challenge);
      }
      
      return { signature: tx };
    } catch (error: any) {
      console.error('Error completing challenge:', error);
      throw error;
    }
  }
}

// Singleton instance
export const solanaClient = new SolanaClient(); 