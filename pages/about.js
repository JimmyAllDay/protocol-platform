import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function About() {
  return (
    <Layout>
      <div className="bg-primary min-h-full flex flex-col">
        <h1 className="mx-auto text-primary mt-20 text-7xl font-medium">
          About Us
        </h1>
        <p className="mx-auto text-primary mt-28 text-3xl max-w-2xl text-center">
          We’re a small start-up with big plans. We collaborate with DJs, bars,
          clubs, and of course, our heroes - the people who attend our events.
        </p>
        <div className="flex w-full text-primary mt-28 gap-28">
          <div className="text-center w-1/2 flex flex-col">
            <h3 className="text-3xl w-1/2 ms-auto">Our Mission</h3>
            <p className="mt-10 w-1/2 ms-auto text-lg">
              Our mission is to leverage the power of technology and music to
              touch the world, and shape it for a more equitable, free and
              prosperous future.
            </p>
          </div>
          <div className="text-center w-1/2 flex flex-col">
            <h3 className="text-3xl w-1/2 me-auto">Our Values</h3>
            <p className="mt-10 w-1/2 me-auto text-lg">
              We lionise all music. And particularly hip hop, drum and bass, and
              house, and their myriad sub-genres. We believe music and
              technology unite people, and our project focuses on just that:
              uniting people through music and technology. We also believe in
              working to produce a better future for everyone, even those we
              don’t know and will never meet. That’s why we donate a significant
              portion of our earnings to{' '}
              <Link
                href="/charities"
                className="text-accent2 hover:text-accent"
              >
                the most effective charities
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
