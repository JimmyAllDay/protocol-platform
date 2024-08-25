import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage as firebaseStorage } from 'lib/firebase/client/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config.js';
import deleteAllUserFiles from 'lib/firebase/client/uploads/delete.js';

// Function to handle the audio upload
export default async function handleUpload(
  mixName,
  file,
  user,
  onProgressUpdate
) {
  try {
    validateUploadInputs(mixName, file, user);
    await deleteAllUserFiles(user.uid);
    const url = await audioUpload(file, user, onProgressUpdate);
    const uploadDetails = createUploadDetails(mixName, file, user, url);
    await storeUploadDetails(uploadDetails, user.uid);
    const newUploadDetails = await getUploadDetails(user.uid);
    return newUploadDetails;
  } catch (error) {
    console.error('Error during upload: ', error); // Keep the error message generic
    throw new Error(error);
  }
}

export async function audioUpload(file, user, onProgressUpdate) {
  const storage = firebaseStorage;
  const storageRef = ref(storage, `${user.uid}/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = computeProgress(snapshot);
        onProgressUpdate(progress);
      },
      (error) => {
        console.error('Upload task failed.'); // Log a generic message
        reject(new Error('Failed to upload the file. Please try again later.')); // Generic error message
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (error) {
          console.error('Error fetching download URL.');
          reject(
            new Error(
              'Failed to retrieve the file URL. Please try again later.'
            )
          );
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

export function createUploadDetails(mixName, file, user, url) {
  return {
    name: `${user.firstName} ${user.surname}`,
    email: user.email,
    uid: user.uid,
    uploads: [
      {
        metaData: { fileType: file.type },
        mixName: mixName,
        fileName: file.name,
        uploadTime: new Date().toISOString(),
        url: url,
      },
    ],
  };
}

// Stores the upload details in Firestore
export async function storeUploadDetails(details, uid) {
  const docRef = doc(db, 'userUploads', uid);
  try {
    await setDoc(docRef, details, { merge: true });
  } catch (error) {
    console.error('Failed to store upload details.');
    throw new Error('Unable to save upload details. Please try again later.');
  }
}

// Retrieves the upload details from Firestore
export async function getUploadDetails(uid) {
  const docRef = doc(db, 'userUploads', uid);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error('No document found for UID.');
      throw new Error('No upload record found.');
    }
  } catch (error) {
    console.error('Error fetching document.');
    throw new Error(
      'Unable to retrieve upload details. Please try again later.'
    );
  }
}

function validateUploadInputs(mixName, file, user) {
  if (!file || !file.type.startsWith('audio/')) {
    throw new Error('An audio file is required.');
  }
  if (file.size > 200 * 1024 * 1024) {
    throw new Error('File size must be under 200MB.');
  }
  if (typeof mixName !== 'string' || !mixName.trim()) {
    throw new Error('Mix name is required and cannot be empty.');
  }
  if (mixName.length > 40) {
    throw new Error('Mix name cannot exceed 40 characters.');
  }
  if (!user || !user.uid) {
    throw new Error('Invalid user or user UID.');
  }
}
