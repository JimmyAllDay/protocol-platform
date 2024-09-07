import React, { useEffect, useState } from 'react';
import { db } from 'lib/firebase/client/config';
import { collection, getDocs } from 'firebase/firestore';
import Layout from 'components/Layout';
import Link from 'next/link';
import { toast } from 'react-toastify';
import replaceHyphens from 'utils/utils';

//* sm (Small screens): 640px
//* md (Medium screens): 768px
//* lg (Large screens): 1024px
//* xl (Extra large screens): 1280px
//* 2xl (Double extra large screens): 1536px

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
    <Layout>
      <main className="flex flex-col">
        <h1 className="text-lg my-8 ps-2 sm:ps-4 md:text-xl lg:text-3xl">
          Upcoming Events
        </h1>
        <div className="pt-2 pb-6 flex flex-col items-center justify-center h-screen">
          {events && events.length === 0 ? (
            <div className="text-primaryDark ps-4 text-xl md:text-3xl mx-auto">
              Upcoming events will be announced soon
            </div>
          ) : (
            <div className="w-full h-full border-t border-border dark:border-borderDark">
              {events?.map((event) => {
                return (
                  <Link
                    key={event.title}
                    href={`events/${event.id}`}
                    className="hover:text-primaryDark flex w-full text-xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
                  >
                    <div className="border-b border-border dark:border-borderDark py-1 px-2 sm:px-4 md:px-6 flex w-full">
                      <h3 className="max-w-content flex-grow">{event.title}</h3>
                      <h3 className="mt-auto ms-auto me-4">
                        {replaceHyphens(event.date) || null}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
