const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'protocol-platform';

async function handler(req, res) {
  console.log(`uploadMix route called:${new Date().toISOString()}, `, req.body);
  if (req.method !== 'POST') {
    return;
  }

  const {
    email,
    //! add other properties to destructure
  } = req.body;

  if (
    !email
    //! add other properties to validate
  ) {
    res.status(422).json({
      message: 'Validation error.',
    });
    return;
  }

  const mixData = {
    //! add mix information here
  };

  //   try {
  //     await client.connect();
  //     console.log('Server connected');
  //     const db = client.db(dbName);
  //     const collection = db.collection('userdetails');
  //     const query = { email: email };
  //     const updatedUser = await collection.findOneAndUpdate(
  //       query,
  //       { $set: userData },
  //       {
  //         returnDocument: 'after',
  //       }
  //     );
  //     if (!updatedUser) {
  //    // The user should always be there - what should happen if user is not found?
  //       res.status(404).json({ message: 'User not found.' });
  //     }

  //     res.status(200).json({
  //       message: 'User profile updated!',
  //       updatedUser,
  //     });
  //   } catch (error) {
  //     console.error('500 error message: ', error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  await client.close();
  console.log('server disconnected');
}

export default handler;
