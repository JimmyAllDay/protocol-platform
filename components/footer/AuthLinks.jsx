import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function LoginButtons() {
  const { user } = useUser();
  return (
    <div className="hover:text-accent">
      {user ? (
        <Link href="/api/auth/logout">Logout</Link>
      ) : (
        <Link href="/api/auth/login">Login</Link>
      )}
    </div>
  );
}
