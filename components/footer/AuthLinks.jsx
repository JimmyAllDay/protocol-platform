import React from 'react';
import Link from 'next/link';

import { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';

export default function LoginButtons() {
  const { user, error, loading, signOut } = useContext(AuthContext);

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
