const firebaseFirestore = jest.requireActual('firebase/firestore');

const getFirestore = jest.fn(() => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  settings: jest.fn(),
}));

const doc = jest.fn();
const getDoc = jest.fn();

module.exports = {
  ...firebaseFirestore,
  getFirestore,
  doc,
  getDoc,
};
