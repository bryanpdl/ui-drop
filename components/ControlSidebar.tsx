import { Vector3, Color, Euler, MathUtils } from 'three';
import { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Upload } from 'lucide-react';

interface ControlSidebarProps {
  setEnvironmentPreset: (preset: string) => void;
  setBackgroundColor: (color: string) => void;
  setCameraType: (type: 'perspective' | 'orthographic') => void;
  setEnvironmentIntensity: (intensity: number) => void;
  setEnvironmentRotation: (rotation: number) => void;
  setMockupMaterial: (material: 'glass' | 'platinum' | 'clay light' | 'clay dark') => void;
  setModelPosition: (position: Vector3) => void;
  setModelRotation: (rotation: Euler) => void;
  resetCamera: () => void;
  setBackgroundImage: (imageUrl: string) => void;
  setBackgroundImageFit: (fit: 'fill' | 'fit') => void;
}

export default function ControlSidebar({
  setEnvironmentPreset,
  setBackgroundColor,
  setCameraType,
  setEnvironmentIntensity,
  setEnvironmentRotation,
  setMockupMaterial,
  setModelPosition,
  setModelRotation,
  resetCamera,
  setBackgroundImage,
  setBackgroundImageFit,
}: ControlSidebarProps) {
  const [backgroundType, setBackgroundType] = useState<'solid' | 'linear' | 'radial' | 'image'>('solid');
  const [color1, setColor1] = useState('#CCCCCC');
  const [color2, setColor2] = useState('#4B4B4B');
  const [angle, setAngle] = useState(0);
  const [isPerspective, setIsPerspective] = useState(false);
  const [modelPosition, setLocalModelPosition] = useState({ x: 0, y: 0, z: 0 });
  const [modelRotation, setLocalModelRotation] = useState({ x: 0, y: 0, z: 0 });
  const [backgroundImage, setLocalBackgroundImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backgroundImageFit, setLocalBackgroundImageFit] = useState<'fill' | 'fit'>('fill');

  const [expandedCards, setExpandedCards] = useState({
    background: false,
    environment: false,
    camera: false,
    modelMaterial: false,
    modelOrientation: false, // Changed from modelPosition and modelRotation
  });

  useEffect(() => {
    updateBackground();
  }, [backgroundType, color1, color2, angle, backgroundImage]);

  const updateBackground = () => {
    let backgroundValue: string;
    switch (backgroundType) {
      case 'solid':
        backgroundValue = color1;
        break;
      case 'linear':
        backgroundValue = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        break;
      case 'radial':
        backgroundValue = `radial-gradient(circle, ${color1}, ${color2})`;
        break;
      case 'image':
        backgroundValue = backgroundImage ? `url(${backgroundImage})` : color1;
        break;
    }
    setBackgroundColor(backgroundValue);
  };

  const handleCameraTypeToggle = () => {
    setIsPerspective(!isPerspective);
    setCameraType(isPerspective ? 'orthographic' : 'perspective');
  };

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newPosition = { ...modelPosition, [axis]: value };
    setLocalModelPosition(newPosition);
    setModelPosition(new Vector3(newPosition.x, newPosition.y, newPosition.z));
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newRotation = { ...modelRotation, [axis]: value };
    setLocalModelRotation(newRotation);
    setModelRotation(new Euler(
      MathUtils.degToRad(newRotation.x),
      MathUtils.degToRad(newRotation.y),
      MathUtils.degToRad(newRotation.z)
    ));
  };

  const toggleCard = (cardName: keyof typeof expandedCards) => {
    setExpandedCards(prev => ({ ...prev, [cardName]: !prev[cardName] }));
  };

  const handleBackgroundTypeChange = (type: 'solid' | 'linear' | 'radial' | 'image') => {
    setBackgroundType(type);
    if (type === 'image' && !backgroundImage) {
      fileInputRef.current?.click();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setLocalBackgroundImage(imageUrl);
        setBackgroundImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageFitChange = (fit: 'fill' | 'fit') => {
    setLocalBackgroundImageFit(fit);
    setBackgroundImageFit(fit);
  };

  return (
    <div className="w-64 flex-shrink-0 bg-[#121213] text-gray-100 h-screen overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-white">Scene Controls</h2>
        
        {/* Background Card */}
        <div className="mb-4 bg-[#1F1F1F] rounded-lg overflow-hidden">
          <button 
            className="w-full px-4 py-2 flex justify-between items-center bg-[#3A3A42] hover:bg-gray-600"
            onClick={() => toggleCard('background')}
          >
            <span className="font-bold">Background</span>
            {expandedCards.background ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedCards.background && (
            <div className="p-4">
              <select
                value={backgroundType}
                onChange={(e) => setBackgroundType(e.target.value as 'solid' | 'linear' | 'radial' | 'image')}
                className="w-full bg-[#3A3A42] text-gray-100 rounded-full py-2 px-4 mb-4 appearance-none"
              >
                <option value="solid">Solid</option>
                <option value="linear">Linear Gradient</option>
                <option value="radial">Radial Gradient</option>
                <option value="image">Image</option>
              </select>
              
              {backgroundType === 'image' && (
                <div className="mb-4">
                  <button
                    className="w-full px-3 py-2 bg-button-default text-white rounded-full hover:bg-button-hover transition-colors duration-300 flex items-center justify-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={20} className="mr-2" />
                    Upload Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {backgroundImage && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span>Image Fit:</span>
                        <div className="flex">
                          <button
                            className={`px-2 py-1 text-sm rounded-l ${backgroundImageFit === 'fill' ? 'bg-blue-500' : 'bg-gray-700'}`}
                            onClick={() => handleBackgroundImageFitChange('fill')}
                          >
                            Fill
                          </button>
                          <button
                            className={`px-2 py-1 text-sm rounded-r ${backgroundImageFit === 'fit' ? 'bg-blue-500' : 'bg-gray-700'}`}
                            onClick={() => handleBackgroundImageFitChange('fit')}
                          >
                            Fit
                          </button>
                        </div>
                      </div>
                      <div className="relative w-full h-20">
                        <img
                          src={backgroundImage}
                          alt="Background"
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {backgroundType === 'linear' && (
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Angle: {angle}°</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full bg-gray-700 appearance-none h-2 rounded-full"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Environment Card */}
        <div className="mb-4 bg-[#1F1F1F] rounded-lg overflow-hidden">
          <button 
            className="w-full px-4 py-2 flex justify-between items-center bg-[#3A3A42] hover:bg-gray-600"
            onClick={() => toggleCard('environment')}
          >
            <span className="font-bold">Environment</span>
            <div className="w-5 h-5 flex items-center justify-center">
              {expandedCards.environment ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>
          {expandedCards.environment && (
            <div className="p-4">
              <select
                onChange={(e) => setEnvironmentPreset(e.target.value)}
                className="w-full bg-[#3A3A42] text-gray-100 rounded-full py-2 px-4 mb-2 appearance-none"
              >
                <option value="sunset">Sunset</option>
                <option value="dawn">Dawn</option>
                <option value="night">Night</option>
                <option value="warehouse">Warehouse</option>
                <option value="forest">Forest</option>
                <option value="apartment">Apartment</option>
                <option value="studio">Studio</option>
                <option value="city">City</option>
                <option value="park">Park</option>
                <option value="lobby">Lobby</option>
              </select>
              <label className="block text-sm font-medium mb-1">Intensity</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                onChange={(e) => setEnvironmentIntensity(parseFloat(e.target.value))}
                className="w-full bg-[#3A3A42] appearance-none h-2 rounded-full mb-2"
              />
              <label className="block text-sm font-medium mb-1">Rotation</label>
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.1"
                onChange={(e) => setEnvironmentRotation(parseFloat(e.target.value))}
                className="w-full bg-[#3A3A42] appearance-none h-2 rounded-full"
              />
            </div>
          )}
        </div>

        {/* Camera Card */}
        <div className="mb-4 bg-[#1F1F1F] rounded-lg overflow-hidden">
          <button 
            className="w-full px-4 py-2 flex justify-between items-center bg-[#3A3A42] hover:bg-gray-600"
            onClick={() => toggleCard('camera')}
          >
            <span className="font-bold">Camera</span>
            {expandedCards.camera ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedCards.camera && (
            <div className="p-4">
              <button
                className="w-full px-3 py-2 bg-button-default text-white rounded-full hover:bg-button-hover transition-colors duration-300 mb-2"
                onClick={handleCameraTypeToggle}
              >
                {isPerspective ? 'Perspective' : 'Orthographic'}
              </button>
              <button
                className="w-full px-3 py-2 bg-button-default text-white rounded-full hover:bg-button-hover transition-colors duration-300"
                onClick={resetCamera}
              >
                Reset Camera
              </button>
            </div>
          )}
        </div>

        {/* Model Material Card */}
        <div className="mb-4 bg-[#1F1F1F] rounded-lg overflow-hidden">
          <button 
            className="w-full px-4 py-2 flex justify-between items-center bg-[#3A3A42] hover:bg-gray-600"
            onClick={() => toggleCard('modelMaterial')}
          >
            <span className="font-bold">Model Material</span>
            {expandedCards.modelMaterial ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedCards.modelMaterial && (
            <div className="p-4">
              {['glass', 'platinum', 'clay light', 'clay dark'].map((material) => (
                <button
                  key={material}
                  className="w-full px-3 py-2 bg-button-default text-white rounded-full hover:bg-button-hover transition-colors duration-300 capitalize mb-2"
                  onClick={() => setMockupMaterial(material as 'glass' | 'platinum' | 'clay light' | 'clay dark')}
                >
                  {material}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Model Orientation Card */}
        <div className="mb-4 bg-[#1F1F1F] rounded-lg overflow-hidden">
          <button 
            className="w-full px-4 py-2 flex justify-between items-center bg-[#3A3A42] hover:bg-gray-600"
            onClick={() => toggleCard('modelOrientation')}
          >
            <span className="font-bold">Model Orientation</span>
            {expandedCards.modelOrientation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {expandedCards.modelOrientation && (
            <div className="p-4">
              <h3 className="font-semibold mb-2">Position</h3>
              {['x', 'y', 'z'].map((axis) => (
                <div key={`position-${axis}`} className="flex items-center mb-2">
                  <span className="w-8 text-center">{axis.toUpperCase()}:</span>
                  <input
                    type="range"
                    min="-0.1"
                    max="0.1"
                    step="0.001"
                    value={modelPosition[axis as 'x' | 'y' | 'z']}
                    onChange={(e) => handlePositionChange(axis as 'x' | 'y' | 'z', parseFloat(e.target.value))}
                    className="w-8 flex-grow bg-[#3A3A42] appearance-none h-2 rounded-full mr-2"
                  />
                  <input
                    type="number"
                    value={modelPosition[axis as 'x' | 'y' | 'z']}
                    onChange={(e) => handlePositionChange(axis as 'x' | 'y' | 'z', parseFloat(e.target.value))}
                    step="0.01"
                    className="w-20 bg-[#3A3A42] text-right rounded px-1"
                  />
                </div>
              ))}
              
              <h3 className="font-semibold mt-4 mb-2">Rotation</h3>
              {['x', 'y', 'z'].map((axis) => (
                <div key={`rotation-${axis}`} className="flex items-center mb-2">
                  <span className="w-8 text-center">{axis.toUpperCase()}:</span>
                  <input
                    type="range"
                    min={-30}
                    max={30}
                    step="1"
                    value={modelRotation[axis as 'x' | 'y' | 'z']}
                    onChange={(e) => handleRotationChange(axis as 'x' | 'y' | 'z', parseFloat(e.target.value))}
                    className="w-8 flex-grow bg-[#3A3A42] appearance-none h-2 rounded-full mr-2"
                  />
                  <input
                    type="number"
                    value={modelRotation[axis as 'x' | 'y' | 'z']}
                    onChange={(e) => handleRotationChange(axis as 'x' | 'y' | 'z', parseFloat(e.target.value))}
                    step="1"
                    className="w-20 bg-[#3A3A42] text-right rounded px-1"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
