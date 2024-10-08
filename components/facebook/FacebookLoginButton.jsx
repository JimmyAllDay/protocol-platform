import React, { useCallback, useState } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { useFacebookSDK } from 'context/FacebookSDKContext'; // Adjust as needed
import { useRouter } from 'next/router'; // Assuming Next.js
import signInWithFacebookHandler from 'lib/firebase/client/auth/facebookSignIn'; // Path to your existing handler

import showToast from 'utils/toastUtils';
import getErrorMessage from 'utils/getErrorMessage';

const FacebookLoginButton = ({ updateProgress }) => {
  const { sdkLoaded } = useFacebookSDK(); // Check if Facebook SDK is loaded
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // For redirect after login

  const handleFacebookLogin = useCallback(async () => {
    if (!sdkLoaded) {
      showToast('Facebook login not ready. Please try again.', 'error');
      return;
    }

    try {
      setLoading(true);

      // Call the existing signInWithFacebookHandler function
      const userProfile = await signInWithFacebookHandler(updateProgress);

      if (userProfile) {
        router.push({ pathname: '/' });
      }
    } catch (error) {
      console.error('Detailed Error Log:', error);
      const message = getErrorMessage(error);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [sdkLoaded, updateProgress, router]);

  return (
    <div>
      <button
        className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 text-sm rounded focus:outline-none focus:shadow-outline w-full"
        onClick={handleFacebookLogin}
        disabled={loading}
      >
        <div className="text-2xl">
          <FaFacebook />
        </div>
        {loading ? 'Please wait...' : 'Log In with Facebook'}
      </button>
    </div>
  );
};

export default FacebookLoginButton;
