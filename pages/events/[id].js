import React from 'react';
import Layout from 'components/Layout';
import Image from 'next/image';
import replaceHyphens from 'utils/utils';
import admin from 'lib/firebase/server/config';

export default function Page({ event }) {
  if (!event) {
    console.log('Event data is undefined.');
    return <p>No event data available.</p>;
  }

  return (
    <Layout>
      <article className="text-primary flex flex-col space-y-4 p-4 gap-6">
        <section className="flex">
          <div>
            <h1 className="text-8xl">{replaceHyphens(event.title)}</h1>
            <p>{`${event.desc} @${event.venueName}, ${event.venueAddress}`}</p>
          </div>
          <h2 className="ms-auto mt-auto mb-1 text-8xl">{event.date}</h2>
        </section>

        <section className="grid grid-cols-5 gap-8">
          <div className="col-span-2 p-6 text-lg text-justify">
            <p>{event.content}</p>
            <br />
            <p>Protocol. Welcome to the lower level.</p>
          </div>
          {event.imageUrl && (
            <div className="col-span-3 h-96 flex flex-col bg-red-500 border relative p-auto">
              <Image
                src={event.imageUrl}
                fill={true}
                alt="Event image"
                className="object-contain"
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
    console.log('prop data: ', docSnap.data());

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
