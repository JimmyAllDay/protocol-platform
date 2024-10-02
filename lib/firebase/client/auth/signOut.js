import { auth } from '../config.js';
import { signOut } from 'firebase/auth';
import { destroyCookie } from 'nookies';

//Signs user out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    destroyCookie(null, 'p_sessionId', { path: '/' });
  }
};
