import UserDetails from '../../models/UserDetails';
import db from '../../utils/db';

//0. Get user email from Auth0 - happens on front end

//3. if profile exists, update it with user details
//4. you will need to understand what information has to be exchanged with auth0

async function handler(req, res) {
  console.log('API request: ', req.body);

  //Check request method
  if (req.method !== 'POST') {
    return;
  }

  const {
    firstName,
    surname,
    username,
    email,
    phoneNumber,
    instagramHandle,
    facebookName,
  } = req.body;

  if (
    !firstName ||
    !surname ||
    !username ||
    !phoneNumber ||
    !email ||
    !email.includes('@')
  ) {
    res.status(422).json({
      message: 'Validation error',
    });
    return;
  }

  await db.connect();

  //1. search through Mongo for user profile using email
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
    isAdmin: false,
  });

  const user = await newUserDetails.save();
  await db.disconnect();
  res.status(201).send({
    message: 'Created user!',
    _id: user._id,
    firstName: user.firstName,
    surname: user.surname,
    username: user.username,
    phoneNumber: user.phoneNumber,
    email: user.email,
    isAdmin: user.isAdmin,
  });
}

export default handler;
