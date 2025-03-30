import { ref, set, get, update, remove, query, orderByChild, push } from 'firebase/database';
import { getFirebaseDatabase } from './firebase';

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

class ChallengeService {
  // Get database instance safely (client-side only)
  private getDatabase() {
    // This will throw an error if called on the server
    return getFirebaseDatabase();
  }

  /**
   * Create a new challenge
   */
  async createChallenge(userId: string, challengeData: ChallengeFormData): Promise<string> {
    try {
      const db = this.getDatabase();
      const challengesRef = ref(db, 'challenges');
      
      // Generate a new unique ID for the challenge
      const newChallengeRef = push(challengesRef);
      const challengeId = newChallengeRef.key;
      
      if (!challengeId) {
        throw new Error('Failed to generate challenge ID');
      }
      
      const now = Date.now();
      
      // Prepare the challenge data with additional fields
      const challenge: Challenge = {
        id: challengeId,
        ...challengeData,
        currentParticipants: 0,
        createdBy: userId,
        createdAt: now
      };
      
      // Save the challenge to the database
      await set(newChallengeRef, challenge);
      
      console.log(`Challenge ${challengeId} created in Firebase`);
      return challengeId;
    } catch (error) {
      console.error('Error creating challenge in Firebase:', error);
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
  async joinChallenge(challengeId: string, userId: string): Promise<void> {
    try {
      const db = this.getDatabase();
      
      // First, check if the user has already joined
      const participantRef = ref(db, `challengeParticipants/${challengeId}/${userId}`);
      const participantSnapshot = await get(participantRef);
      
      if (participantSnapshot.exists()) {
        console.log(`User ${userId} has already joined challenge ${challengeId}`);
        return;
      }
      
      // Get the current challenge data
      const challengeRef = ref(db, `challenges/${challengeId}`);
      const challengeSnapshot = await get(challengeRef);
      
      if (!challengeSnapshot.exists()) {
        throw new Error(`Challenge ${challengeId} not found`);
      }
      
      const challenge = challengeSnapshot.val() as Challenge;
      
      // Check if the challenge is full
      if (challenge.currentParticipants >= challenge.maxParticipants) {
        throw new Error('Challenge is already full');
      }
      
      // Update the participant count
      await update(challengeRef, {
        currentParticipants: challenge.currentParticipants + 1
      });
      
      // Add the user to the participants list
      await set(participantRef, {
        joinedAt: Date.now(),
        status: 'active'
      });
      
      console.log(`User ${userId} joined challenge ${challengeId}`);
    } catch (error) {
      console.error('Error joining challenge:', error);
      throw error;
    }
  }

  /**
   * Get challenges created by a user
   */
  async getChallengesByCreator(userId: string): Promise<Challenge[]> {
    try {
      const db = this.getDatabase();
      const challengesRef = ref(db, 'challenges');
      const snapshot = await get(challengesRef);
      
      if (snapshot.exists()) {
        const challenges: Challenge[] = [];
        
        snapshot.forEach((childSnapshot) => {
          const challenge = childSnapshot.val() as Challenge;
          if (challenge.createdBy === userId) {
            challenges.push(challenge);
          }
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
   * Get challenges a user has joined
   */
  async getChallengesJoinedByUser(userId: string): Promise<Challenge[]> {
    try {
      const db = this.getDatabase();
      const participationsRef = ref(db, 'challengeParticipants');
      const participationsSnapshot = await get(participationsRef);
      
      if (!participationsSnapshot.exists()) {
        return [];
      }
      
      const challenges: Challenge[] = [];
      const challengePromises: Promise<void>[] = [];
      
      participationsSnapshot.forEach((challengeSnapshot) => {
        const challengeId = challengeSnapshot.key;
        const participants = challengeSnapshot.val();
        
        if (challengeId && participants && participants[userId]) {
          const promise = this.getChallengeById(challengeId).then(challenge => {
            if (challenge) {
              challenges.push(challenge);
            }
          });
          
          challengePromises.push(promise);
        }
      });
      
      await Promise.all(challengePromises);
      return challenges;
    } catch (error) {
      console.error('Error getting joined challenges from Firebase:', error);
      throw error;
    }
  }
}

export const challengeService = new ChallengeService(); 