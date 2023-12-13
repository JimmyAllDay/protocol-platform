import Layout from 'components/Layout';
import Image from 'next/image';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from 'utils/mongodb';
import replaceHyphens from 'utils/utils';

export default function Page({ event }) {
  console.log('event page props: ', event);
  return (
    console.log('event date: ', typeof event.date),
    (
      <Layout>
        <article className="text-primary flex flex-col space-y-4 p-4 gap-6">
          <section className="flex">
            <div>
              <h1 className="text-8xl">{replaceHyphens(event?.title)}</h1>
              <p>{`${event?.desc} @${event?.venueName}, ${event?.venueAddress}`}</p>
            </div>
            <h2 className="ms-auto mt-auto mb-1 text-8xl">{event?.date}</h2>
          </section>

          <section className="grid grid-cols-5 gap-8">
            <div className="col-span-2 border p-6 text-lg text-justify">
              <p>{event?.content}</p>
              <br />
              <p>Protocol. We are the underground.</p>
            </div>
            <div className="col-span-3 h-96 flex flex-col bg-red-500 border relative p-auto">
              <Image
                src={event.imageUrl}
                fill={true}
                alt=""
                className="object-contain"
              />
            </div>
          </section>
        </article>
      </Layout>
    )
  );
}

export async function getServerSideProps(context) {
  const { client, db } = await connectToDatabase();
  const eventId = context.params.uri;
  try {
    const event = await db
      .collection('events')
      .findOne({ _id: new ObjectId(eventId) });
    console.log('serverSideProps: ', event);
    return {
      props: { event: JSON.parse(JSON.stringify(event)) },
    };
  } catch (error) {
    console.error('Server error');
  }
}
