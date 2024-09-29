import { auth, db } from 'lib/firebase/client/config';
import { signOut } from 'firebase/auth';

import { createUserManagementDoc } from 'lib/firebase/client/auth/register/createUserManagementDoc.js';
import { createUserProfileDoc } from 'lib/firebase/client/auth/register/createUserProfileDoc.js';
import { createAuthProfile } from 'lib/firebase/client/auth/register/createAuthProfile.js';

//* ---- REGISTRATION -----

//*Registration steps
//*Step 1 create a firebase auth profile
//*Step 2 create a user profile object in the firestore database
//*Step 3 create a user 'management' object in the firestore database to handle administrative actions, such as rate limiting emails

//TODO: There's not enough redundancy here if any of these functions fail. This means some docs may be created and not others if one or multiple functions fail.

// Handles registration functions and related logic
export const register = async (email, password, onProgressUpdate) => {
  try {
    onProgressUpdate({
      progress: '0%',
      message: 'Starting user registration...',
    });

    //* Step 1 create a firebase auth profile
    const user = await createAuthProfile(email, password);
    const uid = user.uid;

    onProgressUpdate({
      progress: '33%',
      message: 'User account created. Setting up profile...',
    });
    //* Step 2 create a user profile object in the firestore database
    const managementDoc = await createUserManagementDoc(
      email,
      uid,
      onProgressUpdate
    );

    onProgressUpdate({
      progress: '66%',
      message: 'New user management doc created.',
    });

    //* Step 3 create a user profile object in the firestore database
    const profile = await createUserProfileDoc(email, uid, onProgressUpdate);

    onProgressUpdate({
      progress: '77%',
      message: 'User profile setup. Finalising registration...',
    });

    onProgressUpdate({
      progress: '100%',
      message: 'Registration complete. Please verify your email.',
    });

    await signOut(auth);

    return true; //* Boolean consumed in the calling function
  } catch (error) {
    onProgressUpdate({
      progress: '0%',
      message: 'Registration failed.',
    });
    throw error;
  }
};
