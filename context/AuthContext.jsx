import React, { createContext, useContext, useEffect } from 'react';
import { register } from 'lib/firebase/client/auth/register/register';
import { manageSignIn } from 'lib/firebase/client/auth/signIn/manageSignIn';
import signInWithFacebook from 'lib/firebase/client/auth/facebookSignIn';
import { signOutUser } from 'lib/firebase/client/auth/signOut';
import useFirebaseAuth from 'components/auth/useFirebaseAuth';
import { LoadingContext } from 'context/LoadingContext';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { userProfile, fetchUserProfile, setUserProfile, token, fetchToken } =
    useFirebaseAuth();
  const { loading } = useContext(LoadingContext);

  const contextValue = {
    createUser: register,
    signIn: manageSignIn,
    fbSignIn: signInWithFacebook,
    signOut: signOutUser,
    user: userProfile,
    fetchUserProfile,
    setUserProfile,
    token,
    fetchToken,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
