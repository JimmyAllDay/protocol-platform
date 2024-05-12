jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(() =>
    Promise.resolve({
      // Simulate user being logged in with an emailVerified user
      user: { emailVerified: true, uid: 'testUid' },
    })
  ),
  signOut: jest.fn(),
  sendEmailVerification: jest.fn(),
}));
