'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import Loading from '@/components/common/Loading';

export default function DashboardLayout({ children }) {
  const { user, isLoading } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}