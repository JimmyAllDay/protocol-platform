import { db } from 'lib/firebase/client/config';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { updateUserProfile } from '../updateUserProfile';

jest.mock('lib/firebase/client/config.js', () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(),
  getDoc: jest.fn(),
}));

describe('updateUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if the user profile document does not exist', async () => {
    const mockUserManagementSnapshot = {
      exists: jest.fn(() => false),
      data: jest.fn(),
    };

    getDoc.mockResolvedValueOnce(mockUserManagementSnapshot);

    const result = await updateUserProfile({}, 'test-uid', 'test@example.com');

    expect(result).toEqual({ error: 'No such document!' });
    expect(console.error).toHaveBeenCalledWith('No such document!');
  });

  it('should return a message if no changes are made to the profile', async () => {
    getDoc.mockResolvedValueOnce({
      exists: jest.fn(() => true),
      data: () => ({ name: 'John Doe', email: 'john.doe@example.com' }),
    });

    const result = await updateUserProfile(
      { name: 'John Doe', email: 'john.doe@example.com' },
      'test-uid',
      'test@example.com'
    );

    expect(result).toEqual({
      message: 'No changes made, profile not updated.',
    });
  });

  it('should return a rate limit message if the update limit is reached', async () => {
    const userManagementSnapshot = {
      exists: jest.fn(() => true),
      data: () => ({
        userProfileUpdates: {
          count: 3,
          lastUpdateTimestamp: new Date().getTime(),
          complete: true,
        },
      }),
    };

    getDoc.mockResolvedValueOnce(userManagementSnapshot).mockResolvedValueOnce({
      exists: jest.fn(() => true),
      data: () => ({ name: 'John Doe', email: 'john.doe@example.com' }),
    });

    const result = await updateUserProfile(
      { name: 'Jane Doe' },
      'test-uid',
      'test@example.com'
    );

    expect(result).toEqual({
      message: 'Update limit reached. Please try again later.',
    });
  });

  it('should successfully update the user profile', async () => {
    const userManagementSnapshot = {
      exists: jest.fn(() => true),
      data: () => ({
        userProfileUpdates: {
          count: 1,
          lastUpdateTimestamp: new Date().getTime() - 2 * 86400000, // 2 days ago
          complete: true,
        },
      }),
    };

    getDoc.mockResolvedValueOnce(userManagementSnapshot).mockResolvedValueOnce({
      exists: jest.fn(() => true),
      data: () => ({ name: 'John Doe', email: 'john.doe@example.com' }),
    });

    const updatedData = { name: 'Jane Doe' };

    const mockServerTimestampValue = new Date().getTime();
    serverTimestamp.mockReturnValue(mockServerTimestampValue);

    const result = await updateUserProfile(
      updatedData,
      'test-uid',
      'test@example.com'
    );

    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      ...updatedData,
      updatedAt: mockServerTimestampValue,
    });

    expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), {
      userProfileUpdates: {
        count: 1,
        lastUpdateTimestamp: mockServerTimestampValue,
        complete: true,
      },
    });

    expect(result).toHaveProperty('name', 'Jane Doe');
  });

  it('should return an error message if there is an error during the update', async () => {
    getDoc.mockImplementationOnce(() => {
      throw new Error('Firestore error');
    });

    const result = await updateUserProfile(
      { name: 'Jane Doe' },
      'test-uid',
      'test@example.com'
    );

    expect(result).toEqual({ error: 'Firestore error' });
    expect(console.error).toHaveBeenCalledWith(new Error('Firestore error'));
  });
});
