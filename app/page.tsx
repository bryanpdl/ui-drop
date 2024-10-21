"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/config';
import LandingPage from './landing';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, redirect to the editor
        router.push('/editor');
      }
    });

    return () => unsubscribe();
  }, [router]);

  // If not authenticated, show the landing page
  return <LandingPage />;
}
