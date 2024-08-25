import { auth, db } from '../../config';
import { signInWithPopup, FacebookAuthProvider } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { createUserManagementDoc, createUserProfileDoc } from '../register';
import signInWithFacebookHandler from '../facebookSignIn';

// Mock config
jest.mock('../../config.js', () => ({
  auth: { signInWithPopup: jest.fn() },
  db: { collection: jest.fn() },
}));

// Mock firebase/auth
jest.mock('firebase/auth', () => {
  const actualAuth = jest.requireActual('firebase/auth'); // Preserve actual implementation
  return {
    ...actualAuth, // Include all actual exports
    signInWithPopup: jest.fn(), // Mock signInWithPopup
    FacebookAuthProvider: jest.fn().mockImplementation(() => {
      return { providerId: 'facebook.com' }; // Mock implementation with providerId
    }),
    FacebookAuthProvider: class {
      constructor() {
        this.providerId = 'facebook.com';
      }
      static credentialFromResult = jest.fn().mockReturnValue({
        accessToken: 'mockAccessToken',
      });
    },
  };
});

// Mock firebase/firestore
jest.mock('firebase/firestore', () => {
  const actualFirestore = jest.requireActual('firebase/firestore'); // Preserve actual implementation
  return {
    ...actualFirestore, // Include all actual exports
    getDoc: jest.fn(), // Mock getDoc
    doc: jest.fn(), // Mock doc
  };
});

// Mock getDoc return value
getDoc.mockResolvedValue({
  exists: () => true, // Ensure document exists
  data: () => ({
    profile: 'mockProfile', // Mock data
  }),
});

// Mock signIn and register modules
jest.mock('../signIn', () => ({
  getUserProfile: jest.fn(),
}));

jest.mock('../register.js', () => ({
  createUserManagementDoc: jest.fn(),
  createUserProfileDoc: jest.fn(),
}));

describe('signInWithFacebookHandler', () => {
  const onProgressUpdate = jest.fn();
  let mockCredential;

  beforeAll(() => {
    mockCredential = {
      accessToken: 'mockAccessToken',
    };
    // Store the original console.error method
    originalConsoleError = console.error;
    // Mock console.error to suppress logs
    console.error = jest.fn();
    FacebookAuthProvider.credentialFromResult = jest
      .fn()
      .mockReturnValue(mockCredential);
  });

  afterAll(() => {
    // Restore the original console.error method
    console.error = originalConsoleError;
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should sign in with Facebook and create user profile and management documents if they do not exist', async () => {
    const mockUser = { uid: 'mockUid', email: 'mockEmail' };
    const mockResult = {
      user: mockUser,
      additionalUserInfo: { profile: 'mockProfile' },
    };

    signInWithPopup.mockResolvedValueOnce(mockResult); // Mock signInWithPopup resolved value
    getDoc
      .mockResolvedValueOnce({ exists: () => false }) // Profile doc does not exist
      .mockResolvedValueOnce({ exists: () => false }); // User management doc does not exist

    await signInWithFacebookHandler(onProgressUpdate);

    expect(signInWithPopup).toHaveBeenCalledWith(
      auth,
      expect.any(FacebookAuthProvider) // Match any instance of FacebookAuthProvider
    );
    expect(onProgressUpdate).toHaveBeenCalledWith({
      progress: '50%',
      message: 'Checking for existing user profile...',
    });
    expect(createUserProfileDoc).toHaveBeenCalledWith(
      'mockEmail',
      'mockUid',
      onProgressUpdate
    );
    expect(onProgressUpdate).toHaveBeenCalledWith({
      progress: '60%',
      message: 'Creating user profile...',
    });
    expect(onProgressUpdate).toHaveBeenCalledWith({
      progress: '70%',
      message: 'User profile created.',
    });
    expect(createUserManagementDoc).toHaveBeenCalledWith(
      'mockEmail',
      'mockUid',
      onProgressUpdate
    );
    expect(onProgressUpdate).toHaveBeenCalledWith({
      progress: '80%',
      message: 'Creating user management document...',
    });
    expect(onProgressUpdate).toHaveBeenCalledWith({
      progress: '90%',
      message: 'User management document created.',
    });
    expect(onProgressUpdate).toHaveBeenCalledWith({
      progress: '100%',
      message: 'Login successful.',
    });
  });

  it('should sign in with Facebook and fetch existing user profile', async () => {
    const mockUser = { uid: 'mockUid', email: 'mockEmail' };
    const mockResult = {
      user: mockUser,
      additionalUserInfo: { profile: 'mockProfile' },
    };
    const mockProfileData = { some: 'data' };

    signInWithPopup.mockResolvedValueOnce(mockResult); // Mock signInWithPopup resolved value
    getDoc
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => mockProfileData,
      }) // Profile doc exists
      .mockResolvedValueOnce({ exists: () => true }); // User management doc exists

    const userProfile = await signInWithFacebookHandler(onProgressUpdate);

    expect(signInWithPopup).toHaveBeenCalledWith(
      auth,
      expect.any(FacebookAuthProvider) // Match any instance of FacebookAuthProvider
    );
    expect(onProgressUpdate).toHaveBeenCalledWith({
      progress: '50%',
      message: 'Checking for existing user profile...',
    });
    expect(getDoc).toHaveBeenCalledTimes(2); // Check for both profile and management docs
    expect(userProfile).toEqual(mockProfileData);
    expect(onProgressUpdate).toHaveBeenCalledWith({
      progress: '100%',
      message: 'Login successful.',
    });
  });

  it('should handle errors during Facebook sign-in', async () => {
    const mockError = new Error('Sign-in error');

    signInWithPopup.mockRejectedValueOnce(mockError); // Mock rejected value for signInWithPopup

    await expect(signInWithFacebookHandler(onProgressUpdate)).rejects.toThrow(
      'Sign-in error'
    );

    expect(signInWithPopup).toHaveBeenCalledWith(
      auth,
      expect.any(FacebookAuthProvider) // Match any instance of FacebookAuthProvider
    );
    expect(onProgressUpdate).toHaveBeenCalledWith({
      progress: '0%',
      message: 'Facebook sign-in failed. Please try again.',
    });
    expect(onProgressUpdate).toHaveBeenCalledTimes(1);
  });
});
