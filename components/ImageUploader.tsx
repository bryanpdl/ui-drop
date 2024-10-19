import { useState } from "react";

export default function ImageUploader() {
  const [, setImage] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      // Implement image validation and processing here
    }
  };

  return (
    <div
      className="absolute top-4 left-4 w-64 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center"
      onDrop={handleDrop}
      onDragOver={(e: React.DragEvent<HTMLDivElement>) => e.preventDefault()}
    >
      <p>Drag and drop your UI image here</p>
    </div>
  );
}
