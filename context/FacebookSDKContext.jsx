import { createContext, useContext, useState, useEffect } from 'react';

// Create a context
const FacebookSDKContext = createContext();

// Create a provider component
export const FacebookSDKProvider = ({ children }) => {
  const [sdkLoaded, setSdkLoaded] = useState(false);

  useEffect(() => {
    // Initialize the Facebook SDK here
    const initializeFacebookSDK = () => {
      if (window.FB) {
        setSdkLoaded(true); // Facebook SDK is already loaded
      } else {
        window.fbAsyncInit = function () {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOKAPPID,
            cookie: true,
            xfbml: true,
            version: 'v9.0',
          });
          setSdkLoaded(true);
        };

        // Load the Facebook SDK script
        (function (d, s, id) {
          const fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          const js = d.createElement(s);
          js.id = id;
          js.src = 'https://connect.facebook.net/en_US/sdk.js';
          fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
      }
    };

    initializeFacebookSDK();
  }, []);

  return (
    <FacebookSDKContext.Provider value={{ sdkLoaded }}>
      {children}
    </FacebookSDKContext.Provider>
  );
};

// Create a custom hook to use the context
export const useFacebookSDK = () => {
  return useContext(FacebookSDKContext);
};
