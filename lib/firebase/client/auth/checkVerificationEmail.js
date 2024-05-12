export default async function checkVerificationEmail(user) {
  try {
    // Obtain the ID token
    const idToken = await user.getIdToken();
    const response = await fetch('/api/auth/signIn/checkVerificationEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include the ID token in the Authorization header
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ uid: user.uid }),
    });
    if (!response.ok) {
      throw new Error(response.error || 'Network response was not ok');
    }

    const data = await response.json();
    const count = data.count;

    if (count <= 3) {
      return { count: count, send: true };
    } else {
      return { count: count, send: false };
    }
  } catch (error) {
    console.error('Error in checkVerificationEmail:', error);
    throw error;
  }
}
