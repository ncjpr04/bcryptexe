'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { database } from '@/lib/database';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setUser(user);
      setIsLoading(false);

      if (user) {
        try {
          // Set auth cookie when user is authenticated
          const idToken = await user.getIdToken();
          document.cookie = `auth=${idToken}; path=/; max-age=3600; secure; samesite=strict`;
          console.log('Auth cookie set');

          // Check if user profile exists, if not create one
          const userProfile = await database.getUserProfile(user.uid);
          if (!userProfile) {
            console.log('Creating new user profile');
            await database.createUserProfile(
              user.uid,
              user.email!,
              user.displayName || undefined,
              user.photoURL || undefined
            );
          } else {
            console.log('Updating last login for existing user');
            // Update last login
            await database.updateUserProfile(user.uid, {
              lastLogin: Date.now(),
            });
          }
        } catch (error) {
          console.error('Error handling authenticated user:', error);
        }
      } else {
        // Remove auth cookie when user is not authenticated
        document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        console.log('Auth cookie removed');
      }
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log('Attempting email sign in');
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      console.log('Attempting email sign up');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await database.createUserProfile(userCredential.user.uid, email);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign in');
      
      // Check if auth is initialized
      if (!auth) {
        throw new Error('Firebase Auth is not initialized');
      }

      const provider = new GoogleAuthProvider();
      
      // Configure the Google provider
      provider.setCustomParameters({
        prompt: 'select_account',
        login_hint: 'user@example.com' // Optional: pre-fill email
      });

      // Add scopes
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

      console.log('Google provider configured, attempting sign in popup');
      const result = await signInWithPopup(auth, provider);
      console.log('Google sign in successful:', result.user.email);
      
      // Get the user profile
      const userProfile = await database.getUserProfile(result.user.uid);
      if (!userProfile) {
        console.log('Creating new user profile for Google user');
        await database.createUserProfile(
          result.user.uid,
          result.user.email!,
          result.user.displayName || undefined,
          result.user.photoURL || undefined
        );
      }
      
      console.log('Redirecting to dashboard');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in was cancelled.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Sign in popup was blocked. Please allow popups for this site.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign in was cancelled.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Invalid credentials. Please try again.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Google sign in is not enabled. Please contact support.';
          break;
        default:
          errorMessage = `Authentication error: ${error.message}`;
      }
      
      toast.error('Google Sign In Failed', {
        description: errorMessage,
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      await firebaseSignOut(auth);
      router.push('/');
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 