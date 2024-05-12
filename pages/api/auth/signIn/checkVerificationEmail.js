import { db, auth } from 'lib/firebase/server/config';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ error: 'Unauthorized. No token provided.' });
  }

  let userId;
  try {
    const decodedToken = await auth.verifyIdToken(token);
    userId = decodedToken.uid;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return res
      .status(401)
      .send({ error: 'Unauthorized. Failed to verify token.' });
  }

  try {
    const userRef = db.collection('userManagement').doc(userId);

    const result = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(userRef);
      let count = 0;
      let lastEmailTimestamp;
      const currentTime = new Date();

      if (doc.exists) {
        const userData = doc.data();
        count = userData.count || 0;
        lastEmailTimestamp = userData.lastEmailTimestamp
          ? userData.lastEmailTimestamp.toDate()
          : null;

        // Check if last email was sent more than 24 hours ago
        if (
          lastEmailTimestamp &&
          currentTime - lastEmailTimestamp < 86400000 &&
          count < 3
        ) {
          count += 1; // Increment count if within 24 hours and under limit
        } else {
          count = 1; // Reset count if over 24 hours or not set
          lastEmailTimestamp = currentTime;
        }
      } else {
        // If no record exists, start count and set the timestamp
        count = 1;
        lastEmailTimestamp = currentTime;
      }

      // Update the document with new count and timestamp
      transaction.set(userRef, { count, lastEmailTimestamp }, { merge: true });

      return { count, lastEmailTimestamp };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to process request with error: ', error);
    res.status(500).send({ error: 'Failed to process request' });
  }
}
