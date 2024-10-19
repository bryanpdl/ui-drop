"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useCallback } from "react";
import Scene from "@/components/Scene";
import ControlSidebar from "@/components/ControlSidebar";
import LeftSidebar from "@/components/LeftSidebar";
import DockControls from "@/components/DockControls";
import { Vector3, Texture, Euler } from "three";

type EnvironmentPreset = "apartment" | "city" | "dawn" | "forest" | "lobby" | "night" | "park" | "studio" | "sunset" | "warehouse";

export default function Home() {
  const [cameraPosition, setCameraPosition] = useState(new Vector3(0, 0, 0.20));
  const [ambientLightIntensity] = useState(0.0);
  const [directionalLightIntensity] = useState(10.0);
  const [directionalLightPosition] = useState(new Vector3(2, 2, 2));
  const [environmentPreset, setEnvironmentPreset] = useState<EnvironmentPreset>("sunset");
  const [backgroundColor, setBackgroundColor] = useState<string>("#1E1E1E");
  const [cameraType, setCameraType] = useState<'perspective' | 'orthographic'>('orthographic');
  const [environmentIntensity, setEnvironmentIntensity] = useState(1);
  const [environmentRotation, setEnvironmentRotation] = useState(0);
  const [mockupMaterial, setMockupMaterial] = useState<'glass' | 'platinum' | 'clay light' | 'clay dark'>('glass');
  const [modelPosition, setModelPosition] = useState(new Vector3(0, 0, 0));
  const [modelRotation, setModelRotation] = useState(new Euler(0, 0, 0));
  const [backgroundImageFit, setBackgroundImageFit] = useState<'fill' | 'fit'>('fill');

  // Perspective camera settings
  const perspectiveRotationLimit = Math.PI / 6; // 30 degrees
  const perspectiveMinZoom = 0.15;
  const perspectiveMaxZoom = 0.25;
  const perspectivePanLimit = 0.05;

  // Orthographic camera settings
  const orthoRotationLimit = Math.PI / 6; // 30 degrees
  const orthoMinZoom = 3000;
  const orthoMaxZoom = 8000;
  const orthoPanLimit = 0.1;

  const handleBackgroundColorChange = useCallback((color: string) => {
    setBackgroundColor(color);
  }, []);

  const handleImageUpload = useCallback((newImages: string[]) => {
    console.log("New images uploaded:", newImages);
  }, []);

  const handleScreenDrop = useCallback((texture: Texture) => {
    console.log("Screen texture updated:", texture);
  }, []);

  const handlePreview = useCallback(() => {
    // Implement preview functionality here
    console.log("Preview button clicked");
  }, []);

  const handleExport = useCallback(() => {
    // Implement export functionality here
    console.log("Export button clicked");
  }, []);

  const handleCopyToClipboard = useCallback(() => {
    // Implement copy to clipboard functionality here
    console.log("Copy to Clipboard button clicked");
    // You might want to capture the current state of the scene or specific data
    // and copy it to the clipboard using the Clipboard API
  }, []);

  const handleBackgroundImageChange = useCallback((imageUrl: string) => {
    console.log("Background image changed:", imageUrl);
  }, []);

  const resetCamera = useCallback(() => {
    if (cameraType === 'perspective') {
      // Reset to default perspective camera position
      setCameraPosition(new Vector3(0, 0, 0.25));
    } else {
      // Reset to default orthographic camera position
      setCameraPosition(new Vector3(0, 0, 5));
    }
    // You might also want to reset other camera-related states here
    // For example, resetting zoom, rotation, etc.
  }, [cameraType]);

  return (
    <div className="flex h-screen overflow-hidden">
      <LeftSidebar onImageUpload={handleImageUpload} />
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
                onScreenDrop={handleScreenDrop}
              />
            </Suspense>
          </Canvas>
          <DockControls 
            onPreview={handlePreview} 
            onExport={handleExport} 
            onCopyToClipboard={handleCopyToClipboard}
          />
        </div>
      </div>
      <ControlSidebar 
        setEnvironmentPreset={(preset: EnvironmentPreset) => setEnvironmentPreset(preset)}
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
      />
    </div>
  );
}
