import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import championLogo from '../public/assets/images/PULogo - cutout - abbrev.png';

export default function Home() {
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center h-full bg-primary text-primary font-mono p-6">
        <Image
          src={championLogo}
          alt="Logo"
          width="auto"
          height="auto"
          className="max-w-[1000px]"
        />
        <h1 className="text-accent text-lg">Welcome to the lower level.</h1>
      </main>
    </Layout>
  );
}
