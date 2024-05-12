jest.mock('firebase/firestore', () => ({
  db: {},
  doc: jest.fn(),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => true,
      data: () => ({
        /* Mocked user profile data */
      }),
    })
  ),
}));
