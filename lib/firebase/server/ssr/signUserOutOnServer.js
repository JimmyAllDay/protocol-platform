export const signUserOutOnServer = async (uid) => {
  try {
    // Revoke the user's refresh token
    await admin.auth().revokeRefreshTokens(uid);

    // Destroy the session cookie (e.g., p_sessionId)
    destroyCookie(null, 'p_sessionId', { path: '/' });

    console.log(`Refresh tokens revoked for user with UID: ${uid}`);
  } catch (error) {
    console.error('Error revoking tokens for user:', error);
    throw new Error('Failed to sign out user on the server.');
  }
};
