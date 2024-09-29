import { db } from 'lib/firebase/client/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
//Registration step - returns object for storing additional user profile information in Firestore Database
export const createProfileObject = (
  email,
  authUid,
  displayName = '',
  facebookName = '',
  firstName = '',
  instagramHandle = '',
  surname = ''
) => {
  return {
    createdAt: serverTimestamp(),
    email: email,
    facebookName: facebookName,
    firstName: firstName,
    instagramHandle: instagramHandle,
    isCheckedFacebook: false,
    isCheckedInstagram: false,
    isCheckedPromo: false,
    mixData: [],
    phone: '',
    stageName: '',
    surname: surname,
    updatedAt: [],
    displayName: displayName,
    uid: authUid,
    profileComplete: false,
  };
};

//Registration step - creates user profile object in Firestore Database
export const createUserProfileDoc = async (
  email,
  authUid,
  onProgressUpdate,
  baseDelay = 1000,
  displayName = '',
  facebookName = '',
  firstName = '',
  instagramHandle = '',
  surname = ''
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
        createProfileObject(
          email,
          authUid,
          displayName,
          facebookName,
          firstName,
          instagramHandle,
          surname
        )
      );
      return true; //* Boolean consumed in calling function
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
        throw error;
      }
    }
  };
  // Start the attempt cycle
  return await attemptSetDoc();
};
