import getSingleDoc from 'lib/firebase/server/ssr/getSingleDoc';

// Function to check if the user is an admin
export default async function checkAdmin(uid) {
  try {
    const userData = await getSingleDoc('userProfiles', uid);

    if (!userData.isAdmin) {
      throw new Error('User is not an admin');
    }

    return true;
  } catch (error) {
    console.error('Admin check failed:', error);
    return false;
  }
}
