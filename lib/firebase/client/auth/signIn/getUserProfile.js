import { db } from 'lib/firebase/client/config.js';
import { doc, getDoc } from 'firebase/firestore';

export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'userProfiles', uid);
    const docSnap = await getDoc(docRef);
    const userProfile = docSnap.data();
    return userProfile;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
