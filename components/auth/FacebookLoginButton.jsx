// components/FacebookLoginButton.js
import React, { useCallback } from 'react';
import { FaFacebook } from 'react-icons/fa';
import checkRecaptcha from 'utils/checkRecaptcha';

const FacebookLoginButton = ({
  sdkLoaded,
  recaptchaToken,
  updateProgress,
  fbSignIn,
  fetchUserProfile,
  router,
}) => {
  const handleFacebookLogin = useCallback(async () => {
    if (!sdkLoaded) {
      console.error('Facebook SDK not loaded yet.');
      return;
    }

    try {
      const res = await checkRecaptcha(recaptchaToken);

      if (!res.success) {
        console.error('reCAPTCHA verification failed');
        return;
      }

      updateProgress({
        progress: '10%',
        message: 'reCAPTCHA verified successfully',
      });

      const result = await fbSignIn(updateProgress);
      console.log('Facebook sign-in result:', result);

      if (result && result.uid) {
        console.log('Result UID:', result.uid);
        await fetchUserProfile(result.uid);
        router.push({ pathname: '/' });
      } else {
        console.error(
          'Sign-in failed. User data is incomplete or not available:',
          result
        );
        updateProgress({
          progress: '0%',
          message: 'Sign-in failed. User data is incomplete.',
        });
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      updateProgress({
        progress: '0%',
        message: 'Facebook sign-in failed. Please try again.',
      });
    }
  }, [sdkLoaded, recaptchaToken, fetchUserProfile, router]);

  return (
    <button
      className="flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 text-sm mx-4 rounded focus:outline-none focus:shadow-outline"
      onClick={() => handleFacebookLogin(updateProgress)}
    >
      <div className="text-2xl">
        <FaFacebook />
      </div>
      Log In with Facebook
    </button>
  );
};

export default FacebookLoginButton;
