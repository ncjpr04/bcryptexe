import { ref, set, get, update, remove, query, orderByChild, equalTo } from 'firebase/database';
import { getFirebaseDatabase } from './firebase';

export interface FirebaseUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  accessToken?: string; // Optional, consider if you want to store this
  googleFitToken?: string | null; // Add Google Fit token
  lastLogin: number;
  createdAt: number;
  updatedAt: number;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
  stats?: {
    workoutsCompleted?: number;
    challengesCompleted?: number;
    achievementsUnlocked?: number;
    totalPoints?: number;
  };
  // Other user-related fields as needed
}

class UserService {
  // Get database instance safely (client-side only)
  private getDatabase() {
    // This will throw an error if called on the server
    return getFirebaseDatabase();
  }

  /**
   * Create or update a user in the Firebase Realtime Database
   */
  async saveUser(userData: Partial<FirebaseUser> & { id: string }): Promise<void> {
    try {
      const now = Date.now();
      const db = this.getDatabase();
      const userRef = ref(db, `users/${userData.id}`);
      
      // Check if user exists
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        // Update existing user
        await update(userRef, {
          ...userData,
          lastLogin: now,
          updatedAt: now
        });
        console.log(`User ${userData.id} updated in Firebase`);
      } else {
        // Create new user
        await set(userRef, {
          ...userData,
          createdAt: now,
          lastLogin: now,
          updatedAt: now,
          stats: {
            workoutsCompleted: 0,
            challengesCompleted: 0,
            achievementsUnlocked: 0,
            totalPoints: 0
          }
        });
        console.log(`User ${userData.id} created in Firebase`);
      }
    } catch (error) {
      console.error('Error saving user to Firebase:', error);
      throw error;
    }
  }

  /**
   * Get a user by ID
   */
  async getUserById(userId: string): Promise<FirebaseUser | null> {
    try {
      const db = this.getDatabase();
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        return snapshot.val() as FirebaseUser;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user from Firebase:', error);
      throw error;
    }
  }

  /**
   * Get a user by email
   */
  async getUserByEmail(email: string): Promise<FirebaseUser | null> {
    try {
      const db = this.getDatabase();
      const usersRef = ref(db, 'users');
      const userQuery = query(usersRef, orderByChild('email'), equalTo(email));
      const snapshot = await get(userQuery);
      
      if (snapshot.exists()) {
        // Since we're querying by email which should be unique,
        // we expect only one result
        let user: FirebaseUser | null = null;
        
        snapshot.forEach((childSnapshot) => {
          user = childSnapshot.val() as FirebaseUser;
          // Break after first match
          return true;
        });
        
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user by email from Firebase:', error);
      throw error;
    }
  }

  /**
   * Update user information
   */
  async updateUser(userId: string, userData: Partial<FirebaseUser>): Promise<void> {
    try {
      const now = Date.now();
      const db = this.getDatabase();
      const userRef = ref(db, `users/${userId}`);
      
      await update(userRef, {
        ...userData,
        updatedAt: now
      });
      
      console.log(`User ${userId} updated in Firebase`);
    } catch (error) {
      console.error('Error updating user in Firebase:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(userId: string, preferences: FirebaseUser['preferences']): Promise<void> {
    try {
      const db = this.getDatabase();
      const userRef = ref(db, `users/${userId}/preferences`);
      await update(userRef, preferences);
      
      // Also update the updatedAt timestamp
      const userRootRef = ref(db, `users/${userId}`);
      await update(userRootRef, {
        updatedAt: Date.now()
      });
      
      console.log(`Preferences for user ${userId} updated in Firebase`);
    } catch (error) {
      console.error('Error updating user preferences in Firebase:', error);
      throw error;
    }
  }

  /**
   * Update user stats
   */
  async updateUserStats(userId: string, stats: Partial<FirebaseUser['stats']>): Promise<void> {
    try {
      const db = this.getDatabase();
      const userRef = ref(db, `users/${userId}/stats`);
      await update(userRef, stats);
      
      // Also update the updatedAt timestamp
      const userRootRef = ref(db, `users/${userId}`);
      await update(userRootRef, {
        updatedAt: Date.now()
      });
      
      console.log(`Stats for user ${userId} updated in Firebase`);
    } catch (error) {
      console.error('Error updating user stats in Firebase:', error);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      const db = this.getDatabase();
      const userRef = ref(db, `users/${userId}`);
      await remove(userRef);
      
      console.log(`User ${userId} deleted from Firebase`);
    } catch (error) {
      console.error('Error deleting user from Firebase:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 