//* Public Page
import React from 'react';
import Layout from 'components/Layout';
import Image from 'next/image';
import replaceHyphens from 'utils/utils';
import admin from 'lib/firebase/server/config';

export default function Page({ event }) {
  if (!event) {
    return <p>No event data available.</p>;
  }

  return (
    <Layout>
      <article className="flex flex-col space-y-4 p-6 gap-6">
        <section className="grid grid-cols-2 ps-2">
          <h1 className="col-span-1 text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            {event.title}
          </h1>

          <h2 className="col-span-1 ms-auto mb-auto text-xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            {replaceHyphens(event.date)}
          </h2>
          <p className="col-span-2 md:ms-2">{event.desc}</p>
          <p className="col-span-2 md:ms-2">{event.venueName}</p>
          <p className="col-span-2 md:ms-2">{event.venueAddress}</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-1 text-md md:text-lg text-justify space-y-6 order-2 md:order-1 p-2">
            <p>{event.content}</p>
            <p>Pro.ground. The lower level.</p>
          </div>
          {event.imageUrl && (
            <div className="col-span-1 h-96 relative order-1 md:order-2">
              <Image
                src={event.imageUrl}
                fill={true}
                alt="Event image"
                className="object-contain object-top"
              />
            </div>
          )}
        </section>
      </article>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  console.log('route params: ', id);
  const docRef = admin.firestore().doc(`events/${id}`);

  try {
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return { notFound: true };
    }

    return {
      props: {
        event: {
          id: docSnap.id,
          ...docSnap.data(),
        },
      },
    };
  } catch (error) {
    console.error('Error fetching event:', error);
    return { props: { event: null } };
  }
}
