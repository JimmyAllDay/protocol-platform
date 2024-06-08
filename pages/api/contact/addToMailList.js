import { firestore } from 'firebase-admin';
import { db } from 'lib/firebase/server/config';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

const RATE_LIMIT_TIME_FRAME = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_SUBMISSIONS = 3; // Maximum submissions allowed per IP address per hour

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    // Ensure the collection and document references are correctly initialized
    const submissionLogsRef = db.collection('submissionLogs').doc(ip);

    const submissionLogDoc = await submissionLogsRef.get();

    const currentTime = Timestamp.now();

    if (submissionLogDoc.exists) {
      const submissionLog = submissionLogDoc.data();

      const recentSubmissions = submissionLog.timestamps.filter(
        (timestamp) =>
          currentTime.toMillis() - timestamp.toMillis() < RATE_LIMIT_TIME_FRAME
      );

      if (recentSubmissions.length >= MAX_SUBMISSIONS) {
        console.log('Rate limit exceeded');
        return res
          .status(429)
          .json({ error: 'Too many submissions. Please try again later.' }); // Too Many Requests
      }

      // Add the current timestamp to the submission log
      recentSubmissions.push(currentTime);
      await submissionLogsRef.update({ timestamps: recentSubmissions });
    } else {
      // Create a new submission log for this IP address
      await submissionLogsRef.set({ timestamps: [currentTime] });
    }

    // Check if the email already exists in the mailing list
    const mailingListRef = db.collection('mailingList');

    const existingEmailQuery = await mailingListRef
      .where('email', '==', email)
      .get();

    if (!existingEmailQuery.empty) {
      // If the email exists, merge the new data with the existing document
      existingEmailQuery.forEach(async (doc) => {
        await doc.ref.update({
          isSubscribed: true,
          name: '',
          subscriptionDate: FieldValue.serverTimestamp(),
          unsubscriptionDate: null,
          preferences: {
            newsletters: true,
            promotions: true,
          },
          source: 'attended event',
          lastEmailSentDate: '2024-05-28T12:34:56Z',
          engagementMetrics: {},
          segments: ['new patron'],
          emailVerificationStatus: 'unverified',
        });
      });
    } else {
      // If the email does not exist, create a new entry
      const mailingListEntry = {
        email: email,
        isSubscribed: true,
        name: '',
        subscriptionDate: FieldValue.serverTimestamp(),
        unsubscriptionDate: null,
        preferences: {
          newsletters: true,
          promotions: true,
        },
        source: 'mailingListSubmission',
        lastEmailSentDate: '2024-05-28T12:34:56Z',
        engagementMetrics: {},
        segments: ['new subscriber'],
        emailVerificationStatus: 'unverified',
      };

      await mailingListRef.add(mailingListEntry);
      console.log('Added new email entry to mailing list');
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error adding to mail list:', error);
    return res
      .status(500)
      .json({ error: 'Error adding to mail list. Please try again later.' }); // Internal Server Error
  }
}
