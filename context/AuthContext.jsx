import { createContext, useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const { user, error, isLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [limitCall, setLimitCall] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        const res = await axios.post('/api/mongGetUser', { user });
        setUserDetails(res.data.existingUser);
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    //TODO: This block may not handle all cases
    if (user !== undefined && limitCall === false) {
      setLimitCall(true);
      checkUser();
    }
  }, [user, limitCall]);

  const contextValue = {
    user,
    error,
    loading,
    isLoading,
    redirect,
    userDetails,
    setUserDetails,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
