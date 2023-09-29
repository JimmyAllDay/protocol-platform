const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'protocol-platform';

async function handler(req, res) {
  console.log('getUser API called at:', new Date().toISOString());
  if (req.method !== 'POST') {
    return;
  }

  const { nickname, name, picture, updated_at, email, sub, sid } =
    req.body.user;

  if (!email || !email.includes('@')) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

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
    updatedAt: updated_at,
    userProfileComplete: false,
    username: nickname,
    phone: 0,
    sub,
    sid,
  };

  try {
    await client.connect();
    console.log('Server connected');
    const db = client.db(dbName);
    const collection = db.collection('userdetails');
    const query = { email: email };
    const existingUser = await collection.findOne(query);
    if (!existingUser) {
      console.log('no existing user');
      const createdUser = await collection.insertOne(newUserData);
      res
        .status(201)
        .json({ message: 'New profile created', data: createdUser });
    }
    console.log(existingUser);
    res.status(200).json({ existingUser });
  } catch (error) {
    //TODO: An error will throw here if too many calls are being made to the database from the client side AuthContext useEffect hook. Have built in client side protection but this is likely a suboptimal solution
    console.error('500 error message: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }

  await client.close();
  console.log('Server disconnected');
}

export default handler;
