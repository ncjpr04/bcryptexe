import { ref, set, get, update, remove, query, orderByChild, push, equalTo } from 'firebase/database';
import { getFirebaseDatabase } from './firebase';
import { DatabaseReference } from 'firebase/database';
import { userService } from './userService';
import { solanaClient, SolanaChallenge } from './solanaClient';
import { PublicKey } from '@solana/web3.js';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  duration: number;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  deadline: string;
  startDate: string;
  createdBy: string; // User ID of creator
  createdAt: number; // Timestamp
  goal: {
    type: string;
    target: number;
    unit: string;
  };
  prizes: {
    position: string;
    amount: number;
    percentage: number;
  }[];
  tags: string[];
  entryFee: number; // In SOL (will be converted to lamports for blockchain)
  prizePool: number; // In SOL (will be converted to lamports for blockchain)
  prizes: {
    [position: string]: number; // Position (1st, 2nd, 3rd) -> prize amount in SOL
  };
  startDate: number; // UNIX timestamp
  endDate: number; // UNIX timestamp
  deadline: number; // UNIX timestamp for joining
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  type: 'steps' | 'distance' | 'calories' | 'workouts';
  criteria: {
    target: number; // Target value (e.g., 10000 steps)
    unit: string; // Unit (e.g., 'steps', 'km', 'kcal', 'workouts')
  };
  maxParticipants: number;
  currentParticipants: number;
  createdBy: string; // User ID
  creatorWallet: string; // Wallet address
  isActive: boolean;
  isCancelled: boolean;
  rules: string[];
  updatedAt: number;
  contractAddress?: string; // Solana contract address
}

export interface ChallengeFormData {
  title: string;
  description: string;
  type: string;
  difficulty: string;
  duration: number;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  deadline: string;
  startDate: string;
  goal: {
    type: string;
    target: number;
    unit: string;
  };
  prizes: {
    position: string;
    amount: number;
    percentage: number;
  }[];
  tags: string[];
}

export interface UserChallengeProgress {
  userId: string;
  challengeId: string;
  progress: number;
  currentValue: number;
  targetValue: number;
  startDate: number;
  lastUpdated: number;
  isComplete: boolean;
  walletAddress: string;
}

class ChallengeService {
  constructor() {
    // Remove these lines that cause the error
    // this.challengesRef = ref(database, 'challenges');
    // this.progressRef = ref(database, 'challengeProgress');
  }

  // Get database instance safely (client-side only)
  private getDatabase() {
    // This will throw an error if called on the server
    return getFirebaseDatabase();
  }

  /**
   * Create a new challenge
   */
  async createChallenge(challengeData: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt' | 'currentParticipants'>): Promise<string> {
    try {
      const db = this.getDatabase();
      // Generate a new ID for the challenge
      const challengesRef = ref(db, 'challenges');
      const newChallengeRef = push(challengesRef);
      const challengeId = newChallengeRef.key as string;
      
      // Create the challenge object
      const challenge: Challenge = {
        ...challengeData,
        id: challengeId,
        currentParticipants: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      // Convert SOL to lamports for blockchain interaction
      const entryFeeLamports = Math.floor(challenge.entryFee * 1e9); // 1 SOL = 10^9 lamports
      const prizePoolLamports = Math.floor(challenge.prizePool * 1e9);
      
      // Create the challenge on the blockchain first
      const { signature, challengeAddress } = await solanaClient.createChallenge(
        challengeId,
        challenge.title,
        entryFeeLamports,
        prizePoolLamports,
        challenge.maxParticipants,
        challenge.startDate,
        challenge.deadline
      );
      
      // Add the contract address to the challenge data
      challenge.contractAddress = challengeAddress;
      
      // Save the challenge to Firebase
      await set(newChallengeRef, challenge);
      
      console.log(`Challenge ${challengeId} created with transaction ${signature}`);
      return challengeId;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  }

  /**
   * Get all available challenges
   */
  async getAllChallenges(): Promise<Challenge[]> {
    try {
      const db = this.getDatabase();
      const challengesRef = ref(db, 'challenges');
      const snapshot = await get(challengesRef);
      
      if (snapshot.exists()) {
        const challenges: Challenge[] = [];
        
        snapshot.forEach((childSnapshot) => {
          challenges.push(childSnapshot.val() as Challenge);
        });
        
        return challenges;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting challenges from Firebase:', error);
      throw error;
    }
  }

  /**
   * Get a challenge by ID
   */
  async getChallengeById(challengeId: string): Promise<Challenge | null> {
    try {
      const db = this.getDatabase();
      const challengeRef = ref(db, `challenges/${challengeId}`);
      const snapshot = await get(challengeRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as Challenge;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting challenge from Firebase:', error);
      throw error;
    }
  }

  /**
   * Update a challenge
   */
  async updateChallenge(challengeId: string, challengeData: Partial<Challenge>): Promise<void> {
    try {
      const db = this.getDatabase();
      const challengeRef = ref(db, `challenges/${challengeId}`);
      
      await update(challengeRef, challengeData);
      
      console.log(`Challenge ${challengeId} updated in Firebase`);
    } catch (error) {
      console.error('Error updating challenge in Firebase:', error);
      throw error;
    }
  }

  /**
   * Join a challenge
   */
  async joinChallenge(userId: string, challengeId: string, walletAddress: string): Promise<boolean> {
    try {
      const db = this.getDatabase();
      
      // Get the challenge
      const challenge = await this.getChallengeById(challengeId);
      
      if (!challenge) {
        throw new Error(`Challenge ${challengeId} not found`);
      }
      
      // Check if the challenge is still open
      const now = Date.now();
      if (
        !challenge.isActive ||
        challenge.isCancelled ||
        challenge.deadline < now ||
        challenge.currentParticipants >= challenge.maxParticipants
      ) {
        throw new Error('Challenge is no longer available for joining');
      }
      
      // Get the user
      const user = await userService.getUserById(userId);
      
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }
      
      // Check if the user has already joined this challenge
      if (user.activeChallenges && user.activeChallenges[challengeId]) {
        throw new Error('You have already joined this challenge');
      }
      
      // Join the challenge on the Solana blockchain
      try {
        // Initialize the Solana client with the user's wallet
        await solanaClient.initializeProgram({
          publicKey: new PublicKey(walletAddress),
          // Note: The signTransaction and signAllTransactions would come from the 
          // wallet provider (e.g., Phantom) in the browser. Here we're just supporting
          // the interface for testing/development.
          signTransaction: async (tx) => tx,
          signAllTransactions: async (txs) => txs,
        });
        
        // Call the joinChallenge method on the Solana contract
        const result = await solanaClient.joinChallenge(challengeId, userId);
        console.log(`User ${userId} joined challenge ${challengeId} on blockchain with tx: ${result.signature}`);
        
        // The solanaClient.joinChallenge already updates the user profile and challenge data in Firebase
        // so we don't need to do that here, but we'll create the progress entry

        // Create initial progress entry
        await this.createChallengeProgress({
          userId,
          challengeId,
          progress: 0,
          currentValue: 0,
          targetValue: challenge.criteria.target,
          startDate: now,
          lastUpdated: now,
          isComplete: false,
          walletAddress
        });

        return true;
      } catch (blockchainError) {
        console.error('Error joining challenge on blockchain:', blockchainError);
        throw new Error(`Failed to join challenge on blockchain: ${blockchainError.message}`);
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  }

  /**
   * Get challenges created by a specific user
   */
  async getChallengesByCreator(userId: string): Promise<Challenge[]> {
    try {
      const db = this.getDatabase();
      const challengesRef = ref(db, 'challenges');
      const creatorQuery = query(challengesRef, orderByChild('createdBy'), equalTo(userId));
      const snapshot = await get(creatorQuery);
      
      if (snapshot.exists()) {
        const challenges: Challenge[] = [];
        
        snapshot.forEach((childSnapshot) => {
          challenges.push(childSnapshot.val() as Challenge);
        });
        
        return challenges;
      }
      
      return [];
    } catch (error) {
      console.error('Error getting challenges by creator from Firebase:', error);
      throw error;
    }
  }

  /**
   * Get challenges joined by a specific user
   */
  async getChallengesJoinedByUser(userId: string): Promise<Challenge[]> {
    try {
      // First get the user to see which challenges they've joined
      const user = await userService.getUserById(userId);
      
      if (!user || !user.activeChallenges || Object.keys(user.activeChallenges).length === 0) {
        return [];
      }
      
      // Get all the challenge IDs the user has joined
      const challengeIds = Object.keys(user.activeChallenges);
      
      // Now get each challenge
      const challenges: Challenge[] = [];
      
      for (const challengeId of challengeIds) {
        const challenge = await this.getChallengeById(challengeId);
        
        if (challenge) {
          // Add the user's progress to the challenge object
          const enhancedChallenge = {
            ...challenge,
            userProgress: user.activeChallenges[challengeId].progress || 0,
            userStatus: user.activeChallenges[challengeId].status
          };
          
          challenges.push(enhancedChallenge as unknown as Challenge);
        }
      }
      
      return challenges;
    } catch (error) {
      console.error('Error getting challenges joined by user from Firebase:', error);
      throw error;
    }
  }

  /**
   * Create a new challenge progress entry
   */
  private async createChallengeProgress(progressData: UserChallengeProgress): Promise<void> {
    try {
      const db = this.getDatabase();
      const progressRef = ref(db, `challengeProgress/${progressData.challengeId}/${progressData.userId}`);
      await set(progressRef, progressData);
    } catch (error) {
      console.error('Error creating challenge progress:', error);
      throw error;
    }
  }

  /**
   * Update a user's challenge progress
   */
  async updateChallengeProgress(
    userId: string,
    challengeId: string,
    newValue: number
  ): Promise<void> {
    try {
      // Get the challenge
      const challenge = await this.getChallengeById(challengeId);
      
      if (!challenge) {
        throw new Error(`Challenge ${challengeId} not found`);
      }
      
      // Get the user's current progress
      const progress = await this.getUserChallengeProgress(userId, challengeId);
      
      if (!progress) {
        throw new Error(`Progress for user ${userId} in challenge ${challengeId} not found`);
      }
      
      // Calculate new progress percentage
      const targetValue = challenge.criteria.target;
      const newCurrentValue = Math.min(newValue, targetValue); // Cap at target value
      const newProgressPercentage = Math.floor((newCurrentValue / targetValue) * 100);
      const isComplete = newCurrentValue >= targetValue;
      
      // Update the progress entry
      const db = this.getDatabase();
      const progressRef = ref(db, `challengeProgress/${challengeId}/${userId}`);
      
      await update(progressRef, {
        progress: newProgressPercentage,
        currentValue: newCurrentValue,
        lastUpdated: Date.now(),
        isComplete
      });
      
      // Also update the user's active challenges
      await userService.updateUser(userId, {
        activeChallenges: {
          [challengeId]: {
            progress: newProgressPercentage,
            status: isComplete ? 'completed' : 'active'
          }
        }
      });
      
      console.log(`Updated progress for user ${userId} in challenge ${challengeId} to ${newProgressPercentage}%`);
    } catch (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }
  }

  /**
   * Get a user's progress in a specific challenge
   */
  async getUserChallengeProgress(userId: string, challengeId: string): Promise<UserChallengeProgress | null> {
    try {
      const db = this.getDatabase();
      const progressRef = ref(db, `challengeProgress/${challengeId}/${userId}`);
      const snapshot = await get(progressRef);
      
      return snapshot.exists() ? snapshot.val() as UserChallengeProgress : null;
    } catch (error) {
      console.error('Error getting user challenge progress:', error);
      throw error;
    }
  }

  /**
   * Get the leaderboard for a challenge
   */
  async getChallengeLeaderboard(challengeId: string): Promise<UserChallengeProgress[]> {
    try {
      const db = this.getDatabase();
      const progressRef = ref(db, `challengeProgress/${challengeId}`);
      const snapshot = await get(progressRef);
      
      if (snapshot.exists()) {
        const progressEntries: UserChallengeProgress[] = [];
        
        snapshot.forEach((childSnapshot) => {
          progressEntries.push(childSnapshot.val() as UserChallengeProgress);
        });
        
        // Sort by progress (descending)
        return progressEntries.sort((a, b) => b.progress - a.progress);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting challenge leaderboard:', error);
      throw error;
    }
  }

  // Complete a challenge (to be called by an admin or automated system)
  async completeChallenge(challengeId: string, adminId: string): Promise<void> {
    try {
      const challengeRef = ref(database, `challenges/${challengeId}`);
      const snapshot = await get(challengeRef);
      
      if (!snapshot.exists()) {
        throw new Error(`Challenge ${challengeId} not found`);
      }
      
      const challenge = snapshot.val() as Challenge;
      
      // Only the creator should be able to complete a challenge
      if (challenge.createdBy !== adminId) {
        throw new Error('Only the challenge creator can complete a challenge');
      }
      
      // Get the leaderboard to determine winners
      const leaderboard = await this.getChallengeLeaderboard(challengeId);
      
      // Mark the challenge as inactive
      await update(challengeRef, {
        isActive: false,
        updatedAt: Date.now()
      });
      
      // Sort the leaderboard by progress
      const sortedLeaderboard = leaderboard.sort((a, b) => b.progress - a.progress);
      
      // Get the winners based on the prizes
      const prizePositions = Object.keys(challenge.prizes).map(Number);
      const winners = sortedLeaderboard.slice(0, Math.max(...prizePositions));
      
      // Prepare data for blockchain call
      const winnerWallets = winners.map(winner => winner.walletAddress);
      
      // Complete the challenge on the blockchain (note: in a real implementation,
      // this would need proper wallet authorization and winner verification)
      // This is just a placeholder for the actual implementation
      console.log(`Challenge ${challengeId} completed. Winners: ${JSON.stringify(winnerWallets)}`);
      
      // Note: The actual distribution of prizes would happen through the smart contract
      // in a separate admin function call after oracle verification
      
      return;
    } catch (error) {
      console.error(`Error completing challenge ${challengeId}:`, error);
      throw error;
    }
  }

  // Cancel a challenge (only by creator)
  async cancelChallenge(challengeId: string, userId: string): Promise<void> {
    try {
      const challengeRef = ref(database, `challenges/${challengeId}`);
      const snapshot = await get(challengeRef);
      
      if (!snapshot.exists()) {
        throw new Error(`Challenge ${challengeId} not found`);
      }
      
      const challenge = snapshot.val() as Challenge;
      
      // Only the creator should be able to cancel a challenge
      if (challenge.createdBy !== userId) {
        throw new Error('Only the challenge creator can cancel a challenge');
      }
      
      // Mark the challenge as cancelled
      await update(challengeRef, {
        isActive: false,
        isCancelled: true,
        updatedAt: Date.now()
      });
      
      // Note: In a real implementation, the contract would handle the refunds
      console.log(`Challenge ${challengeId} cancelled by ${userId}`);
      
      return;
    } catch (error) {
      console.error(`Error cancelling challenge ${challengeId}:`, error);
      throw error;
    }
  }
}

export const challengeService = new ChallengeService(); 