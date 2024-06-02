import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import championLogo from '../public/assets/images/PULogo - cutout - abbrev.png';

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center bg-primary text-primary font-mono p-6 my-auto">
        <Image
          src={championLogo}
          alt="Protocol Underground logo abbreviated to Pro.ground"
          width="auto"
          height="auto"
          className="max-w-[1000px]"
          priority
        />
        <h1 className="text-primary text-lg">Welcome to the lower level.</h1>
      </div>
    </Layout>
  );
}
