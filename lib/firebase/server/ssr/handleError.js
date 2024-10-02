import { destroyCookie } from 'nookies';
import admin from 'lib/firebase/server/config'; // Assuming Firebase Admin SDK is properly initialized

export default function handleError(error, redirectPath = '/') {
  console.error('Error in SSR function:', error);

  return {
    redirect: {
      destination: `${redirectPath}?routeError=true`,
      permanent: false,
    },
  };
}
