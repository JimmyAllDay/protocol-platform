import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function LoginButtons() {
  const { user } = useUser();
  return (
    <button className="border border-accent px-3  rounded-md text-accent bg-accent bg-opacity-20 hover:bg-opacity-30">
      {user ? (
        <Link href="/api/auth/logout">Logout</Link>
      ) : (
        <Link href="/api/auth/login">Login</Link>
      )}
    </button>
  );
}
