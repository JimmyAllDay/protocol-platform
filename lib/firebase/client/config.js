// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// import { getAnalytics } from "firebase/analytics";
// import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'mock_key',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// const functions = getFunctions(app);
// const analytics = getAnalytics(app);

// Configure emulators in test environment
if (process.env.NODE_ENV === 'test') {
  // Auth emulator
  auth.useEmulator('http://localhost:9099');

  // Firestore emulator
  db.settings({
    host: 'localhost:8080',
    ssl: false,
  });

  // Storage emulator
  storage.useEmulator('localhost', 9199);
}

// No need to export 'firebase' as it's not used anymore
export { auth, db, storage };
