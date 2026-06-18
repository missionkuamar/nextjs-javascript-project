'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function AuthLayout({ children }) {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}