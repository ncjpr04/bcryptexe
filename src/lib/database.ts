import { getDatabase, ref, set, get, update, remove, push, query, orderByChild, equalTo, increment as firebaseIncrement } from 'firebase/database';
import { app } from './firebase';

const db = getDatabase(app);

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture: string;
  googleFitToken?: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'daily' | 'weekly' | 'special';
  startDate: number;
  endDate: number;
  requirements: {
    type: string;
    value: number;
    unit: string;
  };
}

export interface UserChallenge {
  userId: string;
  challengeId: string;
  status: 'pending' | 'completed' | 'failed';
  progress: number;
  completedAt?: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  requirements: {
    type: string;
    value: number;
  };
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: number;
}

class DatabaseService {
  async createUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      console.log('Creating user profile for:', userId);
      const now = Date.now();
      await set(ref(db, `users/${userId}`), {
        ...data,
        createdAt: now,
        updatedAt: now
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('Getting user profile for:', userId);
      const snapshot = await get(ref(db, `users/${userId}`));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      console.log('Updating user profile for:', userId, 'with data:', data);
      const updates = {
        ...data,
        updatedAt: Date.now()
      };
      await update(ref(db, `users/${userId}`), updates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Challenge Operations
  async createChallenge(challenge: Omit<Challenge, 'id'>): Promise<string> {
    const challengesRef = ref(db, 'challenges');
    const newChallengeRef = push(challengesRef);
    const challengeWithId = {
      ...challenge,
      id: newChallengeRef.key,
    };
    await set(newChallengeRef, challengeWithId);
    return newChallengeRef.key!;
  }

  async getChallenges(type?: Challenge['type']): Promise<Challenge[]> {
    const challengesRef = ref(db, 'challenges');
    let challengesQuery = challengesRef;
    
    if (type) {
      challengesQuery = query(challengesRef, orderByChild('type'), equalTo(type));
    }

    const snapshot = await get(challengesQuery);
    const challenges: Challenge[] = [];
    snapshot.forEach((childSnapshot) => {
      challenges.push(childSnapshot.val());
    });
    return challenges;
  }

  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    const userChallengesRef = ref(db, `userChallenges/${userId}`);
    const snapshot = await get(userChallengesRef);
    const challenges: UserChallenge[] = [];
    snapshot.forEach((childSnapshot) => {
      challenges.push(childSnapshot.val());
    });
    return challenges;
  }

  async updateChallengeProgress(userId: string, challengeId: string, progress: number): Promise<void> {
    const userChallengeRef = ref(db, `userChallenges/${userId}/${challengeId}`);
    await update(userChallengeRef, { progress });
  }

  async completeChallenge(userId: string, challengeId: string): Promise<void> {
    // First get the challenge details to get the points
    const challengeRef = ref(db, `challenges/${challengeId}`);
    const challengeSnapshot = await get(challengeRef);
    
    if (!challengeSnapshot.exists()) {
      throw new Error(`Challenge ${challengeId} not found`);
    }
    
    const challenge = challengeSnapshot.val();
    
    const userChallengeRef = ref(db, `userChallenges/${userId}/${challengeId}`);
    await update(userChallengeRef, {
      status: 'completed',
      completedAt: Date.now(),
    });

    // Update user stats
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, {
      'stats/challengesCompleted': this.increment(1),
      'stats/totalPoints': this.increment(challenge.points),
      updatedAt: Date.now(),
    });
  }

  // Achievement Operations
  async getAchievements(): Promise<Achievement[]> {
    const achievementsRef = ref(db, 'achievements');
    const snapshot = await get(achievementsRef);
    const achievements: Achievement[] = [];
    snapshot.forEach((childSnapshot) => {
      achievements.push(childSnapshot.val());
    });
    return achievements;
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const userAchievementsRef = ref(db, `userAchievements/${userId}`);
    const snapshot = await get(userAchievementsRef);
    const achievements: UserAchievement[] = [];
    snapshot.forEach((childSnapshot) => {
      achievements.push(childSnapshot.val());
    });
    return achievements;
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    // First get the achievement details to get the points
    const achievementRef = ref(db, `achievements/${achievementId}`);
    const achievementSnapshot = await get(achievementRef);
    
    if (!achievementSnapshot.exists()) {
      throw new Error(`Achievement ${achievementId} not found`);
    }
    
    const achievement = achievementSnapshot.val();
    
    const userAchievementRef = ref(db, `userAchievements/${userId}/${achievementId}`);
    await set(userAchievementRef, {
      userId,
      achievementId,
      unlockedAt: Date.now(),
    });

    // Update user stats
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, {
      'stats/totalPoints': this.increment(achievement.points),
    });
  }

  // Helper function for incrementing values
  private increment(value: number) {
    return firebaseIncrement(value);
  }
}

export const database = new DatabaseService(); 