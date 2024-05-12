import { db } from './config';
import { collection, addDoc } from 'firebase/firestore';

export const addToMailList = async (email) => {
  //TODO: there is currently no security on this function other than client side validation - you should update it when you get a chance.
  try {
    const docRef = await addDoc(collection(db, 'mailingList'), {
      email: email,
    });
    console.log(docRef);
    return true;
  } catch (error) {
    console.error('error adding document to mail list:', error);
    throw error;
  }
};
