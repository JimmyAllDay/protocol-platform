const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'protocol-platform';

async function handler(req, res) {
  const { id } = req.query;

  const email = id;

  if (!email || !email.includes('@')) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }
  //TODO: You may have to update the below when you finalise your Auth solution
  const newUserData = {
    createdAt: new Date(),
    email: email,
    facebookName: '',
    firstName: '',
    instagramHandle: '',
    isCheckedFacebook: false,
    isCheckedInstagram: false,
    isCheckedPromo: false,
    surname: '',
    updatedAt: '',
    userProfileComplete: false,
    username: '',
    phone: 0,
  };

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('userdetails');
    const query = { email: email };
    const user = await collection.findOne(query);
    if (!user) {
      console.log('creating user');
      const user = await collection.insertOne(newUserData);
      res.status(201).json({ message: 'New profile created', user });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    //TODO: Think about how to handle this
    console.error('500 error message: ', error);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
}

export default handler;
