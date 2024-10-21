import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, category: string) => void;
  initialName?: string;
}

export default function SaveProjectModal({ isOpen, onClose, onSave, initialName = '' }: SaveProjectModalProps) {
  const [projectName, setProjectName] = useState(initialName);
  const [category, setCategory] = useState('Phone');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(projectName, category);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#1F1F1F] p-8 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Save Project</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-300">Project Name</label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-button-hover"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-[#2A2A2A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-button-hover"
            >
              <option value="Phone">Phone</option>
              <option value="Tablet">Tablet</option>
              <option value="Laptop">Laptop</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-button-hover hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
            Save "{projectName}"
          </button>
        </form>
      </div>
    </div>
  );
}
