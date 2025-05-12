import React from 'react';
import { FileAudio } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
      <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
        <FileAudio className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-sm">{description}</p>
    </div>
  );
};

export default EmptyState;