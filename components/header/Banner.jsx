import React, { useState } from 'react';

export default function Banner() {
  const bannerMessage = `If you're a DJ and want to play at a Protocol event, sign up, give us your details and upload a mix. We'll be in touch.`;

  return (
    <div className="bg-primary dark:bg-primaryDark flex items-center justify-center text-center w-screen">
      <div className="marquee w-full">
        <div className="marquee-track w-full">
          <p className="text-primaryDark dark:text-accent2Dark marquee-content">
            {bannerMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
