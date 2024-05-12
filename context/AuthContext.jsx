import { createContext, useState, useEffect } from 'react';

import { register } from 'lib/firebase/client/auth/register';
import { manageSignIn } from 'lib/firebase/client/auth/signIn';
import { signOutUser } from 'lib/firebase/client/auth/signOut';

import useFirebaseAuth from 'components/auth/useFirebaseAuth';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { userProfile, profileComplete } = useFirebaseAuth();

  const contextValue = {
    createUser: register,
    signIn: manageSignIn,
    signOut: signOutUser,
    user: userProfile,
    profileComplete,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
