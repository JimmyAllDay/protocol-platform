const admin = require('firebase-admin');
// const serviceAccount = require('protocol-underground-7a1f0-firebase-adminsdk-j5o3y-5d0b168eab.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(
        Buffer.from(
          process.env.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS,
          'base64'
        ).toString('ascii')
      )
    ),
  });
}

export default admin;
export const auth = admin.auth();
export const db = admin.firestore();
