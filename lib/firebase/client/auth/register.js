import { auth, db } from '../config.js';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  getFirestore,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';

// ---- REGISTRATION -----

//Registration comprises several steps
//Step 1 create a firebase auth profile
//Step 2 create a user profile object in the firestore database
//Step 3 create a user 'management' object in the firestore database to handle administrative actions, such as rate limiting emails

//Registration step - returns object for storing user 'actions' information in Firestore Database
export const createUserManagementObject = (email, authUid) => {
  return {
    createdAt: serverTimestamp(),
    email: email,
    verificationEmailSendLimit: { count: 0, lastSendTimestamp: 0 },
    userProfileUpdates: {
      count: 0,
      lastUpdateTimestamp: 0,
      complete: false,
    },
    uid: authUid,
  };
};

export const createUserManagementDoc = async (
  email,
  authUid,
  onProgressUpdate,
  baseDelay = 1000
) => {
  const maxAttempts = 5; // Maximum number of attempts
  let attempt = 0; // Current attempt counter

  // Function to wait for a given number of milliseconds
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Function to calculate delay with exponential backoff and jitter
  const getDelay = (attempt, baseDelay) => {
    const exponentialDelay = baseDelay * 2 ** attempt;
    const jitter = Math.random() * baseDelay;
    return exponentialDelay + jitter;
  };

  // Recursive function to attempt the setDoc operation
  const attemptSetDoc = async () => {
    try {
      await setDoc(
        doc(db, `userManagement`, authUid),
        createUserManagementObject(email, authUid)
      );
      return true; //? This returns true and not the document object because the metrics document is not needed elsewhere at this stage of registration. 'True' is used for assessing the success of this operation.
    } catch (error) {
      onProgressUpdate({
        progress: '60%',
        message: 'Problem setting up profile. Retrying...',
      });
      console.error('Error in setDoc:', error);
      attempt++;
      if (attempt < maxAttempts) {
        console.log(`Attempt ${attempt} failed. Retrying...`);
        const delay = getDelay(attempt, baseDelay);
        console.log(`Waiting for ${delay}ms before retry.`);
        await wait(delay);
        return await attemptSetDoc(); // Recursively try again
      } else {
        console.error('Max attempts reached. Failing with error:');
        onProgressUpdate({
          progress: '60%',
          message: 'User profile creation stalled due to a database error.',
        });
        throw new Error('Unable to create user profile.');
      }
    }
  };
  // Start the attempt cycle
  return await attemptSetDoc();
};

//Registration step - returns object for storing additional user profile information in Firestore Database
export const createProfileObject = (email, authUid) => {
  return {
    createdAt: serverTimestamp(),
    email: email,
    facebookName: '',
    firstname: '',
    instagramHandle: '',
    isCheckedFacebook: false,
    isCheckedInstagram: false,
    isCheckedPromo: false,
    mixData: [],
    phone: '',
    stageName: '',
    surname: '',
    updatedAt: [],
    displayName: '',
    uid: authUid,
  };
};

//Registration step - creates user profile object in Firestore Database
export const createUserProfileDoc = async (
  email,
  authUid,
  onProgressUpdate,
  baseDelay = 1000
) => {
  const maxAttempts = 5; // Maximum number of attempts
  let attempt = 0; // Current attempt counter

  // Function to wait for a given number of milliseconds
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Function to calculate delay with exponential backoff and jitter
  const getDelay = (attempt, baseDelay) => {
    const exponentialDelay = baseDelay * 2 ** attempt;
    const jitter = Math.random() * baseDelay;
    return exponentialDelay + jitter;
  };

  // Recursive function to attempt the setDoc operation
  const attemptSetDoc = async () => {
    try {
      await setDoc(
        doc(db, `userProfiles`, authUid),
        createProfileObject(email, authUid)
      );
      return true; //? This returns true because the user profile is not wanted at this stage of registration
    } catch (error) {
      onProgressUpdate({
        progress: '50%',
        message: 'Problem setting up profile. Retrying...',
      });
      console.error('Error in setDoc:', error);
      attempt++;
      if (attempt < maxAttempts) {
        console.log(`Attempt ${attempt} failed. Retrying...`);
        const delay = getDelay(attempt, baseDelay);
        console.log(`Waiting for ${delay}ms before retry.`);
        await wait(delay);
        return await attemptSetDoc(); // Recursively try again
      } else {
        console.error('Max attempts reached. Failing with error:');
        onProgressUpdate({
          progress: '50%',
          message: 'User profile creation stalled due to a database error.',
        });
        throw new Error('Unable to create user profile.');
      }
    }
  };
  // Start the attempt cycle
  return await attemptSetDoc();
};

//Registration step - Creates auth profile
export const createAuthProfile = async (email, password) => {
  try {
    const authUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = authUser.user;
    return user;
  } catch (error) {
    console.error('Error creating auth profile:', error);
    throw new Error(`Could not create auth profile: ${error.message}`);
  }
};

// Calls createAuthProfile, createUserProfileDoc and createUserManagementDoc functions and related logic
export const register = async (email, password, onProgressUpdate) => {
  try {
    onProgressUpdate({
      progress: '0%',
      message: 'Starting user registration...',
    });

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    if (!user) {
      onProgressUpdate({
        progress: '0%',
        message: 'Registration failed.',
      });
      throw new Error('Registration failed');
    }

    onProgressUpdate({
      progress: '33%',
      message: 'User account created. Setting up profile...',
    });

    const profileDocRef = doc(db, 'userProfiles', user.uid);
    const profileDocSnap = await getDoc(profileDocRef);

    let profileDoc;
    if (profileDocSnap && profileDocSnap.exists()) {
      profileDoc = profileDocSnap.data();
      onProgressUpdate({
        progress: '44%',
        message: 'Existing profile found. Merging data...',
      });
      // Merge logic can go here if needed
    } else {
      await setDoc(profileDocRef, {
        email,
        uid: user.uid,
        createdAt: new Date(),
        // Add other profile fields as necessary
      });
      profileDoc = {
        email,
        uid: user.uid,
      };
      onProgressUpdate({
        progress: '44%',
        message: 'New profile created.',
      });
    }

    onProgressUpdate({
      progress: '55%',
      message: 'Almost there...',
    });

    const userManagementDocRef = doc(db, 'userManagement', user.uid);
    const userManagementDocSnap = await getDoc(userManagementDocRef);

    let userManagementDoc;
    if (userManagementDocSnap && userManagementDocSnap.exists()) {
      userManagementDoc = userManagementDocSnap.data();
      onProgressUpdate({
        progress: '66%',
        message: 'Existing user management doc found. Merging data...',
      });
      // Merge logic can go here if needed
    } else {
      await setDoc(userManagementDocRef, {
        email,
        uid: user.uid,
        createdAt: new Date(),
        // Add other user management fields as necessary
      });
      userManagementDoc = {
        email,
        uid: user.uid,
      };
      onProgressUpdate({
        progress: '66%',
        message: 'New user management doc created.',
      });
    }

    onProgressUpdate({
      progress: '77%',
      message: 'User profile fully setup. Finalizing registration...',
    });

    await sendEmailVerification(user);
    onProgressUpdate({
      progress: '100%',
      message: 'Registration complete. Please verify your email.',
    });

    await signOut(auth);

    return true; // Return true because you want the user to verify their account via email
  } catch (error) {
    onProgressUpdate({
      progress: '0%',
      message: 'Registration failed. Please try again.',
    });
    throw error;
  }
};
