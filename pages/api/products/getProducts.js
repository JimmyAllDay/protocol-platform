const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'protocol-platform';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return;
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('products');
    const products = await collection.find().toArray();
    if (!products) {
      console.log('No products found');
      res.status(500).json({ message: `Internal server error` });
    }
    res.status(200).json(products);
  } catch (error) {
    //TODO: Think about how to handle this
    console.error('500 error message: ', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
}

export default handler;
