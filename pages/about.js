//* Public Page
import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function About() {
  return (
    <Layout>
      <div className="min-h-full grid grid-cols-2 p-4 gap-y-36">
        <div className="col-span-2 flex flex-col order-1 space-y-10 mt-36 p-6">
          <h1 className="mx-auto text-6xl font-medium col-span-2">About Us</h1>
          <p className="mx-auto text-3xl text-center max-w-xl ">
            We’re a small start-up with big plans. We collaborate with DJs,
            bars, clubs, and of course, our heroes - the people who attend our
            events.
          </p>
        </div>

        <div className="text-center flex flex-col col-span-2 order-2 p-6 lg:col-span-1 lg:p-14">
          <h3 className="text-3xl mx-auto">Our Mission</h3>
          <p className="mt-10 ms-auto text-lg max-w-xl mx-auto">
            Our mission is to leverage the power of technology and music to
            touch the world, and shape it for a more equitable, free and
            prosperous future.
          </p>
        </div>
        <div className="text-center flex flex-col col-span-2 order-3 mb-48 p-6 lg:col-span-1 lg:order-2 lg:p-14">
          <h3 className="text-3xl mx-auto">Our Values</h3>
          <p className="mt-10 me-auto text-lg max-w-xl mx-auto">
            We lionise all music. And particularly hip hop, drum and bass, and
            house, and their myriad sub-genres. We believe music and technology
            unite people, and our project focuses on just that: uniting people
            through music and technology. We also believe in working to produce
            a better future for everyone, even those we don’t know and will
            never meet. That’s why we donate a significant portion of our
            earnings to{' '}
            <Link
              href="https://www.thelifeyoucansave.org.au/best-charities/"
              className="text-accent hover:text-accent2 dark:text-accent2Dark dark:hover:text-accentDark"
            >
              the most effective charities
            </Link>
            .
          </p>
        </div>
      </div>
    </Layout>
  );
}
