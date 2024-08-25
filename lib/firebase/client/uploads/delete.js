import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, listAll, deleteObject } from 'firebase/storage';
import { db } from 'lib/firebase/client/config.js';

//*These functions have been set up to delete all the user data pertaining to all files in Firebase storage and the collection userUploads.
//*If refactoring as part of future development, deleting specific files and data may be required.

export default async function deleteUploads(uid) {
  try {
    // Step 1: Delete files from Firebase Storage
    await deleteAllUserFiles(uid);

    // Step 2: Update the Firestore document
    return await deleteUploadedFileData(uid);
  } catch (error) {
    console.error('Error deleting files or updating Firestore:', error);
    throw new Error(error);
  }
}

export async function deleteUploadedFileData(uid) {
  const docRef = doc(db, 'userUploads', uid);

  try {
    // First, retrieve the current document
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();

      // Set the userData.uploads array to an empty array
      userData.uploads = [];

      // Update the document with the new uploads array
      await updateDoc(docRef, {
        uploads: userData.uploads,
      });
      console.log(`Data deleted`);
      return userData.uploads;
    } else {
      console.log('No document found for UID:', uid);
    }
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error(error);
  }
}

export const deleteAllUserFiles = async (uid) => {
  const storage = getStorage();
  const folderRef = ref(storage, `${uid}/`);

  try {
    const fileList = await listAll(folderRef);
    const deletePromises = fileList.items.map((fileRef) =>
      deleteObject(fileRef)
    );
    await Promise.all(deletePromises);

    console.log(`File deleted`);
  } catch (error) {
    console.error('Error deleting user files:', error);
    throw new Error(error);
  }
};
