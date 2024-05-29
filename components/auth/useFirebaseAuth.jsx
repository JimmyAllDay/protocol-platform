import { useState, useEffect, useContext } from 'react';
import { getUserProfile } from 'lib/firebase/client/auth/signIn';
import { auth, db } from 'lib/firebase/client/config'; // Ensure db is properly exported from your Firebase config
import { onIdTokenChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore doc and getDoc
import { setCookie, destroyCookie } from 'nookies';
import { LoadingContext } from 'context/LoadingContext';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';

const useFirebaseAuth = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false); // State to track if the profile is complete
  const { handleLoading } = useContext(LoadingContext);

  useEffect(() => {
    handleLoading(true);
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      try {
        if (user && user.emailVerified) {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);

          // Check the userProfileUpdates.complete property
          const userDocRef = doc(db, 'userManagement', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && userDoc.data().userProfileUpdates?.complete) {
            setProfileComplete(true);
          } else {
            setProfileComplete(false);
          }

          const token = await user.getIdToken();
          console.log('Setting token cookie:', token);
          setCookie(null, 'token', token, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
          });
        } else {
          // User is signed out.
          setUserProfile(null);
          setProfileComplete(false);
          destroyCookie(null, 'token', { path: '/' });
        }
      } catch (error) {
        console.error('An error occurred during authentication: ', error);
        toast.error(error.message);
      } finally {
        handleLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      console.log('checking token expiration');
      const currentUser = auth.currentUser;

      if (currentUser) {
        const token = await currentUser.getIdToken(true);
        const tokenResult = await currentUser.getIdTokenResult();

        const isExpired =
          tokenResult.expirationTime <= new Date().toISOString();
        if (isExpired) {
          await signOut(auth);
          setUserProfile(null);
          setProfileComplete(false);
          destroyCookie(null, 'token', { path: '/' });
          toast.error('Session expired. Please log in again.');
        }
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    userProfile,
    profileComplete, // Make profileComplete available to the components
  };
};

export default useFirebaseAuth;
