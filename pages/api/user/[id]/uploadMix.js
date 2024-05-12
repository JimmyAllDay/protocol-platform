const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'protocol-platform';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  const { url, email, _id, name } = req.body;

  if (!email || !url || !_id || !name) {
    res.status(422).json({
      message: 'Validation error.',
    });
    return;
  }

  try {
    await client.connect();
    console.log('Server connected');
    const db = client.db(dbName);
    //TODO: Change userdetails to just users - you'll need to change all the paths that access this collection
    const collection = db.collection('userdetails');
    const query = { email: email };

    let foundUser = await collection.findOne(query);
    if (!foundUser) {
      res.status(404).json({ message: 'User not found.' });
    }

    foundUser.mixData = [];

    foundUser.mixData.push({ name: name, url: url });

    const updatedUser = await collection.findOneAndUpdate(
      query,
      { $set: foundUser },
      {
        returnDocument: 'after',
      }
    );

    res.status(200).json({
      message: 'User profile updated!',
      updatedUser,
    });
  } catch (error) {
    console.error('500 error message: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default handler;
