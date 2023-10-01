import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function LoginButtons() {
  const { user } = useUser();
  return (
    <button className="primary-button ms-4">
      {user ? (
        <Link href="/api/auth/logout">Logout</Link>
      ) : (
        <Link href="/api/auth/login">Login</Link>
      )}
    </button>
  );
}
