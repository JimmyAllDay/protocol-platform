//* Public Page
import React, { useEffect, useState } from 'react';
import { db } from 'lib/firebase/client/config';
import { collection, getDocs } from 'firebase/firestore';
import Layout from 'components/Layout';
import Link from 'next/link';
import replaceHyphens from 'utils/utils';

//TODO: You might want to fetch the events on the server here and possibly cache them

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

  // Get current date
  const currentDate = new Date();

  // Separate past and future events
  const pastEvents = events?.filter(
    (event) => new Date(event.date) < currentDate
  );
  const futureEvents = events?.filter(
    (event) => new Date(event.date) >= currentDate
  );

  return (
    <Layout>
      <main className="flex flex-col">
        <h1 className="text-lg my-8 ps-2 sm:ps-4 md:text-xl lg:text-3xl">
          Events
        </h1>
        <div className="pt-2 pb-6 flex flex-col h-screen">
          {events && events.length === 0 ? (
            <div className="text-primaryDark ps-4 text-xl md:text-3xl mx-auto">
              Upcoming events will be announced soon
            </div>
          ) : (
            <>
              {futureEvents && futureEvents.length > 0 && (
                <div>
                  <h2 className="text-lg md:text-xl lg:text-xl ps-8">Future</h2>
                  <div className="w-full h-full border-t border-border dark:border-borderDark">
                    {futureEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`events/${event.id}`}
                        className="hover:text-primaryDark flex w-full text-xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl link"
                      >
                        <div className="border-b border-border dark:border-borderDark py-1 px-2 sm:px-4 md:px-6 flex w-full">
                          <h3 className="max-w-content flex-grow">
                            {event.title}
                          </h3>
                          <h3 className="mt-auto ms-auto me-4">
                            {replaceHyphens(event.date) || null}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {pastEvents && pastEvents.length > 0 && (
                <div>
                  <h2 className="text-lg md:text-xl lg:text-xl ps-8">Past</h2>
                  <div className="w-full h-full border-t border-border dark:border-borderDark">
                    {pastEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`events/${event.id}`}
                        className="hover:text-primaryDark flex w-full text-xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl link"
                      >
                        <div className="border-b border-border dark:border-borderDark py-1 px-2 sm:px-4 md:px-6 flex w-full">
                          <h3 className="max-w-content flex-grow">
                            {event.title}
                          </h3>
                          <h3 className="mt-auto ms-auto me-4">
                            {replaceHyphens(event.date) || null}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
