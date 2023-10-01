import React, { useState } from 'react';

export default function Banner() {
  const [scrolling] = useState(false);
  const bannerMessage = `If you're a DJ and want to play at a Protocol event, sign up, give us your details and upload a mix. We'll be in touch.`;

  return (
    <div className="bg-primary items-center justify-center flex">
      <h1
        className={`bg-primary text-accent2 text-center text-sm tracking-wider w-full whitespace-nowrap my-2 ${
          scrolling ? 'animate-marquee' : ''
        }`}
      >
        {bannerMessage}
      </h1>
    </div>
  );
}
