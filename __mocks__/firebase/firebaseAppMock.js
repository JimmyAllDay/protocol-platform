const firebase = jest.requireActual('firebase/app');

const auth = {
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  currentUser: null,
};

const db = {
  collection: jest.fn(),
};

const storage = {
  ref: jest.fn(() => ({
    put: jest.fn().mockResolvedValue({
      ref: {
        getDownloadURL: jest
          .fn()
          .mockResolvedValue('http://mock-url.com/file.jpg'),
      },
    }),
  })),
};

const initializeApp = jest.fn();
const getApps = jest.fn(() => []);
const getApp = jest.fn(() => ({}));

module.exports = {
  ...firebase,
  auth,
  db,
  storage,
  initializeApp,
  getApps,
  getApp,
};
