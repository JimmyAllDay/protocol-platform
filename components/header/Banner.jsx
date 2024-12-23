import React, { useState } from 'react';

export default function Banner() {
  const bannerMessage = `If you're a DJ and want to play at a Pro.ground event, sign up, give us your details and upload a mix. We'll be in touch.`;

  return (
    <div className="bg-primary dark:bg-primaryDark flex items-center justify-center text-center w-screen overflow-hidden">
      <div className="marquee w-full overflow-hidden whitespace-nowrap">
        <div className="marquee-track">
          <p className="text-accent dark:text-accent2Dark marque-content">
            {bannerMessage}
          </p>
          <p className="text-accent dark:text-accent2Dark marque-content invisible">
            {bannerMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
