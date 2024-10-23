//* Public Page
import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import championLogo from '../public/assets/images/PULogo - cutout - abbrev - solid.png';
import championLogoDark from '../public/assets/images/PULogo - cutout - abbrev.png';
import { useTheme } from 'context/ThemeContext';
import ErrorTestComponent from 'components/errorHandling/ErrorTestComponent';

export default function Home() {
  const { theme } = useTheme();
  return (
    <Layout>
      <h1 className="sr-only">Protocol Underground</h1>
      <div className="flex flex-col items-center justify-center bg-light dark:bg-primaryDark text-primary font-mono p-6 my-auto h-full">
        {theme === 'light' ? (
          <Image
            src={championLogo}
            alt="Protocol Underground"
            width="auto"
            height="auto"
            className="w-full max-w-[1000px] h-auto object-contain"
            priority={theme === 'light'}
          />
        ) : (
          <Image
            src={championLogoDark}
            alt="Protocol Underground"
            width="auto"
            height="auto"
            className="w-full max-w-[1000px] h-auto object-contain"
            priority={theme === 'dark'}
          />
        )}
        <h2 className="text-primary dark:text-primaryDark text-lg p-3">
          Welcome to the lower level.
        </h2>
      </div>
    </Layout>
  );
}
