module.exports = {
  setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js'],
  moduleNameMapper: {
    '^firebase/app$': '<rootDir>/__mocks__/firebase/firebaseAppMock.js',
    '^firebase/auth$': '<rootDir>/__mocks__/firebase/firebaseAuthMock.js',
    '^firebase/firestore$':
      '<rootDir>/__mocks__/firebase/firebaseFirestoreMock.js',
    '^firebase/storage$': '<rootDir>/__mocks__/firebase/firebaseStorageMock.js',
    '^./checkVerificationEmail$':
      '<rootDir>/__mocks__/checkVerificationEmail.js',
  },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/__tests__/setupTests.js',
  ],
  testEnvironment: 'jsdom',
};
