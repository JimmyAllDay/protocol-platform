import Layout from 'components/Layout';
import Link from 'next/link';
import { client } from '../../lib/apollo';
import { gql } from '@apollo/client';

export default function Home({ posts }) {
  return (
    <Layout>
      <main className="text-primary flex flex-col">
        <h1 className="text-3xl my-8">Upcoming Events</h1>
        <div className="border-t pt-2 pb-6">
          {posts.map((post) => {
            return (
              <div key={post.title} className="border-b py-4 ps-4">
                <Link
                  href={`events/${post.uri}`}
                  className="hover:text-accent text-8xl"
                >
                  <h3>{post.title}</h3>
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const GET_POSTS = gql`
    query GetAllPosts {
      posts {
        nodes {
          title
          content
          uri
          slug
        }
      }
    }
  `;
  const response = await client.query({ query: GET_POSTS });

  const posts = response?.data?.posts?.nodes || null;
  return {
    props: {
      posts,
    },
  };
}
