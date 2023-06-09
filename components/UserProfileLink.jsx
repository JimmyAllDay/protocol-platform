import { useUser } from '@auth0/nextjs-auth0/client';
import { FaRegUserCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function Profile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <div className="flex ms-10 my-auto">
        <h2>Hi, {user.nickname}</h2>
        <div className="mx-auto text-2xl text-accent2 bg-accent2 bg-opacity-30 hover:bg-opacity-50 rounded-xl hover:bg-accent2 ms-2">
          <Link href="/profile">
            <FaRegUserCircle />
          </Link>
        </div>
      </div>
    )
  );
}
