import { client } from '../../lib/apollo';
import { gql } from '@apollo/client';
import Layout from 'components/Layout';

export default function SlugPage({ post }) {
  return (
    <Layout>
      <main className="text-primary">
        <h1 className="text-8xl">{post?.title}</h1>
        <p>
          {`${post?.author.node.firstName} ${post?.author.node.lastName}`} |
          &nbsp;{new Date(post?.date).toLocaleDateString()}
        </p>

        <article dangerouslySetInnerHTML={{ __html: post?.content }}></article>
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
        author {
          node {
            firstName
            lastName
          }
        }
        slug
      }
    }
  `;
  const response = await client.query({
    query: GET_POST_BY_URI,
    variables: {
      id: params.uri,
    },
  });
  const post = response?.data?.post;
  console.log(post);
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
