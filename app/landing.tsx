import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Header from '@/components/landing/Header';
import Features from '@/components/landing/Features';
import Pricing from '@/components/landing/Pricing';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#121213] text-white">
      <Navbar />
      <Header />
      <Features />
      <Pricing />
    </div>
  );
}
