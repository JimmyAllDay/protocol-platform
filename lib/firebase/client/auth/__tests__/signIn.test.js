import { auth, db } from '../../config';
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import checkVerificationEmail from '../checkVerificationEmail';
import { getUserProfile, manageSignIn, signIn } from '../signIn';

jest.mock('../../config');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('../checkVerificationEmail');

describe('authFunctions', () => {
  const originalError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalError; // Restore original console.error
  });

  describe('getUserProfile', () => {
    it('should return user profile data', async () => {
      const mockDocSnap = {
        data: jest.fn().mockReturnValue({ name: 'Test User' }),
      };
      getDoc.mockResolvedValue(mockDocSnap);

      const userProfile = await getUserProfile('test-uid');

      expect(doc).toHaveBeenCalledWith(db, 'userProfiles', 'test-uid');
      expect(getDoc).toHaveBeenCalled();
      expect(userProfile).toEqual({ name: 'Test User' });
    });

    it('should throw an error if getDoc fails', async () => {
      const errorMessage = 'Firestore error';
      getDoc.mockRejectedValue(new Error(errorMessage));

      // Suppress console.error for this test
      console.error = jest.fn();

      // Expect the getUserProfile function to throw an error with the message 'Firestore error'
      await expect(getUserProfile('test-uid')).rejects.toThrow(errorMessage);

      // Optionally, you can also assert that console.error was called
      expect(console.error).toHaveBeenCalledWith(new Error(errorMessage));
    });
  });

  describe('signIn', () => {
    it('should sign in a user and return user data', async () => {
      const mockUserCredential = {
        user: { uid: 'test-uid', emailVerified: true },
      };
      signInWithEmailAndPassword.mockResolvedValue(mockUserCredential);

      const user = await signIn('test@example.com', 'password');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password'
      );
      expect(user).toEqual(mockUserCredential.user);
    });

    it('should throw an error if signInWithEmailAndPassword fails', async () => {
      const errorMessage = 'Auth error';
      signInWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

      await expect(signIn('test@example.com', 'password')).rejects.toThrow(
        errorMessage
      );
    });
  });

  describe('manageSignIn', () => {
    it('should handle sign in process and return user profile', async () => {
      const mockOnProgressUpdate = jest.fn();
      const mockUser = { uid: 'test-uid', emailVerified: true };
      const mockUserProfile = { name: 'Test User' };
      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      getDoc.mockResolvedValue({ data: () => mockUserProfile });

      await manageSignIn('test@example.com', 'password', mockOnProgressUpdate);

      expect(mockOnProgressUpdate).toHaveBeenCalledWith({
        progress: '0%',
        message: 'Starting login...',
      });
      expect(mockOnProgressUpdate).toHaveBeenCalledWith({
        progress: '100%',
        message: 'Welcome to the lower level.',
      });
      expect(getDoc).toHaveBeenCalled();
    });

    it('should handle email verification and send email if necessary', async () => {
      const mockOnProgressUpdate = jest.fn();
      const mockUser = { uid: 'test-uid', emailVerified: false };
      const mockShouldSendVerification = { send: true, count: 1 };

      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      checkVerificationEmail.mockResolvedValue(mockShouldSendVerification);

      await expect(
        manageSignIn('test@example.com', 'password', mockOnProgressUpdate)
      ).rejects.toThrow(
        'Email account not verified. A verification email has been sent. Please verify your account and try again. Remaining attempts: 2'
      );

      expect(mockOnProgressUpdate).toHaveBeenCalledWith({
        progress: '50%',
        message: 'Checking user verification...',
      });
      expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
      expect(signOut).toHaveBeenCalledWith(auth); // Assert signOut was called with the same mock auth instance
    });

    it('should handle maximum email verification attempts reached', async () => {
      const mockOnProgressUpdate = jest.fn();
      const mockUser = { uid: 'test-uid', emailVerified: false };
      const mockShouldSendVerification = { send: false, count: 3 };

      signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      checkVerificationEmail.mockResolvedValue(mockShouldSendVerification);

      await expect(
        manageSignIn('test@example.com', 'password', mockOnProgressUpdate)
      ).rejects.toThrow(
        'Email account not verified. Maximum attempts reached. Please wait 24 hours and try again.'
      );

      expect(mockOnProgressUpdate).toHaveBeenCalledWith({
        progress: '50%',
        message: 'Checking user verification...',
      });
      expect(sendEmailVerification).not.toHaveBeenCalled();
      expect(signOut).toHaveBeenCalledWith(auth); // Assert signOut was called with the same mock auth instance
    });

    it('should handle login failure', async () => {
      const mockOnProgressUpdate = jest.fn();
      const errorMessage = 'Auth error';
      signInWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

      await expect(
        manageSignIn('test@example.com', 'password', mockOnProgressUpdate)
      ).rejects.toThrow(errorMessage);

      expect(mockOnProgressUpdate).toHaveBeenCalledWith({
        progress: '0%',
        message: 'Starting login...',
      });
      expect(mockOnProgressUpdate).toHaveBeenCalledWith({
        progress: '0%',
        message: 'Login failed. Please try again.',
      });
    });
  });
});
