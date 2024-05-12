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

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('userdetails');
    const query = { _id: new ObjectId(id) };
    const update = await collection.updateOne(query, { $set: { mixData: [] } });
    console.log(update);
    // Check if the update was successful
    if (update.modifiedCount === 1) {
      // Fetch the updated document and return it to the client
      const user = await collection.findOne(query);
      console.log(user);
      res.status(200).json({ message: 'Updated user', user });
    } else {
      res.status(404).json({ message: 'No user found' });
    }
  } catch (error) {
    console.error('500 error message: ', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await client.close();
  }
}

export default handler;
