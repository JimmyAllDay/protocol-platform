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
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

if (process.env.NODE_ENV === 'test') {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = 'localhost:9199';
}

export default admin;
export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();
