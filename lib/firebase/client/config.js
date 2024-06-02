// Import the functions you need from the SDKs you need
import 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
// import { getFunctions } from 'firebase/functions';

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

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

export { auth, db, storage };
