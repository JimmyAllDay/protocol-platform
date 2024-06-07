import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import PULogo from 'public/assets/images/PULogo - white.png';

export default function ImageWithFallback({ alt, src, className, ...props }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <Image
      alt={alt}
      onError={setError}
      src={src ? src : PULogo}
      {...props}
      className={className}
      width={props.width}
      height={props.height}
    />
  );
}
