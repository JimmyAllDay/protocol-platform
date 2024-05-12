const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'protocol-platform';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return;
  }

  console.log(req.body);

  try {
    // await client.connect();
    // const db = client.db(dbName);
    // const collection = db.collection('userdetails');
    // const query = { email: email };
    // const existingUser = await collection.findOne(query);
    // if (!existingUser) {
    //   console.log('no existing user');
    //   const createdUser = await collection.insertOne(newUserData);
    //   res.status(201).json({ message: 'New profile created', createdUser });
    // }
    // res.status(200).json({ existingUser });
    res.status(200).json(req.body);
  } catch (error) {
    //TODO: Think about how to handle this
    console.error('500 error message: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }

  await client.close();
}

export default handler;
