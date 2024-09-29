import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config'; // Adjust the path to your Firebase config

// Function to count documents in the userProfiles collection, only for admins
export default async function countUserProfiles(user) {
  try {
    // Reference to the user's profile document
    const userProfileRef = doc(db, 'userProfiles', user.uid);
    const userProfileSnap = await getDoc(userProfileRef);

    // Check if the user's profile exists and if they are an admin
    if (!userProfileSnap.exists() || !userProfileSnap.data().isAdmin) {
      throw new Error('User is not an admin');
    }

    // If the user is an admin, proceed to count the documents in userProfiles
    const userProfilesRef = collection(db, 'userProfiles');
    const querySnapshot = await getDocs(userProfilesRef);

    // Return the number of documents
    const count = querySnapshot.size;
    console.log(`There are ${count} user profiles in the collection.`);
    return count;
  } catch (error) {
    console.error('Error getting userProfiles count: ', error);
    throw error; // Propagate the error if needed
  }
}
