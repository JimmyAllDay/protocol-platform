import React, { useEffect, useState } from 'react';
import { db } from 'lib/firebase/client/config';
import { collection, getDocs } from 'firebase/firestore';
import Layout from 'components/Layout';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function Events() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setEvents(eventData);
    };

    fetchEvents();
  }, []);

  return (
    console.log(events),
    (
      <Layout>
        <main className="text-primary flex flex-col">
          <h1 className="text-3xl my-8 ps-4">Upcoming Events</h1>
          <div className="pt-2 pb-6 flex flex-col items-center justify-center h-screen">
            {events !== false || events.length !== 0 ? (
              <div className="text-accent ps-4 text-3xl mx-auto">
                Upcoming events will be announced soon
              </div>
            ) : (
              events?.map((post) => {
                return (
                  <Link
                    key={post.title}
                    href={`events/${post.id}`}
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
                );
              })
            )}
          </div>
        </main>
      </Layout>
    )
  );
}
