import React, { useState, useEffect, useContext, useCallback } from 'react';
import { auth } from 'lib/firebase/client/config';
import { getUserProfile } from 'lib/firebase/client/auth/signIn/getUserProfile';
import { LoadingContext } from 'context/LoadingContext';
import showToast from 'utils/toastUtils';
import { setCookie, destroyCookie } from 'nookies';
import { signOutUser } from 'lib/firebase/client/auth/signOut';
import { useRouter } from 'next/router';

const useFirebaseAuth = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [token, setToken] = useState(null); //* This is being logged in a useEffect hook but is otherwise redundant
  const { handleLoading } = useContext(LoadingContext);
  const router = useRouter();

  // Fetch token
  const fetchToken = useCallback(
    async (auth) => {
      // console.log('fetchToken called');
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }
        // Fetch the token and its result
        const token = await user.getIdToken();
        // Set the token as a cookie
        setCookie(null, 'p_sessionId', token, {
          maxAge: 60 * 60, // 1 hour in seconds
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        });
        return setToken(token); //* This is being logged in a useEffect hook but is otherwise redundant
      } catch (error) {
        console.error('Error during token fetch: ', error);
        throw error;
      }
    },
    [auth]
  );

  // Fetch profile
  const fetchUserProfile = useCallback(
    async (uid) => {
      // console.log('fetchUserProfile called');
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
        console.error('Error during profile fetch: ', error);
        throw error;
      }
    },
    [auth]
  );

  //Monitor for login / logout, update profile and cookie
  useEffect(() => {
    handleLoading(true);
    const unsubscribe = auth.onIdTokenChanged(async (user) => {
      // console.log('profile and token refresh triggered');
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
        const message = getErrorMessage(error);
        showToast(message, 'error');
      } finally {
        handleLoading(false);
      }
    });
    return () => unsubscribe();
  }, [fetchUserProfile, handleLoading]);

  // Wrapped signOut for syncing server and client state (pushes to login page where getServerSideProps runs a profile check to match state)
  const handleSignOut = async () => {
    try {
      await signOutUser();
      router.push('/auth/login?userLoggedOut=true');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // //  Console Log profile changes
  // useEffect(() => {
  //   console.log(
  //     'Auth useEffect called to update either token or userProfile',
  //     new Date().toLocaleString()
  //   );
  //   console.log('User token: ', token);
  //   console.log('User Profile object: ', userProfile);
  // }, [userProfile, token]);

  return {
    userProfile,
    fetchUserProfile,
    setUserProfile,
    token,
    fetchToken,
    handleSignOut,
  };
};

export default useFirebaseAuth;
