import Layout from 'components/Layout';
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default function Admin({ user }) {
  return (
    console.log(user),
    (
      <Layout>
        <div className="bg-primary h-full text-primary flex flex-col">
          <h1 className="mx-auto mt-10">Admin Panel</h1>
        </div>
      </Layout>
    )
  );
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const session = getSession(context.req, context.res);
    const user = session?.user;
    return {
      props: {
        user: user || null,
      },
    };
  },
});
