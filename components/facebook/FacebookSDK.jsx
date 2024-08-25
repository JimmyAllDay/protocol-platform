import React from 'react';
import Script from 'next/script';

export default function FacebookSDK() {
  return (
    <>
      <Script
        id="facebook-sdk"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.fbAsyncInit = function() {
            FB.init({
              appId      : '${process.env.NEXT_PUBLIC_FACEBOOKAPPID}',
              cookie     : true,
              xfbml      : true,
              version    : 'v20.0'
            });
              
            FB.AppEvents.logPageView();   
              
          };
        
          (function(d, s, id){
             var js, fjs = d.getElementsByTagName(s)[0];
             if (d.getElementById(id)) {return;}
             js = d.createElement(s); js.id = id;
             js.src = "https://connect.facebook.net/en_US/sdk.js";
             fjs.parentNode.insertBefore(js, fjs);
           }(document, 'script', 'facebook-jssdk'));
        `,
        }}
      />
    </>
  );
}
