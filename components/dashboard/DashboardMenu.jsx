import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { MdOutlineEventNote } from 'react-icons/md';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { FaUsers } from 'react-icons/fa';
import { IoTicketSharp } from 'react-icons/io5';
import { MdOutlineViewKanban } from 'react-icons/md';
import { RiUserSharedLine } from 'react-icons/ri';

export default function DashMenu() {
  const router = useRouter();

  const dashButtons = [
    { name: 'Overview', icon: <MdOutlineViewKanban />, href: '/dashboard' },
    { name: 'Events', icon: <MdOutlineEventNote />, href: '/dashboard/events' },
    {
      name: 'Products',
      icon: <AiOutlineShoppingCart />,
      href: '/dashboard/products',
    },
    { name: 'Patrons', icon: <RiUserSharedLine />, href: '/dashboard/patrons' },
    { name: 'Users', icon: <FaUsers />, href: '/dashboard/users' },
  ];

  return (
    <div className="border-e border-t border-b border-accent bg-accent bg-opacity-10 h-screen p-4 flex flex-col space-y-4">
      {dashButtons.map((button, i) => {
        return (
          <Link
            key={`dashboard-link-${i}`}
            href={button.href}
            className={`text-accent border-2 border-accent bg-accent bg-opacity-10 rounded flex flex-col items-center justify-center p-2 hover:cursor-pointer hover:bg-opacity-20 ${
              router.pathname === button.href && 'bg-opacity-30'
            }`}
          >
            <h1 className="text-3xl">{button.icon}</h1>
            <p className="text-sm">{button.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
