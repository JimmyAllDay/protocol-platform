import React from 'react';
import Link from 'next/link';

import { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';

export default function AdminLink() {
  const { user } = useContext(AuthContext);
  if (user && user.isAdmin)
    return (
      <div className="flex ml-2 hover:text-accent">
        <Link href="/admin" className="my-auto">
          <h2>Admin</h2>
        </Link>
      </div>
    );
}
