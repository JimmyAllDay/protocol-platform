import { doc, getDoc } from 'firebase/firestore';
import { db } from 'lib/firebase/client/config';

export default async function fetchUploads(user) {
  const userUid = user.uid;
  if (!userUid) {
    throw new Error('uid not present during fetch');
  }

  const docRef = doc(db, 'userUploads', userUid);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const uploads = data.uploads;
      return uploads;
    } else {
      console.log('No document found for UID:', userUid);
      return [];
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw new Error(
      `Failed to fetch uploads for UID ${userUid}: ${error.message}`
    );
  }
}
