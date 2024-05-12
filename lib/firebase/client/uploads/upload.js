import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage as firebaseStorage } from 'lib/firebase/client/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config.js';

// Function to handle the audio upload
export default async function handleUpload(file, user, onProgressUpdate) {
  try {
    const url = await audioUpload(file, user, onProgressUpdate);
    const uploadDetails = createUploadDetails(file, user, url);
    await storeUploadDetails(uploadDetails, user.uid);
    const newUploadDetails = await getUploadDetails(user.uid);
    return newUploadDetails;
  } catch (error) {
    console.error('Error in handleUpload: ', error);
    throw error;
  }
}

export async function audioUpload(file, user, onProgressUpdate) {
  if (!file) {
    throw new Error('file not added by client');
  }

  if (!file.type.startsWith('audio/')) {
    throw new Error('The file is not an audio file');
  }

  const storage = firebaseStorage;
  const storageRef = ref(storage, `${user.uid}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Pure computation of progress
        const progress = computeProgress(snapshot);
        onProgressUpdate(progress);
      },
      (error) => {
        console.error('Upload task error:', error); // Log the error
        reject(new Error('Failed to upload file')); //TODO: This error isn't very meangingful - consider changing it.
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (error) {
          reject(new Error('Failed to get download URL: ', error));
        }
      }
    );
  });
}

export function computeProgress(snapshot) {
  const uploadProgress =
    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  return {
    progress: `${uploadProgress}%`,
    message: 'Uploading audio file',
  };
}

// Prepares the detailed upload object
export function createUploadDetails(file, user, url) {
  return {
    name: `${user.firstName} ${user.surname}`,
    email: user.email,
    uid: user.uid,
    uploads: [
      {
        metaData: { fileType: file.type },
        name: file.name,
        uploadTime: new Date().toISOString(), //* Can't use serverTimestamp here
        url: url,
      },
    ],
  };
}

// Stores the upload details in Firestore
export async function storeUploadDetails(details, uid) {
  const docRef = doc(db, 'userUploads', uid);
  await setDoc(docRef, details, { merge: true });
}

export async function getUploadDetails(uid) {
  const docRef = doc(db, 'userUploads', uid);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data(); // Return the data of the document
    } else {
      console.error('No document found for UID:', uid);
      throw new Error('Document does not exist');
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error; // Propagate the error up to the caller
  }
}
