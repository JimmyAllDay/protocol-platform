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
  const { email, dateAdded } = fields;

  const currentDate = new Date();

  const newPatron = {
    email: email[0],
    onMailList: true,
    dateAdded: currentDate,
  };

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('patrons');
    await collection.insertOne(newPatron);
    const patrons = await collection.find().toArray();
    if (!patrons) {
      console.log('No patrons found');
      res.status(500).json({
        message: `Internal server error`,
      });
    }
    res.status(200).json({ patrons });
  } catch (error) {
    //TODO: Think about how to handle this
    console.error('500 error message: ', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
}

export default handler;
