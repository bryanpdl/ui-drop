import { useGLTF } from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import { Mesh, TextureLoader, MeshPhysicalMaterial, MeshStandardMaterial, Color, Texture, DoubleSide, Group } from "three";
import * as THREE from "three";

interface PhoneMockupProps {
  material: 'glass' | 'platinum' | 'clay light' | 'clay dark';
  onScreenDrop: (texture: Texture) => void;
}

export default function PhoneMockup({ material, onScreenDrop }: PhoneMockupProps) {
  const [uiTexture, setUiTexture] = useState<THREE.Texture | null>(null);
  const { scene } = useGLTF("/models/phone-model.gltf");
  const [phoneBody, setPhoneBody] = useState<Mesh | null>(null);
  const [screen, setScreen] = useState<Mesh | null>(null);
  const groupRef = useRef<Group>(null);

  useEffect(() => {
    console.log("Loaded GLTF scene:", scene);
    scene.traverse((child) => {
      console.log("Child:", child.name, child.type);
      if (child instanceof THREE.Mesh) {
        if (child.name === "PhoneBody") {
          console.log("PhoneBody found:", child);
          setPhoneBody(child);
        }
        if (child.name === "Screen") {
          console.log("Screen found:", child);
          setScreen(child);
          // Remove the screen from the original scene
          child.removeFromParent();
        }
      }
    });
  }, [scene]);

  useEffect(() => {
    if (phoneBody) {
      let newMaterial;
      switch (material) {
        case 'glass':
          newMaterial = new MeshPhysicalMaterial({
            color: new Color(0xFFFFFF),
            metalness: 0.0,
            roughness: 0.0,  // Reduced roughness for a smoother surface
            transmission: 1.0,  // Full transmission for transparency
            thickness: 0.25,  // Adjust this value to control glass thickness
            ior: 1.5,  // Index of refraction for glass (typically between 1.4 and 1.7)
            reflectivity: 0.25,  // Slight reflectivity
            clearcoat: 1.0,  // Add clearcoat for extra shine
            clearcoatRoughness: 0.25,
            transparent: true,
            opacity: 0.99,  // Adjust opacity as needed
            side: DoubleSide,
          });
          break;
        case 'platinum':
          newMaterial = new MeshStandardMaterial({
            color: new Color(0xD9D9D9),
            metalness: 1.0,
            roughness: 0.24,
            side: DoubleSide,
          });
          break;
        case 'clay light':
          newMaterial = new MeshPhysicalMaterial({
            color: new Color(0xA1A1A1), // Light gray color
            metalness: 0.0,
            roughness: 0.95,
            reflectivity: 0.0,
            clearcoat: 0.1,
            clearcoatRoughness: 0.9,
            opacity: 1.0,
            side: DoubleSide,
          });
          break;
        case 'clay dark':
          newMaterial = new MeshPhysicalMaterial({
            color: new Color(0x272727), // Dark gray color
            metalness: 0.0,
            roughness: 0.95,
            reflectivity: 0.0,
            clearcoat: 0.1,
            clearcoatRoughness: 0.9,
            opacity: 1.0,
            side: DoubleSide,
          });
          break;
      }
      phoneBody.material = newMaterial;
    }
  }, [phoneBody, material]);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      console.log("Drop event triggered");
      const imageUrl = e.dataTransfer?.getData("text/plain");
      if (imageUrl) {
        console.log("Image URL:", imageUrl);
        new TextureLoader().load(imageUrl, (texture) => {
          console.log("Texture loaded:", texture);
          texture.flipY = true; // Set this to false as we've corrected the UV in Blender
          setUiTexture(texture);
          onScreenDrop(texture);
        });
      }
    };

    const canvas = document.querySelector("canvas");
    canvas?.addEventListener("dragover", handleDragOver);
    canvas?.addEventListener("drop", handleDrop);

    return () => {
      canvas?.removeEventListener("dragover", handleDragOver);
      canvas?.removeEventListener("drop", handleDrop);
    };
  }, [onScreenDrop]);

  if (!phoneBody || !screen) {
    return null;
  }

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      {screen && (
        <mesh
          geometry={screen.geometry}
          position={screen.position}
          rotation={screen.rotation}
          scale={screen.scale}
        >
          <meshBasicMaterial 
            map={uiTexture} 
            transparent={true}
            opacity={1}
            side={DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload("/models/phone-model.gltf");
