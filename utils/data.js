import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'James',
      email: 'jameswhmarshall@gmail.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: 'true',
    },
    {
      name: 'Jane',
      email: 'user@example.com',
      password: bcrypt.hashSync('789101112'),
      isAdmin: 'false',
    },
  ],
};

export default data;
