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

  console.log('data: ', data);

  // Destructuring the object
  const { err, fields } = data;
  if (err) {
    console.error('Form Error');
    return res.status(500).json({ message: `Internal server error` });
  }

  const { name, productType, price, description, date, imageUrl } = fields;

  const newProduct = {
    name: name[0],
    productType: productType[0],
    price: price[0],
    description: description[0],
    date: date[0],
    imageUrl: imageUrl[0],
  };

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('products');
    await collection.insertOne(newProduct);
    const products = await collection.find().toArray();
    if (!products) {
      console.log('No products found');
      return res.status(500).json({ message: `Internal server error` });
    }
    res.status(200).json({ products });
  } catch (error) {
    //TODO: Think about how to handle this
    console.error('500 error message: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
}

export default handler;
