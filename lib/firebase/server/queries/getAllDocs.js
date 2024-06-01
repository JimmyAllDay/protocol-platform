import admin from 'lib/firebase/server/config';

async function getAllDocs(collectionName) {
  try {
    const snapshot = await admin.firestore().collection(collectionName).get();
    // Extract and store all documents in a variable
    const docsArray = snapshot.docs.map((doc) => {
      const data = doc.data();
      const serializedData = {};

      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (value instanceof admin.firestore.Timestamp) {
          serializedData[key] = value.toDate().toISOString();
        } else {
          serializedData[key] = value;
        }
      });

      return {
        id: doc.id,
        ...serializedData,
      };
    });
    return docsArray;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName}: `, error);
    throw new Error(
      `Unable to fetch collection ${collectionName}: ${error.message}`
    );
  }
}

export { getAllDocs };
