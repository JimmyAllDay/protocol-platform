import checkVerificationEmail from '../checkVerificationEmail';

global.fetch = jest.fn();

describe('checkVerificationEmail', () => {
  const mockUser = {
    getIdToken: jest.fn(),
    uid: 'test-uid',
  };

  const originalError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('should return count and send as true if count is less than or equal to 3', async () => {
    mockUser.getIdToken.mockResolvedValue('fake-id-token');
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ count: 2 }),
    });

    const result = await checkVerificationEmail(mockUser);

    expect(mockUser.getIdToken).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/signIn/checkVerificationEmail',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer fake-id-token`,
        },
        body: JSON.stringify({ uid: 'test-uid' }),
      }
    );
    expect(result).toEqual({ count: 2, send: true });
  });

  it('should return count and send as false if count is greater than 3', async () => {
    mockUser.getIdToken.mockResolvedValue('fake-id-token');
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ count: 4 }),
    });

    const result = await checkVerificationEmail(mockUser);

    expect(mockUser.getIdToken).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/signIn/checkVerificationEmail',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer fake-id-token`,
        },
        body: JSON.stringify({ uid: 'test-uid' }),
      }
    );
    expect(result).toEqual({ count: 4, send: false });
  });

  it('should throw an error if the response is not ok', async () => {
    mockUser.getIdToken.mockResolvedValue('fake-id-token');
    fetch.mockResolvedValueOnce({
      ok: false,
      error: 'Some error',
    });

    await expect(checkVerificationEmail(mockUser)).rejects.toThrow(
      'Some error'
    );
    expect(mockUser.getIdToken).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/signIn/checkVerificationEmail',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer fake-id-token`,
        },
        body: JSON.stringify({ uid: 'test-uid' }),
      }
    );
  });

  it('should throw an error if fetch fails', async () => {
    mockUser.getIdToken.mockResolvedValue('fake-id-token');
    fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    await expect(checkVerificationEmail(mockUser)).rejects.toThrow(
      'Fetch failed'
    );
    expect(mockUser.getIdToken).toHaveBeenCalled();
    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/signIn/checkVerificationEmail',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer fake-id-token`,
        },
        body: JSON.stringify({ uid: 'test-uid' }),
      }
    );
  });
});
