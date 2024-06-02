import React, { createContext, useContext } from 'react';
import { register } from 'lib/firebase/client/auth/register';
import { manageSignIn } from 'lib/firebase/client/auth/signIn';
import { signOutUser } from 'lib/firebase/client/auth/signOut';
import useFirebaseAuth from 'components/auth/useFirebaseAuth';
import { LoadingContext } from 'context/LoadingContext';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { userProfile, profileComplete, fetchUserProfile } = useFirebaseAuth();
  const { loading } = useContext(LoadingContext);

  const contextValue = {
    createUser: register,
    signIn: manageSignIn,
    signOut: signOutUser,
    user: userProfile,
    profileComplete,
    fetchUserProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
