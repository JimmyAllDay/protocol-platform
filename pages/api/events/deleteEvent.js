// pages/api/uploadEvent.js
import { db, storage } from 'lib/firebase/server/config';
import { getAllDocs } from 'lib/firebase/server/ssr/getAllDocs';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { url, id } = req.body;

  if (!id || !url) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    // Delete the event document from Firestore
    await db.collection('events').doc(id).delete();

    // Extract the file path from the URL
    const filePath = url.split('/').slice(-2).join('/'); // Extracts "eventCollateral/filename"

    // Delete the file from Firebase Storage
    const file = storage.bucket().file(filePath);
    await file.delete();

    const events = await getAllDocs('events');

    return res
      .status(200)
      .json({ message: 'Event deleted successfully', events });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
