import admin from 'lib/firebase/server/config';

async function logUserOut(uid) {
  try {
    // Revoke all refresh tokens for the user
    await admin.auth().revokeRefreshTokens(uid);
    console.log(
      `Successfully revoked refresh tokens for user with UID: ${uid}`
    );

    // Optionally get the timestamp of when the tokens were revoked
    const user = await admin.auth().getUser(uid);
    const timestamp = new Date(user.tokensValidAfterTime).getTime() / 1000;

    console.log(
      `Tokens for user are invalid after: ${user.tokensValidAfterTime}`
    );

    return timestamp; // This can be used for validation on the client side if needed
  } catch (error) {
    console.error(`Error revoking tokens for user with UID: ${uid}`, error);
  }
}
