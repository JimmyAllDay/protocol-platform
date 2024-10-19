import React from 'react';
import Script from 'next/script';

const Metricool = () => {
  return (
    <>
      <Script
        id="metricool-script"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            function loadScript(a){ 
              var b=document.getElementsByTagName("head")[0], 
              c=document.createElement("script"); 
              c.type="text/javascript"; 
              c.src="https://tracker.metricool.com/resources/be.js"; 
              c.onreadystatechange=a; 
              c.onload=a; 
              b.appendChild(c)
            } 
            loadScript(function(){ 
              beTracker.t({hash:"c99a9d2037312487263d5cb7608b6b6f"});
            });
          `,
        }}
      />
    </>
  );
};

export default Metricool;
