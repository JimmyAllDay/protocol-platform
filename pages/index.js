import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import championLogo from '../public/assets/images/PULogo - cutout - abbrev - solid.png';
import championLogoDark from '../public/assets/images/PULogo - cutout - abbrev.png';
import { useTheme } from 'context/ThemeContext';

export default function Home() {
  const { theme } = useTheme();
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center bg-light dark:bg-primaryDark text-primary font-mono p-6 my-auto h-full">
        {theme === 'light' ? (
          <Image
            src={championLogo}
            alt="Protocol Underground"
            width="auto"
            height="auto"
            className="w-full max-w-[1000px] h-auto object-contain"
            priority
          />
        ) : (
          <Image
            src={championLogoDark}
            alt="Protocol Underground"
            width="auto"
            height="auto"
            className="w-full max-w-[1000px] h-auto object-contain"
            priority
          />
        )}
        <h1 className="text-primary dark:text-primaryDark text-lg">
          Welcome to the lower level.
        </h1>
      </div>
    </Layout>
  );
}
