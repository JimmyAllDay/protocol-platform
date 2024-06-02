import {
  createAuthProfile,
  createUserProfileDoc,
  createUserManagementDoc,
  register,
} from '../register';
import { auth, db } from '../../config';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

jest.mock('../../config');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');

describe('Registration Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAuthProfile', () => {
    it('should create an auth profile successfully', async () => {
      const mockUser = { uid: 'test-uid' };
      createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });

      const user = await createAuthProfile('test@example.com', 'password');
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password'
      );
      expect(user).toEqual(mockUser);
    });

    it('should throw an error if creating auth profile fails', async () => {
      const errorMessage = 'Auth error';
      createUserWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

      await expect(
        createAuthProfile('test@example.com', 'password')
      ).rejects.toThrow(`Could not create auth profile: ${errorMessage}`);
    });
  });

  describe('createUserProfileDoc', () => {
    it('should create a user profile document successfully', async () => {
      setDoc.mockResolvedValueOnce();
      const onProgressUpdate = jest.fn();

      const result = await createUserProfileDoc(
        'test@example.com',
        'test-uid',
        onProgressUpdate
      );

      expect(setDoc).toHaveBeenCalledWith(
        doc(db, 'userProfiles', 'test-uid'),
        expect.any(Object)
      );
      expect(result).toBe(true);
    });

    it('should retry creating a user profile document on failure', async () => {
      const errorMessage = 'Firestore error';
      setDoc.mockRejectedValueOnce(new Error(errorMessage));
      setDoc.mockResolvedValueOnce();
      const onProgressUpdate = jest.fn();

      const result = await createUserProfileDoc(
        'test@example.com',
        'test-uid',
        onProgressUpdate
      );

      expect(setDoc).toHaveBeenCalledTimes(2);
      expect(result).toBe(true);
    });

    it('should throw an error after max retry attempts', async () => {
      const errorMessage = 'Firestore error';
      setDoc.mockRejectedValue(new Error(errorMessage));
      const onProgressUpdate = jest.fn();

      await expect(
        createUserProfileDoc('test@example.com', 'test-uid', onProgressUpdate)
      ).rejects.toThrow('Unable to create user profile.');
      expect(setDoc).toHaveBeenCalledTimes(5);
    });
  });

  describe('createUserManagementDoc', () => {
    it('should create a user management document successfully', async () => {
      setDoc.mockResolvedValueOnce();
      const onProgressUpdate = jest.fn();

      const result = await createUserManagementDoc(
        'test@example.com',
        'test-uid',
        onProgressUpdate
      );

      expect(setDoc).toHaveBeenCalledWith(
        doc(db, 'userManagement', 'test-uid'),
        expect.any(Object)
      );
      expect(result).toBe(true);
    });

    it('should retry creating a user management document on failure', async () => {
      const errorMessage = 'Firestore error';
      setDoc.mockRejectedValueOnce(new Error(errorMessage));
      setDoc.mockResolvedValueOnce();
      const onProgressUpdate = jest.fn();

      const result = await createUserManagementDoc(
        'test@example.com',
        'test-uid',
        onProgressUpdate
      );

      expect(setDoc).toHaveBeenCalledTimes(2);
      expect(result).toBe(true);
    });

    it('should throw an error after max retry attempts', async () => {
      const errorMessage = 'Firestore error';
      setDoc.mockRejectedValue(new Error(errorMessage));
      const onProgressUpdate = jest.fn();

      await expect(
        createUserManagementDoc(
          'test@example.com',
          'test-uid',
          onProgressUpdate
        )
      ).rejects.toThrow('Unable to create user profile.');
      expect(setDoc).toHaveBeenCalledTimes(5);
    });
  });

  describe('register', () => {
    it('should complete the registration process successfully', async () => {
      const mockUser = { uid: 'test-uid', emailVerified: false };
      createUserWithEmailAndPassword.mockResolvedValue({ user: mockUser });
      setDoc.mockResolvedValueOnce();
      setDoc.mockResolvedValueOnce();
      sendEmailVerification.mockResolvedValueOnce();
      const onProgressUpdate = jest.fn();

      const result = await register(
        'test@example.com',
        'password',
        onProgressUpdate
      );

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        'test@example.com',
        'password'
      );
      expect(setDoc).toHaveBeenCalledTimes(2);
      expect(sendEmailVerification).toHaveBeenCalledWith(mockUser);
      expect(signOut).toHaveBeenCalledWith(auth);
      expect(result).toBe(true);
    });

    it('should handle errors during the registration process', async () => {
      const errorMessage = 'Auth error';
      createUserWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));
      const onProgressUpdate = jest.fn();

      await expect(
        register('test@example.com', 'password', onProgressUpdate)
      ).rejects.toThrow(errorMessage);

      expect(onProgressUpdate).toHaveBeenCalledWith({
        progress: '0%',
        message: 'Registration failed. Please try again.',
      });
    });
  });
});
