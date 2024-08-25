import React, { useState, useEffect, useContext, useCallback } from 'react';
import { getUserProfile } from 'lib/firebase/client/auth/signIn';
import { auth, db } from 'lib/firebase/client/config'; // Ensure db is properly exported from your Firebase config
import { onIdTokenChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore doc and getDoc
import { setCookie, destroyCookie } from 'nookies';
import { LoadingContext } from 'context/LoadingContext';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';

const useFirebaseAuth = () => {
  // State to store the user profile
  const [userProfile, setUserProfile] = useState(null);
  // State to track if the profile is complete
  const [profileComplete, setProfileComplete] = useState(false);
  // Get the handleLoading function from the LoadingContext
  const { handleLoading } = useContext(LoadingContext);

  // Function to fetch the user profile from Firestore
  const fetchUserProfile = useCallback(async (uid) => {
    console.log('FETCH USER PROFILE CALLED with UID:', uid);
    try {
      if (!uid) {
        throw new Error('No UID provided for fetching user profile');
      }

      // Fetch user profile using the provided UID
      const profile = await getUserProfile(uid);
      console.log('FETCH USER PROFILE RESPONSE:', profile);

      // Set the fetched profile to the state
      setUserProfile(profile);

      // Safety check to see if the profile is complete
      const userDocRef = doc(db, 'userManagement', uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().userProfileUpdates?.complete) {
        setProfileComplete(true);
      } else {
        setProfileComplete(false);
      }

      // Get the current user from Firebase Auth
      const user = auth.currentUser;
      if (user) {
        // Get the ID token of the current user
        const token = await user.getIdToken();
        // Set the token as a cookie
        setCookie(null, 'token', token, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          secure: process.env.NODE_ENV === 'production', // Secure cookie in production
        });
      }
    } catch (error) {
      console.error('An error occurred during profile fetch:', error);
      toast.error(error.message);
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      console.log('SET USER PROFILE UPDATE: ', userProfile);
      // Perform any additional actions needed after userProfile is set
    }
  }, [userProfile]);

  // Effect to handle the user authentication state changes
  useEffect(() => {
    handleLoading(true);

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      try {
        if (user) {
          const providerId = user.providerData[0]?.providerId;
          const isEmailVerified = user.emailVerified;

          // Check if the user signed in with Facebook
          const isFacebookUser = providerId === 'facebook.com';

          if (isFacebookUser || isEmailVerified) {
            await fetchUserProfile(user.uid);
          } else {
            setUserProfile(null);
            setProfileComplete(false);
            destroyCookie(null, 'token', { path: '/' });
          }
        } else {
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

    return () => unsubscribe();
  }, [fetchUserProfile, handleLoading]);

  // Effect to check token expiration periodically
  useEffect(() => {
    const checkTokenExpiration = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Force refresh the token
        const token = await currentUser.getIdToken(true);
        const tokenResult = await currentUser.getIdTokenResult();

        // Check if the token is expired
        const isExpired =
          tokenResult.expirationTime <= new Date().toISOString();
        if (isExpired) {
          // Sign out if the token is expired
          await signOut(auth);
          setUserProfile(null);
          setProfileComplete(false);
          destroyCookie(null, 'token', { path: '/' });
          toast.error('Session expired. Please log in again.');
        }
      }
    };

    // Initial token expiration check
    checkTokenExpiration();

    // Set interval to check token expiration every 5 minutes
    const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000); // Check every 5 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return {
    userProfile,
    profileComplete,
    fetchUserProfile,
  };
};

export default useFirebaseAuth;
