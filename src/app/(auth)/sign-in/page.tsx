'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';

const LoginButton: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <button disabled>Loading...</button>;
  }

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Sign out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Sign in
    </button>
  );
};

export default LoginButton;
