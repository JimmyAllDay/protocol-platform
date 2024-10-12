import { getAuth } from 'firebase-admin/auth';
import admin from 'lib/firebase/server/config';
import verifyToken from 'lib/firebase/server/ssr/verifyToken';
import { parseCookies } from 'nookies';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  const { user } = req.body;
  const uid = user.uid;
  const cookies = parseCookies({ req });
  const token = cookies.p_sessionId;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!user) {
    return res.status(400).json({ error: 'User is required' });
  }

  try {
    const decodedToken = await verifyToken(token);

    if (!decodedToken) {
      return res
        .status(403)
        .json({ error: 'Forbidden: Insufficient permissions' });
    }

    // Find the user by email using Firebase Admin
    const userRecord = await admin.auth().getUser(uid);

    // Disable the user account
    await admin.auth().updateUser(userRecord.uid, {
      disabled: true,
    });

    return res.status(200).json({ message: 'Account successfully deleted' });
  } catch (error) {
    console.error('Error disabling user account:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
