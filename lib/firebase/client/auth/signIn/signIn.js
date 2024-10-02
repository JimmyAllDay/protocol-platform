import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'lib/firebase/client/config.js';
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
