const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'protocol-platform';

async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.status(500).json({ message: 'Server error' });
    return;
  }

  const { id } = req.query;

  console.log(id);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('patrons');

    await collection.deleteOne({ _id: new ObjectId(id) });
    const patrons = await collection.find().toArray();
    if (!patrons) {
      console.log('No patrons found');
      res.status(500).json({ message: `Internal server error` });
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
