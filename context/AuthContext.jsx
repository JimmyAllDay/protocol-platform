import { createContext, useState, useEffect } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // const { user, error, isLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  // const [userDetails, setUserDetails] = useState({});
  const [limitCall, setLimitCall] = useState(false);

  //TODO: Auth solution has stopped working
  const userDetails = [
    {
      _id: { $oid: '6462ae764da5a3c7b3d2751a' },
      firstName: 'James',
      surname: 'Marshall',
      username: 'Pro.ground Admin',
      email: 'jameswhmarshall@gmail.com',
      isCheckedPromo: true,
      instagramHandle: 'Protocol__Underground',
      isCheckedInstagram: true,
      facebookName: 'Protocol Underground',
      isCheckedFacebook: true,
      isAdmin: true,
      createdAt: '2023-05-15T22:13:10.946Z',
      __v: { $numberInt: '0' },
      userProfileComplete: true,
      phone: '0405504384',
      updatedAt: [
        '2023-09-29T10:30:38.598Z',
        '2023-09-29T10:44:01.505Z',
        '2023-09-29T11:15:58.534Z',
        '2023-09-29T11:17:14.746Z',
        '2023-09-29T21:12:04.931Z',
        '2023-10-14T01:34:14.730Z',
      ],
    },
  ];

  // useEffect(() => {
  //   const checkUser = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await axios.post('/api/getUser', { user });
  //       setUserDetails(res.data.existingUser);
  //     } catch (error) {
  //       console.error(error);
  //     }

  //     setLoading(false);
  //   };

  //   //TODO: This block may need to be updated
  //   if (user !== undefined && limitCall === false) {
  //     setLimitCall(true);
  //     checkUser();
  //   }
  // }, [user, limitCall]);

  const contextValue = {
    userDetails,
    // error,
    // loading,
    // isLoading,
    // redirect,
    // userDetails,
    // setUserDetails,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
