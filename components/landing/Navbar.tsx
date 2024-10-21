import React, { useState } from 'react';
import Link from 'next/link';
import SignInModal from './SignInModal';
import SignUpModal from './SignUpModal';

export default function Navbar() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const openSignInModal = () => {
    setIsSignInModalOpen(true);
    setIsSignUpModalOpen(false);
  };

  const openSignUpModal = () => {
    setIsSignUpModalOpen(true);
    setIsSignInModalOpen(false);
  };

  const closeModals = () => {
    setIsSignInModalOpen(false);
    setIsSignUpModalOpen(false);
  };

  return (
    <>
      <nav className="bg-[#1F1F1F] py-4 px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">uidrop</Link>
        <div>
          <button 
            onClick={openSignInModal}
            className="bg-button-default hover:bg-button-hover text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 mr-4"
          >
            Sign In
          </button>
          <button 
            onClick={openSignUpModal}
            className="bg-button-hover hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
          >
            Sign Up
          </button>
        </div>
      </nav>
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={closeModals} 
        onSignUpClick={openSignUpModal}
      />
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={closeModals} 
        onSignInClick={openSignInModal}
      />
    </>
  );
}
