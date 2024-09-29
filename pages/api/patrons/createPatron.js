import { firestore } from 'firebase-admin';
import { db } from 'lib/firebase/server/config';
import { getAllDocs } from 'lib/firebase/server/ssr/getAllDocs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    // Create data for the patrons collection
    const patronData = {
      email,
      dateAdded: firestore.FieldValue.serverTimestamp(),
      datesAttended: [],
      emailVerified: false,
    };

    // Add to the patrons collection
    await db.collection('patrons').add(patronData);

    // Create data for the mailList collection
    const mailListData = {
      email,
      recievingMail: true,
    };

    const mailingListEntry = {
      email: email,
      isSubscribed: true,
      name: '',
      subscriptionDate: firestore.FieldValue.serverTimestamp(),
      unsubscriptionDate: null,
      preferences: {
        newsletters: true,
        promotions: true,
      },
      source: 'attendedEvent',
      lastEmailSentDate: '2024-05-28T12:34:56Z',
      engagementMetrics: {},
      segments: ['new patron'],
      emailVerificationStatus: 'unverified',
    };

    // Add to the mailList collection
    await db.collection('mailingList').add(mailListData);

    const allPatrons = await getAllDocs('patrons'); // Ensure getAllDocs is awaited

    return res
      .status(200)
      .json({ message: 'Patron added successfully', data: allPatrons });
  } catch (error) {
    console.error('Error adding patron:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
