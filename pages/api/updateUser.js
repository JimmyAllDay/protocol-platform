const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'protocol-platform';

async function handler(req, res) {
  console.log(
    `mongUpdateUser route called:${new Date().toISOString()}, `,
    req.body
  );
  if (req.method !== 'POST') {
    return;
  }

  const {
    createdAt,
    email,
    facebookName,
    firstName,
    instagramHandle,
    isCheckedFacebook,
    isCheckedInstagram,
    isCheckedPromo,
    surname,
    updatedAt,
    userProfileComplete,
    username,
    phone,
    __v,
    _id,
  } = req.body;

  if (
    !createdAt ||
    !email ||
    !email.includes('@') ||
    !facebookName ||
    !firstName ||
    !instagramHandle ||
    !isCheckedFacebook ||
    !isCheckedInstagram ||
    !isCheckedPromo ||
    !surname ||
    !updatedAt ||
    !userProfileComplete ||
    !username ||
    !phone
  ) {
    res.status(422).json({
      message: 'Validation error.',
    });
    return;
  }

  const userData = {
    createdAt,
    email,
    facebookName,
    firstName,
    instagramHandle,
    isCheckedFacebook,
    isCheckedInstagram,
    isCheckedPromo,
    surname,
    updatedAt,
    userProfileComplete,
    username,
    phone,
  };

  try {
    await client.connect();
    console.log('Server connected');
    const db = client.db(dbName);
    const collection = db.collection('userdetails');
    const query = { email: email };
    const updatedUser = await collection.findOneAndUpdate(
      query,
      { $set: userData },
      {
        returnDocument: 'after',
      }
    );
    if (!updatedUser) {
      //? The user should always be there - what should happen if user is not found?
      res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      message: 'User profile updated!',
      updatedUser,
    });
  } catch (error) {
    console.error('500 error message: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  await client.close();
}

export default handler;
