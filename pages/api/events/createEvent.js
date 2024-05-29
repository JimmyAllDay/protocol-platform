// pages/api/uploadEvent.js
import { db, storage } from 'lib/firebase/server/config';
import { getAllDocs } from 'lib/firebase/server/queries/getAllDocs';

const makeFilePublic = async (filePath) => {
  const bucket = storage.bucket();
  const file = bucket.file(filePath);
  await file.makePublic();
  console.log(`gs://${bucket.name}/${file.name} is now public.`);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const {
      title,
      desc,
      genre,
      venueName,
      venueAddress,
      date,
      time,
      content,
      imageFile,
      createdBy,
      createdAt,
    } = req.body;

    // Upload image to Firebase Storage
    const bucket = storage.bucket();
    const imageBuffer = Buffer.from(imageFile, 'base64');
    const imageName = `${Date.now()}-${title.replace(/\s/g, '-')}`;
    const filePath = `eventCollateral/${imageName}`;
    const file = bucket.file(filePath);
    await file.save(imageBuffer, {
      metadata: { contentType: 'image/jpeg' },
    });

    // Make the file public
    await makeFilePublic(filePath);

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/eventCollateral/${imageName}`;

    // Create the event document and get its ID
    const eventRef = await db.collection('events').add({
      title,
      desc,
      genre,
      venueName,
      venueAddress,
      date,
      time,
      content,
      imageUrl,
      createdBy,
      createdAt,
    });

    const eventId = eventRef.id;

    // Update the event document to include the ID
    await eventRef.update({ id: eventId });

    const events = await getAllDocs('events');

    return res
      .status(200)
      .json({ message: 'Event uploaded successfully!', data: events });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
