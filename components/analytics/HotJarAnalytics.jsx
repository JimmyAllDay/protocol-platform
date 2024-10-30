import React from 'react';
import Script from 'next/script';

const HotJar = () => {
  const hotjarId = process.env.NEXT_PUBLIC_HOTJARID;
  const hotjarSv = process.env.NEXT_PUBLIC_HOTJARSV;

  return (
    <>
      <Script
        id="hotjar-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
          (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${hotjarId},hjsv:${hotjarSv}};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `,
        }}
      />
    </>
  );
};

export default HotJar;
