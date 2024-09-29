import admin from 'lib/firebase/server/config';

// Function to fetch user profile data from Firestore
export default async function getSingleDoc(collection, uid) {
  try {
    const docRef = await admin
      .firestore()
      .collection(collection)
      .doc(uid)
      .get();

    if (!docRef.exists) {
      throw new Error('Document not found');
    }

    const { createdAt, updatedAt, ...docData } = docRef.data();

    // Return the document data without createdAt and updatedAt
    return {
      id: docRef.id,
      ...docData,
    };
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
}
