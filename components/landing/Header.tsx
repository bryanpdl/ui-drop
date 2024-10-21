import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="text-center py-20 px-4">
      <h1 className="text-5xl font-bold mb-6">Create stunning UI mockups in minutes</h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        UI Drop is the easiest way to showcase your designs in beautiful, customizable mockups.
      </p>
      <Link href="/editor" className="bg-button-hover hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 inline-block">
        Get Started
      </Link>
    </header>
  );
}
