import React, { useState } from 'react';
import { Eye, Download, Copy } from 'lucide-react';

interface DockControlsProps {
  onPreview?: () => void;
  onExport?: () => void;
  onCopyToClipboard?: () => void;
}

export default function DockControls({ onPreview, onExport, onCopyToClipboard }: DockControlsProps) {
  const [isExportHovered, setIsExportHovered] = useState(false);

  const handleDockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#121213] rounded-full h-[72px] px-4 flex items-center justify-center shadow-lg gap-4"
      onClick={handleDockClick}
    >
      <button
        className="w-12 h-12 bg-button-default rounded-full flex items-center justify-center hover:bg-button-hover transition-colors duration-300"
        onClick={onPreview}
        title="Preview"
      >
        <Eye size={24} color="white" />
      </button>
      <button
        className="w-12 h-12 bg-button-default rounded-full flex items-center justify-center hover:bg-button-hover transition-colors duration-300"
        onClick={onCopyToClipboard}
        title="Copy to Clipboard"
      >
        <Copy size={24} color="white" />
      </button>
      <button
        className="h-12 bg-white text-black rounded-full flex items-center justify-center px-6 hover:text-white hover:bg-button-hover transition-colors duration-300"
        onClick={onExport}
        onMouseEnter={() => setIsExportHovered(true)}
        onMouseLeave={() => setIsExportHovered(false)}
        title="Export"
      >
        <Download 
          size={20} 
          color={isExportHovered ? "white" : "black"} 
          className="mr-2 transition-colors duration-300"
        />
        <span className="font-semibold">Export</span>
      </button>
    </div>
  );
}
