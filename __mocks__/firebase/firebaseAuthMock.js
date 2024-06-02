const firebaseAuth = jest.requireActual('firebase/auth');

const signInWithEmailAndPassword = jest.fn();
const signOut = jest.fn();
const sendEmailVerification = jest.fn();

const getAuth = jest.fn(() => ({
  signInWithEmailAndPassword,
  signOut,
  currentUser: null,
  useEmulator: jest.fn(),
}));

module.exports = {
  ...firebaseAuth,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
};
