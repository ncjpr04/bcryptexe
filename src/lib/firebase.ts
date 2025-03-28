import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

// Ensure we're on the client side
if (typeof window === 'undefined') {
  throw new Error('Firebase must be initialized on the client side');
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Log configuration status (without sensitive values)
console.log('Firebase Configuration Status:', {
  apiKey: firebaseConfig.apiKey ? 'Present' : 'Missing',
  authDomain: firebaseConfig.authDomain ? 'Present' : 'Missing',
  projectId: firebaseConfig.projectId ? 'Present' : 'Missing',
  storageBucket: firebaseConfig.storageBucket ? 'Present' : 'Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'Present' : 'Missing',
  appId: firebaseConfig.appId ? 'Present' : 'Missing',
  databaseURL: firebaseConfig.databaseURL ? 'Present' : 'Missing'
});

// Validate configuration
if (typeof window !== 'undefined') {
  const missingFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId', 'databaseURL']
    .filter(field => !firebaseConfig[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  }
}

let app;
let auth;
let firestore;
let realtimeDb;
let analytics;

if (typeof window !== 'undefined') {
  try {
    // Initialize Firebase
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    
    // Initialize Auth
    auth = getAuth(app);
    
    // Initialize Firestore
    firestore = getFirestore(app);
    
    // Initialize Realtime Database
    realtimeDb = getDatabase(app);
    
    // Initialize Analytics only in production
    if (process.env.NODE_ENV === 'production') {
      try {
        analytics = getAnalytics(app);
        console.log('Firebase Analytics initialized');
      } catch (error) {
        console.warn('Firebase Analytics initialization skipped:', error);
      }
    }
    
    console.log('Firebase initialized successfully on client side');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { app, auth, firestore, realtimeDb, analytics }; 