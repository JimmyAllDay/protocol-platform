import { auth, db } from 'lib/firebase/client/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

//Registration step - returns object for storing user management information in Firestore Database
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
//Registration step - returns object for storing user 'actions' information in Firestore Database
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
      return true; //* Boolean consumed in the calling function
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
        throw error;
      }
    }
  };
  // Start the attempt cycle
  return await attemptSetDoc();
};
