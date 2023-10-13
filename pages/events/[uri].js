import { client } from '../../lib/apollo';
import { gql } from '@apollo/client';
import Layout from 'components/Layout';

export default function Page({ post }) {
  console.log(post);
  return (
    <Layout>
      <main className="text-primary flex flex-col space-y-4 p-4">
        <h1 className="text-8xl">{post?.title}</h1>
        <div className="flex">
          <div>
            <p>{post?.tags.nodes[2].name}</p>
            <p>{post?.tags.nodes[0].name}</p>
          </div>
          <p className="text-4xl ms-auto">{post?.tags.nodes[1].name}</p>
        </div>

        <article
          className="border"
          dangerouslySetInnerHTML={{ __html: post?.content }}
        ></article>
      </main>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const GET_POST_BY_URI = gql`
    query GetPostByURI($id: ID!) {
      post(id: $id, idType: URI) {
        title
        content
        date
        uri
        slug
        tags {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            uri
          }
        }
      }
    }
  `;
  const response = await client.query({
    query: GET_POST_BY_URI,
    variables: {
      id: params.uri,
    },
  });
  console.log(response);
  const post = response?.data?.post;
  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const paths = [];
  return {
    paths,
    fallback: 'blocking',
  };
}
