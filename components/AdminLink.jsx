import React from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function AdminLink() {
  const { user, isLoading } = useUser();
  if (user)
    return (
      <div className="flex ml-2 hover:text-accent">
        <Link href="/admin" className="my-auto">
          <h2>Admin</h2>
        </Link>
      </div>
    );
}
