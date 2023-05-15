import UserDetails from '../../models/UserDetails';
import db from '../../utils/db';

async function handler(req, res) {
  console.log('API request: ', req.body);
  if (req.method !== 'POST') {
    return;
  }

  const {
    firstName,
    surname,
    username,
    phoneNumber,
    email,
    isCheckedPromo,
    instagramHandle,
    isCheckedInstagram,
    facebookName,
    isCheckedFacebook,
  } = req.body;

  if (
    !firstName ||
    !surname ||
    !username ||
    !phoneNumber ||
    !email ||
    !email.includes('@') ||
    !isCheckedPromo ||
    !instagramHandle ||
    !isCheckedInstagram ||
    !facebookName ||
    !isCheckedFacebook
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connect();

  //! You need to update this to the behaviour you want.
  //! Thinking about it, you probably want to verify password and other info, to authorise updates to use information.
  const existingUser = await UserDetails.findOne({ email: email });
  if (existingUser) {
    res.status(422).json({ message: 'User exists already!' });
    await db.disconnect();
    return;
  }

  //? - Decide whether you want to re-validate the user's password here. If so, include bcryptjs.hashSync(password),
  const newUserDetails = new UserDetails({
    firstName,
    surname,
    username,
    phoneNumber,
    email,
    isCheckedPromo,
    instagramHandle,
    isCheckedInstagram,
    facebookName,
    isCheckedFacebook,
    isAdmin: false,
  });

  const user = await newUserDetails.save();
  await db.disconnect();
  res.status(201).send({
    message: 'Details Saved. You can now upload a mix.',
  });
}

export default handler;
