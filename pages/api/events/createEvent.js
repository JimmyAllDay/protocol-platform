const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'protocol-platform';

import { Formidable } from 'formidable';

//set bodyparser
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const data = await new Promise((resolve, reject) => {
    const form = new Formidable();

    form.parse(req, (err, fields, files) => {
      if (err) reject({ err });
      resolve({ err, fields, files });
    });
  });

  // Destructuring the object
  const { err, fields } = data;
  if (err) {
    console.error('Form Error');
    return res.status(500).json({ message: `Internal server error` });
  }
  const {
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
  } = fields;

  const newEvent = {
    title: title[0],
    desc: desc[0],
    genre: genre[0],
    imageUrl: imageUrl[0],
    venueName: venueName[0],
    venueAddress: venueAddress[0],
    date: date[0],
    time: time[0],
    content: content[0],
    createdBy: createdBy[0],
  };

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('events');
    await collection.insertOne(newEvent);
    const events = await collection.find().toArray();
    if (!events) {
      console.log('No products found');
      res.status(500).json({
        message: `Internal server error`,
      });
    }
    res.status(200).json({ events });
  } catch (error) {
    //TODO: Think about how to handle this
    console.error('500 error message: ', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
}

export default handler;
