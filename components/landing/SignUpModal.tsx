import React, { useState } from 'react';
import { X } from 'lucide-react';
import { auth } from '@/firebase/config';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignInClick: () => void;
}

export default function SignUpModal({ isOpen, onClose, onSignInClick }: SignUpModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      setError('Failed to create an account. Please try again.');
      console.error('Sign up error:', error);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      setError('Failed to sign up with Google.');
      console.error('Google sign up error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1F1F1F] p-8 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-button-hover"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-button-hover"
              required
            />
          </div>
          <button type="submit" className="w-full bg-button-hover hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
            Sign Up
          </button>
        </form>
        <div className="mt-4">
          <button onClick={handleGoogleSignUp} className="w-full bg-white text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center">
            <img src="/google-icon.png" alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button onClick={onSignInClick} className="text-button-hover hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  );
}
