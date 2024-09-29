import React, { useState, useEffect, useContext, useCallback } from 'react';
import { auth } from 'lib/firebase/client/config';
import { getUserProfile } from 'lib/firebase/client/auth/signIn';
// import { fetchToken } from 'lib/firebase/client/auth/fetchToken';
import { LoadingContext } from 'context/LoadingContext';
import { toast } from 'react-toastify';
import { signOutUser } from 'lib/firebase/client/auth/signOut';
import { setCookie, destroyCookie } from 'nookies';

const useFirebaseAuth = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null); //* This is being logged in a useEffect hook but is otherwise redundant
  const { handleLoading } = useContext(LoadingContext);

  // Fetch token
  const fetchToken = useCallback(
    async (auth) => {
      console.log('fetchToken called');
      try {
        const user = auth.currentUser;
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
        return setToken(token); //* This is being logged in a useEffect hook but is otherwise redundant
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [auth]
  );

  // Fetch profile
  const fetchUserProfile = useCallback(
    async (uid) => {
      console.log('fetchUserProfile called');
      try {
        if (!uid) {
          throw new Error('No UID provided for fetching user profile');
        }
        // Fetch user profile using the provided UID
        const profile = await getUserProfile(uid);
        if (profile) {
          return setUserProfile(profile);
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    [auth]
  );

  //Monitor for login / logout, update profile and cookie
  useEffect(() => {
    handleLoading(true);
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      console.log('profile and token refresh triggered');
      try {
        if (user) {
          const providerId = user.providerData[0]?.providerId;
          const isEmailVerified = user.emailVerified;
          const isFacebookUser = providerId === 'facebook.com';
          if (isFacebookUser || isEmailVerified) {
            await fetchToken(auth);
            await fetchUserProfile(user.uid);
          } else {
            setUserProfile(null);
            destroyCookie(null, 'p_sessionId', { path: '/' });
          }
        } else {
          setUserProfile(null);
          destroyCookie(null, 'p_sessionId', { path: '/' });
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

  //Console Log profile changes
  useEffect(() => {
    console.log('User token: ', token);
    console.log('User Profile object: ', userProfile);
  }, [userProfile, token]);

  return { userProfile, fetchUserProfile, token, fetchToken };
};

export default useFirebaseAuth;
