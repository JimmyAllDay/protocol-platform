import { auth } from '../config.js';
import { signOut } from 'firebase/auth';

//Signs user out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
