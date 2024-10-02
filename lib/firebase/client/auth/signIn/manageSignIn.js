import { auth } from 'lib/firebase/client/config.js';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getUserProfile } from 'lib/firebase/client/auth/signIn/getUserProfile';
import { checkVerificationEmail } from 'lib/firebase/client/auth/signIn/checkVerificationEmail';
import { signIn } from 'lib/firebase/client/auth/signIn/signIn';

// ---- SIGN IN -----
// User sign in occurs in two stages
// Step 1 - sign the user in using Firebase
// Step 2 involves retrieving the userProfile object from Firestore
// In cases where the user has not verified their email during registration, the checkVerification function is called and an email will be automatically re-sent to their address on sign in. This feature is rate limited to avoid abuse. <-//TODO: Check firebase built in rate limiting

//TODO: Do you need to retrieve the user's profile here if this is being handled in the useFirebaseAuth component?

export const manageSignIn = async (email, password, onProgressUpdate) => {
  onProgressUpdate({
    progress: '0%',
    message: 'Starting login...',
  });
  try {
    //* Step 1: Sign in the user
    const user = await signIn(email, password);

    // If the user is signed in and their email is verified
    if (user && user.emailVerified) {
      //* Step 2: Retrieve the user profile
      const userProfile = await getUserProfile(user.uid);
      if (userProfile) {
        onProgressUpdate({
          progress: '100%',
          message: 'Welcome to the lower level.', // Inform the UI that the login process is complete
        });
      }
      //* If the user is signed in but their email is not verified
    } else if (user && !user.emailVerified) {
      onProgressUpdate({
        progress: '50%',
        message: 'Checking user verification...',
      });
      try {
        //TODO: You may need to refactor this - this solution is probably a bit wonky
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
        throw error; //Propagate error up
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
