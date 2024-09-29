// lib/firebase/server/utils/handleError.js
export default function handleError(error, redirectPath = '/') {
  console.error('Error in SSR function:', error);

  if ((error.code = 'auth/id-token-expired')) {
    //You're still figuring out what to do with this
    console.log('user token is expired');
    return {
      redirect: {
        destination: redirectPath,
        permanent: false,
      },
    };
  }

  return {
    redirect: {
      destination: redirectPath,
      permanent: false,
    },
  };
}
