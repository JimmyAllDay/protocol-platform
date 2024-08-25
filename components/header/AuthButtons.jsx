'use client';
import React from 'react';
import { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';

import Link from 'next/link';

export default function LoginButtons() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <div className="flex flex-col justify-center">
      {user ? (
        <button onClick={signOut} className="button-primary w-[85px] p-1">
          Logout
        </button>
      ) : (
        <Link href="/auth/login">
          <button className="button-primary w-[85px] p-1">Login</button>
        </Link>
      )}
    </div>
  );
}
