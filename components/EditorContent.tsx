"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase/config';
import Scene from "@/components/Scene";
import ControlSidebar from "@/components/ControlSidebar";
import LeftSidebar from "@/components/LeftSidebar";
import DockControls from "@/components/DockControls";
import { Vector3, Texture, Euler } from "three";
import SignInModal from '@/components/landing/SignInModal';
import { saveProject, updateProject, ProjectData } from '@/firebase/firestore';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import SaveProjectModal from '@/components/SaveProjectModal';
import Toast from '@/components/Toast';
import { PHONE_1_PRESET, EnvironmentPreset } from '@/app/editor/presets';
// ... (rest of your imports)

export default function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sceneId = searchParams.get('scene');

  // ... (rest of your component code)

  // State variables
  const [cameraPosition, setCameraPosition] = useState(new Vector3(0, 0, 0.20));
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.0);
  const [directionalLightIntensity, setDirectionalLightIntensity] = useState(10.0);
  const [directionalLightPosition, setDirectionalLightPosition] = useState(new Vector3(2, 2, 2));
  const [environmentPreset, setEnvironmentPreset] = useState<EnvironmentPreset>("sunset");
  const [backgroundColor, setBackgroundColor] = useState<string>("#1E1E1E");
  const [cameraType, setCameraType] = useState<'perspective' | 'orthographic'>('orthographic');
  const [environmentIntensity, setEnvironmentIntensity] = useState(1);
  const [environmentRotation, setEnvironmentRotation] = useState(0);
  const [mockupMaterial, setMockupMaterial] = useState<'glass' | 'platinum' | 'clay light' | 'clay dark'>('glass');
  const [modelPosition, setModelPosition] = useState(new Vector3(0, 0, 0));
  const [modelRotation, setModelRotation] = useState(new Euler(0, 0, 0));
  const [backgroundImageFit, setBackgroundImageFit] = useState<'fill' | 'fit'>('fill');
  const [user, setUser] = useState<User | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('My Project');
  const [screenImage, setScreenImage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Camera settings
  const perspectiveRotationLimit = Math.PI / 6;
  const perspectiveMinZoom = 0.15;
  const perspectiveMaxZoom = 0.25;
  const perspectivePanLimit = 0.05;
  const orthoRotationLimit = Math.PI / 6;
  const orthoMinZoom = 3000;
  const orthoMaxZoom = 8000;
  const orthoPanLimit = 0.1;

  // Handlers
  const handleBackgroundColorChange = useCallback((color: string) => {
    setBackgroundColor(color);
  }, []);

  const handleImageUpload = useCallback((newImages: string[]) => {
    console.log("New images uploaded:", newImages);
  }, []);

  const handleScreenDrop = useCallback((texture: Texture) => {
    console.log("Screen texture updated:", texture);
    setScreenImage(texture.image.src);
  }, []);

  const handlePreview = useCallback(() => {
    setIsPreviewMode(prev => !prev);
  }, []);

  const handleExport = useCallback(() => {
    console.log("Export button clicked");
  }, []);

  const handleCopyToClipboard = useCallback(() => {
    console.log("Copy to Clipboard button clicked");
  }, []);

  const handleBackgroundImageChange = useCallback((imageUrl: string) => {
    console.log("Background image changed:", imageUrl);
  }, []);

  const resetCamera = useCallback(() => {
    if (cameraType === 'perspective') {
      setCameraPosition(new Vector3(0, 0, 0.25));
    } else {
      setCameraPosition(new Vector3(0, 0, 5));
    }
  }, [cameraType]);

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSignIn = () => {
    setIsSignInModalOpen(true);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (sceneId && user) {
      loadProject(sceneId);
    }
  }, [sceneId, user]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isPreviewMode) {
        setIsPreviewMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreviewMode]);

  const loadProject = async (projectId: string) => {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      if (projectDoc.exists()) {
        const projectData = projectDoc.data() as ProjectData;
        setCameraPosition(new Vector3(projectData.sceneData.cameraPosition.x, projectData.sceneData.cameraPosition.y, projectData.sceneData.cameraPosition.z));
        setAmbientLightIntensity(projectData.sceneData.ambientLightIntensity);
        setDirectionalLightIntensity(projectData.sceneData.directionalLightIntensity);
        setDirectionalLightPosition(new Vector3(projectData.sceneData.directionalLightPosition.x, projectData.sceneData.directionalLightPosition.y, projectData.sceneData.directionalLightPosition.z));
        setEnvironmentPreset(projectData.sceneData.environmentPreset as EnvironmentPreset);
        setBackgroundColor(projectData.sceneData.backgroundColor);
        setCameraType(projectData.sceneData.cameraType);
        setEnvironmentIntensity(projectData.sceneData.environmentIntensity);
        setEnvironmentRotation(projectData.sceneData.environmentRotation);
        setMockupMaterial(projectData.sceneData.mockupMaterial);
        setModelPosition(new Vector3(projectData.sceneData.modelPosition.x, projectData.sceneData.modelPosition.y, projectData.sceneData.modelPosition.z));
        setModelRotation(new Euler(projectData.sceneData.modelRotation.x, projectData.sceneData.modelRotation.y, projectData.sceneData.modelRotation.z));
        setBackgroundImageFit(projectData.sceneData.backgroundImageFit);
        setScreenImage(projectData.sceneData.screenImage);
        setProjectId(projectId);
        setProjectName(projectData.name);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const handleSaveClick = () => {
    if (!user) {
      setIsSignInModalOpen(true);
      return;
    }

    if (projectId) {
      // If projectId exists, it's an existing project, so update it directly
      handleUpdateProject();
    } else {
      // If no projectId, it's a new project, so open the save modal
      setIsSaveModalOpen(true);
    }
  };

  const handleUpdateProject = async () => {
    if (!user || !projectId) return;

    const projectData: Partial<ProjectData> = {
      sceneData: {
        cameraPosition: { x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z },
        ambientLightIntensity,
        directionalLightIntensity,
        directionalLightPosition: { x: directionalLightPosition.x, y: directionalLightPosition.y, z: directionalLightPosition.z },
        environmentPreset,
        backgroundColor,
        cameraType,
        environmentIntensity,
        environmentRotation,
        mockupMaterial,
        modelPosition: { x: modelPosition.x, y: modelPosition.y, z: modelPosition.z },
        modelRotation: { x: modelRotation.x, y: modelRotation.y, z: modelRotation.z },
        backgroundImageFit,
        screenImage,
      },
    };

    try {
      await updateProject(projectId, projectData);
      setToastMessage('Project updated successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Error updating project:', error);
      setToastMessage('Error updating project');
      setShowToast(true);
    }
  };

  const handleSaveProject = async (name: string, category: string) => {
    if (!user) return;

    const projectData: ProjectData = {
      userId: user.uid,
      name,
      category,
      sceneData: {
        cameraPosition: { x: cameraPosition.x, y: cameraPosition.y, z: cameraPosition.z },
        ambientLightIntensity,
        directionalLightIntensity,
        directionalLightPosition: { x: directionalLightPosition.x, y: directionalLightPosition.y, z: directionalLightPosition.z },
        environmentPreset,
        backgroundColor,
        cameraType,
        environmentIntensity,
        environmentRotation,
        mockupMaterial,
        modelPosition: { x: modelPosition.x, y: modelPosition.y, z: modelPosition.z },
        modelRotation: { x: modelRotation.x, y: modelRotation.y, z: modelRotation.z },
        backgroundImageFit,
        screenImage,
      },
    };

    try {
      const newProjectId = await saveProject(user, projectData);
      setProjectId(newProjectId);
      setProjectName(name);
      setIsSaveModalOpen(false);
      setToastMessage('Project saved successfully');
      setShowToast(true);
    } catch (error) {
      console.error('Error saving project:', error);
      setToastMessage('Error saving project');
      setShowToast(true);
    }
  };

  useEffect(() => {
    // Load the preset when the component mounts or when sceneId changes
    if (sceneId === 'phone-1') {
      setBackgroundColor(PHONE_1_PRESET.backgroundColor);
      setEnvironmentPreset(PHONE_1_PRESET.environmentPreset);
      setCameraType(PHONE_1_PRESET.cameraType);
      setMockupMaterial(PHONE_1_PRESET.mockupMaterial);
      setModelPosition(PHONE_1_PRESET.modelPosition);
      setModelRotation(PHONE_1_PRESET.modelRotation);
    }
  }, [sceneId]);


  return (
    // ... (your existing JSX)
    <div className="flex h-screen overflow-hidden">
      {!isPreviewMode && <LeftSidebar onImageUpload={handleImageUpload} />}
      <div className="flex-grow relative overflow-hidden">
        <div className="absolute inset-0 scene-container">
          <Canvas>
            <Suspense fallback={null}>
              <Scene 
                cameraPosition={cameraPosition}
                perspectiveRotationLimit={perspectiveRotationLimit}
                perspectiveMinZoom={perspectiveMinZoom}
                perspectiveMaxZoom={perspectiveMaxZoom}
                perspectivePanLimit={perspectivePanLimit}
                orthoRotationLimit={orthoRotationLimit}
                orthoMinZoom={orthoMinZoom}
                orthoMaxZoom={orthoMaxZoom}
                orthoPanLimit={orthoPanLimit}
                ambientLightIntensity={ambientLightIntensity}
                directionalLightIntensity={directionalLightIntensity}
                directionalLightPosition={directionalLightPosition}
                environmentPreset={environmentPreset}
                backgroundColor={backgroundColor}
                backgroundImageFit={backgroundImageFit}
                cameraType={cameraType}
                environmentIntensity={environmentIntensity}
                environmentRotation={environmentRotation}
                mockupMaterial={mockupMaterial}
                modelPosition={modelPosition}
                modelRotation={modelRotation}
                screenImage={screenImage}
                onScreenDrop={handleScreenDrop}
              />
            </Suspense>
          </Canvas>
          {!isPreviewMode && (
            <DockControls 
              onPreview={handlePreview}
              onExport={handleExport}
              onCopyToClipboard={handleCopyToClipboard}
              isPreviewMode={isPreviewMode}
            />
          )}
        </div>
      </div>
      {!isPreviewMode && (
        <ControlSidebar 
          setEnvironmentPreset={setEnvironmentPreset}
          setBackgroundColor={handleBackgroundColorChange}
          setCameraType={setCameraType}
          setEnvironmentIntensity={setEnvironmentIntensity}
          setEnvironmentRotation={setEnvironmentRotation}
          setMockupMaterial={setMockupMaterial}
          setModelPosition={setModelPosition}
          setModelRotation={setModelRotation}
          resetCamera={resetCamera}
          setBackgroundImage={handleBackgroundImageChange}
          setBackgroundImageFit={setBackgroundImageFit}
          onDashboardClick={handleDashboardClick}
          onSignOut={handleSignOut}
          onSignIn={handleSignIn}
        />
      )}
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
        onSignUpClick={() => {}} // You can implement sign-up functionality if needed
      />
      {!isPreviewMode && (
        <button 
          onClick={handleSaveClick} 
          className="absolute bottom-4 right-4 bg-button-hover hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
        >
          {projectId ? 'Update Project' : 'Save Project'}
        </button>
      )}
      <SaveProjectModal 
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveProject}
        initialName={projectName}
      />
      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
