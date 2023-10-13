import Layout from 'components/Layout';
import Link from 'next/link';
import { client } from '../../lib/apollo';
import { gql } from '@apollo/client';

export default function Events({ posts }) {
  return (
    <Layout>
      <main className="text-primary flex flex-col">
        <h1 className="text-3xl my-8 ps-4">Upcoming Events</h1>
        <div className="border-t pt-2 pb-6">
          {posts.map((post) => {
            return (
              console.log(post.uri),
              (
                <Link
                  key={post.title}
                  href={`events/${post.uri}`}
                  className="hover:text-accent flex"
                >
                  <div className="border-b py-4 ps-4 flex w-full">
                    <h3 className="text-8xl max-w-content flex-grow">
                      {post.title}
                    </h3>
                    <div className=" flex flex-col ms-auto flex-shrink whitespace-nowrap overflow-hidde me-8">
                      <h3 className="mt-auto ms-auto">
                        {post?.tags?.nodes[2]?.name || null}
                      </h3>
                      <h3 className="mb-4">
                        {post?.tags?.nodes[0]?.name || null}
                      </h3>
                    </div>

                    <h3 className="mt-auto mb-2 text-8xl flex-shrink">
                      {post?.tags?.nodes[1]?.name}
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

export async function getStaticProps() {
  const GET_POSTS = gql`
    query GetAllPosts {
      posts {
        nodes {
          title
          slug
          uri
          tags {
            nodes {
              name
            }
          }
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
