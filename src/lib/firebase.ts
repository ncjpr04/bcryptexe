import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

// Define types for our exports
let app: FirebaseApp | undefined;
let database: Database | undefined;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

// Initialize Firebase only on the client side
function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Return empty objects when in server environment
    return { app: undefined, database: undefined };
  }

  try {
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
    
    // Validate database URL
    if (!firebaseConfig.databaseURL) {
      console.error('Missing required Firebase Realtime Database URL');
      return { app: undefined, database: undefined };
    }
    
    // Initialize Firebase only once
    if (!app) {
      app = initializeApp(firebaseConfig);
      database = getDatabase(app);
      console.log('Firebase Realtime Database initialized with URL:', process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL);
    }
    
    return { app, database };
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return { app: undefined, database: undefined };
  }
}

// Initialize Firebase if we're on the client side
if (typeof window !== 'undefined') {
  const { app: initializedApp, database: initializedDatabase } = initializeFirebase();
  app = initializedApp;
  database = initializedDatabase;
}

export { app, database };

// Helper function to get database instance when needed (client-side only)
export function getFirebaseDatabase() {
  if (typeof window === 'undefined') {
    throw new Error('getFirebaseDatabase can only be called on the client side');
  }
  
  if (!database) {
    const { database: initializedDatabase } = initializeFirebase();
    database = initializedDatabase;
  }
  
  return database;
} 