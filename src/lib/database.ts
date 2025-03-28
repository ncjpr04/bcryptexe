import { ref, set, get, update, remove, push, query, orderByChild, equalTo } from 'firebase/database';
import { realtimeDb } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: number;
  lastLogin: number;
  stats: {
    challengesCompleted: number;
    totalPoints: number;
    streak: number;
  };
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

export class DatabaseService {
  private db = realtimeDb;

  // User Profile Operations
  async createUserProfile(userId: string, email: string, displayName?: string, photoURL?: string): Promise<void> {
    const userRef = ref(this.db, `users/${userId}`);
    const userProfile: UserProfile = {
      uid: userId,
      email,
      displayName,
      photoURL,
      createdAt: Date.now(),
      lastLogin: Date.now(),
      stats: {
        challengesCompleted: 0,
        totalPoints: 0,
        streak: 0,
      },
    };
    await set(userRef, userProfile);
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const userRef = ref(this.db, `users/${userId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const userRef = ref(this.db, `users/${userId}`);
    await update(userRef, updates);
  }

  // Challenge Operations
  async createChallenge(challenge: Omit<Challenge, 'id'>): Promise<string> {
    const challengesRef = ref(this.db, 'challenges');
    const newChallengeRef = push(challengesRef);
    const challengeWithId = {
      ...challenge,
      id: newChallengeRef.key,
    };
    await set(newChallengeRef, challengeWithId);
    return newChallengeRef.key!;
  }

  async getChallenges(type?: Challenge['type']): Promise<Challenge[]> {
    const challengesRef = ref(this.db, 'challenges');
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
    const userChallengesRef = ref(this.db, `userChallenges/${userId}`);
    const snapshot = await get(userChallengesRef);
    const challenges: UserChallenge[] = [];
    snapshot.forEach((childSnapshot) => {
      challenges.push(childSnapshot.val());
    });
    return challenges;
  }

  async updateChallengeProgress(userId: string, challengeId: string, progress: number): Promise<void> {
    const userChallengeRef = ref(this.db, `userChallenges/${userId}/${challengeId}`);
    await update(userChallengeRef, { progress });
  }

  async completeChallenge(userId: string, challengeId: string): Promise<void> {
    const userChallengeRef = ref(this.db, `userChallenges/${userId}/${challengeId}`);
    await update(userChallengeRef, {
      status: 'completed',
      completedAt: Date.now(),
    });

    // Update user stats
    const userRef = ref(this.db, `users/${userId}`);
    await update(userRef, {
      'stats/challengesCompleted': increment(1),
      'stats/totalPoints': increment(challenge.points),
      lastLogin: Date.now(),
    });
  }

  // Achievement Operations
  async getAchievements(): Promise<Achievement[]> {
    const achievementsRef = ref(this.db, 'achievements');
    const snapshot = await get(achievementsRef);
    const achievements: Achievement[] = [];
    snapshot.forEach((childSnapshot) => {
      achievements.push(childSnapshot.val());
    });
    return achievements;
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const userAchievementsRef = ref(this.db, `userAchievements/${userId}`);
    const snapshot = await get(userAchievementsRef);
    const achievements: UserAchievement[] = [];
    snapshot.forEach((childSnapshot) => {
      achievements.push(childSnapshot.val());
    });
    return achievements;
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<void> {
    const userAchievementRef = ref(this.db, `userAchievements/${userId}/${achievementId}`);
    await set(userAchievementRef, {
      userId,
      achievementId,
      unlockedAt: Date.now(),
    });

    // Update user stats
    const userRef = ref(this.db, `users/${userId}`);
    await update(userRef, {
      'stats/totalPoints': increment(achievement.points),
    });
  }

  // Helper function for incrementing values
  private increment(value: number) {
    return increment(value);
  }
}

export const database = new DatabaseService(); 