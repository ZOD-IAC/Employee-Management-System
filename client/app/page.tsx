'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const { user, loading } = useAuth();
  console.log(user , '<--- user')
  const router = useRouter();

  useEffect(() => {
    if (!loading) router.push(user ? '/dashboard' : '/login');
  }, [loading, user, router]);

  return null;
}
