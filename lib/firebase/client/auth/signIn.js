import { auth, db } from '../config.js';
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import checkVerificationEmail from './checkVerificationEmail.js';
import { doc, getDoc } from 'firebase/firestore';

// ---- SIGN IN -----
// User sign in occurs in two stages
// Step 1 involves signing the user into the Firebase auth platform
// Step 2 involves retrieving the userProfile object from Firestore
// In cases where the user has not verified their email during registration, the checkVerification function is called and an email will be automatically re-sent to their address on sign in. This feature is rate limited to avoid abuse.

export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'userProfiles', uid);
    const docSnap = await getDoc(docRef);
    const userProfile = docSnap.data();
    return userProfile;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    throw error;
  }
};
export const manageSignIn = async (email, password, onProgressUpdate) => {
  onProgressUpdate({
    progress: '0%',
    message: 'Starting login...',
  });
  try {
    const user = await signIn(email, password); // Step 1: Sign in the user

    if (user && user.emailVerified) {
      // If the user is signed in and their email is verified
      const userProfile = await getUserProfile(user.uid); // Step 2: Retrieve the user profile
      if (userProfile) {
        onProgressUpdate({
          progress: '100%',
          message: 'Welcome to the lower level.', // Inform the UI that the login process is complete
        });
      }
    } else if (user && !user.emailVerified) {
      // If the user is signed in but their email is not verified
      onProgressUpdate({
        progress: '50%',
        message: 'Checking user verification...',
      });

      try {
        const shouldSendVerification = await checkVerificationEmail(user); // Check if a verification email should be sent
        const send = shouldSendVerification.send;
        const count = shouldSendVerification.count;
        if (send) {
          await sendEmailVerification(user); // Send a verification email
          await signOut(auth); // Sign the user out
          throw new Error(
            `Email account not verified. A verification email has been sent. Please verify your account and try again. Remaining attempts: ${
              3 - count
            }`
          );
        } else {
          await signOut(auth); // Sign the user out
          throw new Error(
            'Email account not verified. Maximum attempts reached. Please wait 24 hours and try again.'
          );
        }
      } catch (error) {
        throw error; // Handle any errors during the verification process
      }
    }
  } catch (error) {
    onProgressUpdate({
      progress: '0%',
      message: 'Login failed. Please try again.', // Inform the UI that the login process has failed
    });
    throw error; // Rethrow the error to be handled by the calling code
  }
};
