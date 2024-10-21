"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import Link from 'next/link';
import { getUserProjects } from '@/firebase/firestore';

// Mock data for preset scenes
const presetScenes = {
  Phone: [
    { id: 'phone-1', name: 'Phone 1', imageUrl: '/phone-scene-preview.png' },
    { id: 'phone-2', name: 'Phone 2', imageUrl: '/phone-scene-preview-2.png' },
    { id: 'phone-3', name: 'Phone 3', imageUrl: '/phone-scene-preview-3.png' },
  ],
  Tablet: [
    { id: 'tablet-1', name: 'Tablet 1', imageUrl: '/tablet-scene-preview.png' },
    { id: 'tablet-2', name: 'Tablet 2', imageUrl: '/tablet-scene-preview-2.png' },
  ],
  Laptop: [
    { id: 'laptop-1', name: 'Laptop 1', imageUrl: '/laptop-scene-preview.png' },
    { id: 'laptop-2', name: 'Laptop 2', imageUrl: '/laptop-scene-preview-2.png' },
  ]
};

// Mock data for user projects (this would typically come from a database)
const userProjects = {
  Phone: [
    
  ],
  Tablet: [

  ],
  Laptop: [
   
  ]
};

export default function DashboardPage() {
  const router = useRouter();
  const [activeMockupCategory, setActiveMockupCategory] = useState('Phone');
  const [activeProjectCategory, setActiveProjectCategory] = useState('Phone');
  const [user, setUser] = useState<any>(null);
  const [userProjectsState, setUserProjects] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        fetchUserProjects(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProjects = async (userId: string) => {
    try {
      const projects = await getUserProjects(userId);
      setUserProjects(projects);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderSceneGrid = (scenes: any[], isUserProject: boolean) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {scenes.map((scene) => (
        <Link href={`/editor?scene=${isUserProject ? scene.id : scene.id}`} key={scene.id}>
          <div className="relative bg-[#2A2A2A] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            <img 
              src={scene.imageUrl || '/default-project-image.jpg'} 
              alt={scene.name} 
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity duration-300 flex items-center justify-center">
              <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg font-semibold mb-1">{scene.name}</h3>
                <p className="text-sm">{isUserProject ? 'Edit project' : 'Use this mockup'}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>  );

  return (
    <div className="min-h-screen bg-[#121213] text-white">
      <nav className="bg-[#1F1F1F] py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold mr-6">uidrop.</Link>
        </div>
        {user ? (
          <button
            onClick={handleSignOut}
            className="bg-black hover:bg-white hover:text-black font-bold py-2 px-4 rounded-full transition-colors duration-300"
          >
            Sign Out
          </button>
        ) : (
          <Link href="/" className="bg-button-hover hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
            Sign In
          </Link>
        )}
      </nav>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Mockups</h2>
          <div className="mb-4">
            {Object.keys(presetScenes).map((category) => (
              <button
                key={category}
                onClick={() => setActiveMockupCategory(category)}
                className={`mr-4 px-4 py-2 rounded-full ${
                  activeMockupCategory === category
                    ? 'bg-button-hover text-white'
                    : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {renderSceneGrid(presetScenes[activeMockupCategory as keyof typeof presetScenes], false)}
        </section>

        {user && (
          <section>
            <h2 className="text-3xl font-bold mb-6">My Projects</h2>
            <div className="mb-4">
              {Object.keys(userProjects).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveProjectCategory(category)}
                  className={`mr-4 px-4 py-2 rounded-full ${
                    activeProjectCategory === category
                      ? 'bg-button-hover text-white'
                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            {userProjectsState.length > 0 ? (
              renderSceneGrid(userProjectsState.filter(project => project.category === activeProjectCategory), true)
            ) : (
              <p className="text-gray-400">No projects in this category yet.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
