import admin from 'lib/firebase/server/config';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Check if the user is an admin
    const userProfileDoc = await admin
      .firestore()
      .collection('userProfiles')
      .doc(decodedToken.uid)
      .get();

    if (!userProfileDoc.exists) {
      return res
        .status(403)
        .json({ message: 'Forbidden: User profile not found' });
    }

    const userProfile = userProfileDoc.data();

    if (userProfile.isAdmin) {
      return res.status(200).json({ message: 'Authorized' });
    } else {
      return res
        .status(403)
        .json({ message: 'Forbidden: Admin access required' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
