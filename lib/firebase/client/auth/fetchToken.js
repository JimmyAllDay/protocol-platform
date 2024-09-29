import { setCookie } from 'nookies';
export const fetchToken = async (auth) => {
  const user = auth.currentUser;
  try {
    if (!user) {
      throw new Error('User not authenticated');
    }
    // Fetch the token and its result
    const token = await user.getIdToken();
    const tokenResult = await user.getIdTokenResult();
    // Set the token as a cookie
    setCookie(null, 'p_sessionId', token, {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    //To store token in local storage, add:
    //localStorage.setItem('authToken', token);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
