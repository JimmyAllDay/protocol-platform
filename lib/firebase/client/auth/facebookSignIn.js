import { auth, db } from '../config';
import { signInWithPopup, FacebookAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getUserProfile } from './signIn';
import { createUserManagementDoc, createUserProfileDoc } from './register';
import getFirstName, { getSurname } from 'utils/getNames';

const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);

    const user = result.user;
    const providerData = user.providerData[0];

    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    return { user, providerData, accessToken };
  } catch (error) {
    console.error('Error during Facebook sign-in:', error);
    if (error.code === 'auth/cancelled-popup-request') {
      console.error('Multiple sign-in attempts detected. Please try again.');
    }
    throw error;
  }
};

const checkAndCreateDoc = async (docRef, createDocFunc, ...args) => {
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    await createDocFunc(...args);
    return await getDoc(docRef);
  }
  return docSnap;
};

export default async function signInWithFacebookHandler(onProgressUpdate) {
  try {
    // Attempt to sign in with Facebook and extract user details, provider data, and access token.
    const { user, providerData, accessToken } = await signInWithFacebook();

    // Extracting necessary information from the user object and provider data.
    const uid = user.uid;
    const email = providerData.email;
    const displayName = providerData.displayName;
    const facebookName = displayName;
    const firstName = getFirstName(displayName); // Function to extract first name from the display name.
    const surname = getSurname(displayName); // Function to extract surname from the display name.
    const baseDelay = 1000; // Base delay for some operations, can be used for timeouts or retries.

    // Update progress to 50% and notify about checking for existing user profile.
    onProgressUpdate({
      progress: '50%',
      message: 'Checking for existing user profile...',
    });

    // Reference to the user's profile document in the database.
    const profileDocRef = doc(db, 'userProfiles', uid);

    // Check if the profile document exists, if not, create it.
    const profileDocSnap = await checkAndCreateDoc(
      profileDocRef,
      createUserProfileDoc,
      email,
      uid,
      onProgressUpdate,
      baseDelay,
      displayName,
      facebookName,
      firstName,
      '',
      surname
    );

    // If the profile document exists or has been created, update progress to 70%.
    if (profileDocSnap.exists()) {
      onProgressUpdate({
        progress: '70%',
        message: 'User profile exists or has been created.',
      });
    }

    // Reference to the user's management document in the database.
    const userManagementDocRef = doc(db, 'userManagement', uid);

    // Check if the management document exists, if not, create it.
    const userManagementDocSnap = await checkAndCreateDoc(
      userManagementDocRef,
      createUserManagementDoc,
      email,
      uid,
      onProgressUpdate
    );

    // If the management document exists or has been created, update progress to 90%.
    if (userManagementDocSnap.exists()) {
      onProgressUpdate({
        progress: '90%',
        message: 'User management document exists or has been created.',
      });
    }

    // Retrieve the user profile using the user ID.
    const userProfile = await getUserProfile(uid);

    // If the user profile is found, update progress to 100% and welcome the user.
    if (userProfile) {
      onProgressUpdate({
        progress: '100%',
        message: 'Welcome to the lower level.',
      });
      return userProfile; // Return the user profile.
    } else {
      // If the user profile is not found, sign out the user and reset progress.
      await signOut(auth);
      onProgressUpdate({
        progress: '0%',
        message: 'User profile not found. Signing out.',
      });
      return null; // Return null if the user profile is not found.
    }
  } catch (error) {
    // Catch and log any errors during the process.
    console.error('Error during Facebook sign-in:', error);
    // Update progress to 0% and notify about the failure.
    onProgressUpdate({
      progress: '0%',
      message: 'Facebook sign-in failed. Please try again.',
    });
    // Re-throw the error to be handled by the caller if necessary.
    throw error;
  }
}
