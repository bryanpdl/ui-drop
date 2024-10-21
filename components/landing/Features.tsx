import React from 'react';
import { Camera, Layers, Zap } from 'lucide-react';

const features = [
  {
    icon: <Camera size={48} />,
    title: 'Easy Image Upload',
    description: 'Drag and drop your designs directly into the mockup.',
  },
  {
    icon: <Layers size={48} />,
    title: 'Customizable Mockups',
    description: 'Choose from various materials and adjust every aspect of your mockup.',
  },
  {
    icon: <Zap size={48} />,
    title: 'Instant Preview',
    description: 'See your changes in real-time with our instant preview feature.',
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4 bg-[#1F1F1F]">
      <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-[#2A2A2A] p-6 rounded-lg text-center">
            <div className="text-button-hover mb-4 flex justify-center">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
