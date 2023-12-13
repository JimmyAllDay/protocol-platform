import Layout from 'components/Layout';
import Link from 'next/link';
import { use, useState } from 'react';
import { toast } from 'react-toastify';
import { connectToDatabase } from 'utils/mongodb';

export default function Events({ posts }) {
  return (
    <Layout>
      <main className="text-primary flex flex-col">
        <h1 className="text-3xl my-8 ps-4">Upcoming Events</h1>
        <div className="border-t pt-2 pb-6">
          {posts.map((post) => {
            return (
              console.log(post),
              (
                <Link
                  key={post.title}
                  href={`events/${post._id}`}
                  className="hover:text-accent flex"
                >
                  <div className="border-b py-4 ps-4 flex w-full">
                    <h3 className="text-8xl max-w-content flex-grow">
                      {post.title}
                    </h3>
                    <div className=" flex flex-col ms-auto flex-shrink whitespace-nowrap overflow-hidde me-8">
                      <h3 className="mt-auto ms-auto">{post.tags || null}</h3>
                    </div>
                    <h3 className="mt-auto ms-auto text-8xl">
                      {post.date || null}
                    </h3>
                  </div>
                </Link>
              )
            );
          })}
        </div>
      </main>
    </Layout>
  );
}

export async function getServerSideProps() {
  const { client, db } = await connectToDatabase();
  try {
    const events = await db.collection('events').find({}).toArray();

    return {
      props: { posts: JSON.parse(JSON.stringify(events)) },
    };
  } catch (error) {
    console.error('Server error');
  }
}
