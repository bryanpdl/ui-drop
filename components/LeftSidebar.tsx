import { useState, useEffect } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";

interface LeftSidebarProps {
  onImageUpload: (images: string[]) => void;
}

export default function LeftSidebar({ onImageUpload }: LeftSidebarProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages]);
      onImageUpload(newImages);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Prevent body scrolling when the sidebar is open
  useEffect(() => {
    if (!isCollapsed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCollapsed]);

  return (
    <div className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ${isCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
      <div className="relative flex h-full">
        <div className="w-64 bg-[#121213] text-gray-100 p-4 overflow-y-auto">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="block w-full rounded-full text-center py-2 px-4 bg-button-default text-white rounded cursor-pointer hover:bg-button-hover transition-colors duration-300"
          >
            <Camera className="inline-block mt-[-4px] mr-2" size={20} />
            Upload Images
          </label>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                  draggable="true"
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", image)}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="absolute top-1/2 -right-10 transform -translate-y-1/2 bg-button-default text-white p-2 rounded-r-md focus:outline-none hover:bg-button-hover transition-colors duration-300"
        >
          {isCollapsed ? (
            <ChevronRight size={24} />
          ) : (
            <ChevronLeft size={24} />
          )}
        </button>
      </div>
    </div>
  );
}
