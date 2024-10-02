'use client';
import React from 'react';
import { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';
import { useHCaptcha } from 'context/HCaptchaContext';
import showToast from 'utils/toastUtils';
import getErrorMessage from 'utils/getErrorMessage';

import Link from 'next/link';

export default function LoginButtons() {
  const { user, signOut } = useContext(AuthContext);
  const { resetCaptcha } = useHCaptcha();

  function handleLogOut() {
    try {
      signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
      const message = getErrorMessage(error);
      showToast(message, 'error');
    } finally {
      resetCaptcha();
    }
  }

  return (
    <div className="flex flex-col justify-center">
      {user ? (
        <button onClick={handleLogOut} className="button-primary w-[85px] p-1">
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
