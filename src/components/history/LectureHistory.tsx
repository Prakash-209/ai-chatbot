import React from 'react';
import { Clock, FileAudio } from 'lucide-react';
import { Lecture } from '../../types/lecture';
import LectureItem from './LectureItem';

interface LectureHistoryProps {
  lectures: Lecture[];
  onSelectLecture: (lecture: Lecture) => void;
  currentLectureId: string | undefined;
}

const LectureHistory: React.FC<LectureHistoryProps> = ({ 
  lectures, 
  onSelectLecture,
  currentLectureId
}) => {
  if (lectures.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-gray-500 text-sm">No lecture history yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {lectures.map(lecture => (
        <LectureItem 
          key={lecture.id}
          lecture={lecture}
          onSelect={() => onSelectLecture(lecture)}
          isActive={lecture.id === currentLectureId}
        />
      ))}
    </div>
  );
};

export default LectureHistory;