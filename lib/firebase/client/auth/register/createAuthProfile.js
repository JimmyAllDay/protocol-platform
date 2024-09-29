import { auth } from 'lib/firebase/client/config';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';

//* Registration step - Create auth profile and send verification email
//? Sending email here safeguards against incomplete functions later in auth flow
export const createAuthProfile = async (email, password) => {
  try {
    const authUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = authUser.user;
    if (user) {
      await sendEmailVerification(user);
    }
    return user;
  } catch (error) {
    console.error('Error creating auth profile:', error);
    throw error;
  }
};
