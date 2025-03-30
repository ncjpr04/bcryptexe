import { Connection, PublicKey, Transaction, SystemProgram, Keypair } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN, Wallet } from '@project-serum/anchor';
import { userService } from './userService';
import { database } from './database';
import { ref, set, get } from 'firebase/database';

// Instead of importing the IDL, define it inline
const idl = {
  "version": "0.1.0",
  "name": "fitness_challenges",
  "instructions": [
    {
      "name": "createChallenge",
      "accounts": [
        {
          "name": "challenge",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "entryFee",
          "type": "u64"
        },
        {
          "name": "startDate",
          "type": "i64"
        },
        {
          "name": "endDate",
          "type": "i64"
        }
      ]
    },
    {
      "name": "joinChallenge",
      "accounts": [
        {
          "name": "challenge",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "participant",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "Challenge",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "title",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "entryFee",
            "type": "u64"
          },
          {
            "name": "startDate",
            "type": "i64"
          },
          {
            "name": "endDate",
            "type": "i64"
          },
          {
            "name": "participants",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "prizePool",
            "type": "u64"
          }
        ]
      }
    }
  ]
};

// The program ID from our deployed contract
const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

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

      this.wallet = wallet;
      
      const provider = new AnchorProvider(
        this.connection,
        wallet,
        { preflightCommitment: 'processed' }
      );
      
      // @ts-ignore - we know the IDL is valid
      this.program = new Program(idl, PROGRAM_ID, provider);
      
      console.log('Solana program initialized successfully');
      return this.program;
    } catch (error) {
      console.error('Error initializing Solana program:', error);
      return null;
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

  // Save challenge data to Firebase (for easier querying and displaying in the UI)
  private async syncChallengeToFirebase(challengeId: string, challengeData: SolanaChallenge) {
    try {
      const challengeRef = ref(database, `challenges/${challengeId}`);
      await set(challengeRef, challengeData);
      console.log(`Challenge ${challengeId} synced to Firebase`);
    } catch (error) {
      console.error('Error syncing challenge to Firebase:', error);
    }
  }

  // Add challenge to user's active challenges in Firebase
  private async addChallengeToUserProfile(userId: string, challengeId: string, walletAddress: string) {
    try {
      // Get user profile
      const user = await userService.getUserById(userId);
      
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }
      
      // Update user's active challenges
      const activeChallenges = user.activeChallenges || {};
      activeChallenges[challengeId] = {
        joinedAt: Date.now(),
        walletAddress,
        status: 'active'
      };
      
      // Update the user profile
      await userService.updateUser(userId, { activeChallenges });
      
      console.log(`Challenge ${challengeId} added to user ${userId}'s profile`);
    } catch (error) {
      console.error('Error adding challenge to user profile:', error);
    }
  }

  // Update the participants count in Firebase
  private async updateChallengeParticipantsCount(challengeId: string) {
    try {
      // Get the current challenge from Firebase
      const challengeRef = ref(database, `challenges/${challengeId}`);
      const snapshot = await get(challengeRef);
      
      if (snapshot.exists()) {
        const challenge = snapshot.val();
        challenge.currentParticipants = (challenge.currentParticipants || 0) + 1;
        
        // Update the challenge
        await set(challengeRef, challenge);
      }
    } catch (error) {
      console.error('Error updating challenge participants count:', error);
    }
  }
}

// Singleton instance
export const solanaClient = new SolanaClient(); 