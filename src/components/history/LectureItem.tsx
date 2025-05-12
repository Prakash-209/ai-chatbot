import React from 'react';
import { FileAudio } from 'lucide-react';
import { Lecture } from '../../types/lecture';

interface LectureItemProps {
  lecture: Lecture;
  onSelect: () => void;
  isActive: boolean;
}

const LectureItem: React.FC<LectureItemProps> = ({ lecture, onSelect, isActive }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };
  
  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(1) + ' MB';
  };
  
  return (
    <button 
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-md transition-all duration-200 ${
        isActive 
          ? 'bg-primary-50 border border-primary-200' 
          : 'hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <FileAudio className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="font-medium text-gray-900 truncate">
              {lecture.title}
            </h4>
            <span className="flex-shrink-0 text-xs text-gray-500">
              {formatDate(lecture.uploadDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
            <span>{formatDuration(lecture.duration)}</span>
            <span>•</span>
            <span>{formatFileSize(lecture.fileSize)}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default LectureItem;