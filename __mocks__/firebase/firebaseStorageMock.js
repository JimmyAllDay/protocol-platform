const firebaseStorage = jest.requireActual('firebase/storage');

const getStorage = jest.fn(() => ({
  ref: jest.fn(() => ({
    put: jest.fn().mockResolvedValue({
      ref: {
        getDownloadURL: jest
          .fn()
          .mockResolvedValue('http://mock-url.com/file.jpg'),
      },
    }),
  })),
  useEmulator: jest.fn(), // Add this line
}));

module.exports = {
  ...firebaseStorage,
  getStorage,
};
