import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import championLogo from '../public/assets/images/PULogo - cutout - abbrev.png';

export default function Home() {
  return (
    <div className="bg-primary text-primary font-mono">
      <Layout>
        <main className="flex flex-col items-center justify-center h-full">
          <Image
            src={championLogo}
            alt="Logo"
            width={1000}
            height="auto"
            className=""
          />
          <h3 className="text-xl text-accent">
            We are currently looking for DJs. To apply, sign up and upload a mix
            on your user profile page.
          </h3>
        </main>
      </Layout>
    </div>
  );
}
