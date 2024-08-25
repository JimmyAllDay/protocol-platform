import React, { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from 'context/AuthContext';

export default function AuthLinks() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <li className="w-[70px]">
      {user ? (
        <button
          onClick={signOut}
          className="hover:text-white dark:hover:text-accentDark"
        >
          Logout
        </button>
      ) : (
        <Link
          href="/auth/login"
          className="hover:text-white dark:hover:text-accentDark"
        >
          <button className="">Login</button>
        </Link>
      )}
    </li>
  );
}
