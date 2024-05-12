import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'lib/firebase/client/config.js';

export default async function deleteUpload(uid, url) {
  const docRef = doc(db, 'userUploads', uid);

  try {
    // First, retrieve the current document
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();

      // Filter out the upload with the matching URL
      const updatedUploads = userData.uploads.filter(
        (upload) => upload.url !== url
      );

      // Update the document with the new uploads array
      await updateDoc(docRef, {
        uploads: updatedUploads,
      });
      console.log('Upload successfully deleted');
      return updatedUploads;
    } else {
      console.log('No document found for UID:', userUid);
    }
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error(error);
  }
}
