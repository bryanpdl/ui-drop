import { OrbitControls, Environment, PerspectiveCamera, OrthographicCamera } from "@react-three/drei";
import PhoneMockup from "./PhoneMockup";
import { Vector3, Camera, Color, Euler } from "three";
import { useRef, useEffect, useState, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EnvironmentPreset } from '@/app/editor/presets';


interface SceneProps {
  cameraPosition: Vector3;
  perspectiveRotationLimit: number;
  perspectiveMinZoom: number;
  perspectiveMaxZoom: number;
  perspectivePanLimit: number;
  orthoRotationLimit: number;
  orthoMinZoom: number;
  orthoMaxZoom: number;
  orthoPanLimit: number;
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  directionalLightPosition: Vector3;
  environmentPreset: EnvironmentPreset;
  backgroundColor: string;
  cameraType: 'perspective' | 'orthographic';
  environmentIntensity: number;
  environmentRotation: number;
  mockupMaterial: 'glass' | 'platinum' | 'clay light' | 'clay dark';
  modelPosition: Vector3;
  modelRotation: Euler;
  screenImage: string | null;
  onScreenDrop: (texture: THREE.Texture) => void;
  backgroundImageFit: 'fill' | 'fit';
}

export default function Scene({
  cameraPosition,
  perspectiveRotationLimit,
  perspectiveMinZoom,
  perspectiveMaxZoom,
  perspectivePanLimit,
  orthoRotationLimit,
  orthoMinZoom,
  orthoMaxZoom,
  orthoPanLimit,
  ambientLightIntensity,
  directionalLightIntensity,
  directionalLightPosition,
  environmentPreset,
  backgroundColor,
  cameraType,
  environmentIntensity,
  environmentRotation,
  mockupMaterial,
  modelPosition,
  modelRotation,
  screenImage,
  onScreenDrop,
  backgroundImageFit,
}: SceneProps) {
  const { gl, scene } = useThree();
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const controlsRef = useRef<any>(null);
  const perspectiveCameraRef = useRef<THREE.PerspectiveCamera>(null);
  const orthographicCameraRef = useRef<THREE.OrthographicCamera>(null);
  const [activeCamera, setActiveCamera] = useState<Camera | null>(null);
  const [screenTexture, setScreenTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (cameraType === 'perspective' && perspectiveCameraRef.current) {
      setActiveCamera(perspectiveCameraRef.current);
    } else if (cameraType === 'orthographic' && orthographicCameraRef.current) {
      setActiveCamera(orthographicCameraRef.current);
    }
  }, [cameraType]);

  const backgroundTexture = useMemo(() => {
    if (typeof backgroundColor === 'string') {
      if (backgroundColor.startsWith('linear-gradient')) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const context = canvas.getContext('2d')!;
        
        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        const colors = backgroundColor.match(/#[a-fA-F0-9]{6}/g) || [];
        
        colors.forEach((color, index) => {
          gradient.addColorStop(index / (colors.length - 1), color);
        });
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
      } else if (backgroundColor.startsWith('url(')) {
        const imageUrl = backgroundColor.slice(4, -1).replace(/['"]/g, '');
        const texture = new THREE.TextureLoader().load(imageUrl, () => {
          // Texture loaded callback
          updateTextureScale();
        });
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        return texture;
      } else if (backgroundColor.startsWith('radial-gradient')) {
        // Handle gradients (keep existing gradient logic)
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const context = canvas.getContext('2d')!;
        
        if (backgroundColor.startsWith('linear-gradient')) {
          const angle = parseFloat(backgroundColor.match(/\d+deg/)![0]);
          const colors = backgroundColor.match(/#[a-fA-F0-9]{6}/g) || [];
          
          const gradient = context.createLinearGradient(
            canvas.width / 2 - Math.cos(angle * Math.PI / 180) * canvas.width / 2,
            canvas.height / 2 - Math.sin(angle * Math.PI / 180) * canvas.height / 2,
            canvas.width / 2 + Math.cos(angle * Math.PI / 180) * canvas.width / 2,
            canvas.height / 2 + Math.sin(angle * Math.PI / 180) * canvas.height / 2
          );
          
          colors.forEach((color, index) => {
            gradient.addColorStop(index / (colors.length - 1), color);
          });
          
          context.fillStyle = gradient;
        } else {
          const colors = backgroundColor.match(/#[a-fA-F0-9]{6}/g) || [];
          const gradient = context.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
          );
          
          colors.forEach((color, index) => {
            gradient.addColorStop(index / (colors.length - 1), color);
          });
          
          context.fillStyle = gradient;
        }
        
        context.fillRect(0, 0, canvas.width, canvas.height);
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
      } else {
        return new THREE.Color(backgroundColor);
      }
    }
    return null;
  }, [backgroundColor]);

  const updateTextureScale = () => {
    if (backgroundTexture instanceof THREE.Texture && backgroundTexture.image) {
      const aspect = gl.domElement.width / gl.domElement.height;
      const imageAspect = backgroundTexture.image.width / backgroundTexture.image.height;

      if (backgroundImageFit === 'fill') {
        backgroundTexture.repeat.set(1, 1);
        backgroundTexture.offset.set(0, 0);
      } else { // 'fit'
        if (aspect > imageAspect) {
          backgroundTexture.repeat.set(1, imageAspect / aspect);
          backgroundTexture.offset.set(0, (1 - imageAspect / aspect) / 2);
        } else {
          backgroundTexture.repeat.set(aspect / imageAspect, 1);
          backgroundTexture.offset.set((1 - aspect / imageAspect) / 2, 0);
        }
      }
      backgroundTexture.needsUpdate = true;
    }
  };

  useEffect(() => {
    if (backgroundTexture instanceof THREE.Texture) {
      scene.background = backgroundTexture;
      if (backgroundTexture.image) {
        updateTextureScale();
      }
    } else if (backgroundTexture instanceof THREE.Color) {
      scene.background = backgroundTexture;
    }

    const handleResize = () => {
      updateTextureScale();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [backgroundTexture, backgroundImageFit, scene, gl]);

  useEffect(() => {
    if (controlsRef.current && activeCamera) {
      const controls = controlsRef.current;

      const rotationLimit = cameraType === 'perspective' ? perspectiveRotationLimit : orthoRotationLimit;
      controls.minPolarAngle = Math.PI / 2 - rotationLimit;
      controls.maxPolarAngle = Math.PI / 2 + rotationLimit;
      controls.minAzimuthAngle = -rotationLimit;
      controls.maxAzimuthAngle = rotationLimit;

      if (cameraType === 'perspective') {
        controls.minDistance = perspectiveMinZoom;
        controls.maxDistance = perspectiveMaxZoom;
      } else {
        controls.minZoom = orthoMinZoom;
        controls.maxZoom = orthoMaxZoom;
      }

      controls.enablePan = true;
      controls.panSpeed = 0.5;
      controls.screenSpacePanning = true;

      const originalHandlePanDelta = controls.handlePanDelta;
      controls.handlePanDelta = (deltaX: number, deltaY: number, ...args: any[]) => {
        const panLimit = cameraType === 'perspective' ? perspectivePanLimit : orthoPanLimit;
        const xPanLimit = panLimit;
        const yPanLimit = panLimit;

        const newPanOffset = controls.getPanOffset();
        newPanOffset.x = Math.max(-xPanLimit, Math.min(xPanLimit, newPanOffset.x - deltaX * controls.panSpeed));
        newPanOffset.y = Math.max(-yPanLimit, Math.min(yPanLimit, newPanOffset.y + deltaY * controls.panSpeed));
        
        originalHandlePanDelta.call(controls, deltaX, deltaY, ...args);
        
        controls.target.z = 0;
        if (activeCamera) {
          activeCamera.position.z = cameraPosition.z;
        }
      };

      controls.target.set(0, 0, 0);
      controls.update();
    }
  }, [cameraType, perspectiveRotationLimit, perspectiveMinZoom, perspectiveMaxZoom, perspectivePanLimit, 
      orthoRotationLimit, orthoMinZoom, orthoMaxZoom, orthoPanLimit, activeCamera, cameraPosition]);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  useEffect(() => {
    // Set the clear color of the renderer to transparent
    gl.setClearColor(0x000000, 0);
  }, [gl]);

  useEffect(() => {
    if (screenImage) {
      const loader = new THREE.TextureLoader();
      loader.load(screenImage, (texture) => {
        setScreenTexture(texture);
      });
    }
  }, [screenImage]);

  return (
    <>
      {activeCamera && (
        <OrbitControls
          ref={controlsRef}
          makeDefault
          camera={activeCamera}
          domElement={gl.domElement}
        />
      )}
      <PerspectiveCamera
        ref={perspectiveCameraRef}
        makeDefault={cameraType === 'perspective'}
        position={cameraPosition}
        near={0.01}
        far={1000}
      />
      <OrthographicCamera
        ref={orthographicCameraRef}
        makeDefault={cameraType === 'orthographic'}
        position={[0, 0, 5]}  // Adjusted initial position
        zoom={5000}  // Adjusted initial zoom
        near={0.01}
        far={1000}
      />
      <Environment 
        preset={environmentPreset as any} 
        background={false}  // Ensure this is false to not override the background
      />
      <group rotation={[0, environmentRotation, 0]}>
        <ambientLight intensity={ambientLightIntensity * environmentIntensity} />
        <directionalLight
          ref={directionalLightRef}
          position={directionalLightPosition}
          intensity={directionalLightIntensity * environmentIntensity}
          castShadow
        />
      </group>
      <group position={modelPosition} rotation={modelRotation}>
        <PhoneMockup material={mockupMaterial} onScreenDrop={onScreenDrop} />
      </group>
    </>
  );
}
