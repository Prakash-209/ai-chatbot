import { useState, useEffect } from 'react';
import { Lecture } from '../types/lecture';

const LOCAL_STORAGE_KEY = 'lecture-insight-history';

const usePreviousLectures = () => {
  const [lectures, setLectures] = useState<Lecture[]>(() => {
    // Initialize from localStorage if available
    const savedLectures = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedLectures) {
      try {
        return JSON.parse(savedLectures);
      } catch (error) {
        console.error('Failed to parse lectures from localStorage:', error);
        return [];
      }
    }
    return [];
  });
  
  // Save to localStorage whenever lectures change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(lectures));
  }, [lectures]);
  
  const addLecture = (lecture: Lecture) => {
    setLectures(prev => {
      // Check if lecture with same ID already exists
      const exists = prev.some(l => l.id === lecture.id);
      if (exists) {
        // Replace the existing lecture
        return prev.map(l => l.id === lecture.id ? lecture : l);
      }
      // Add new lecture at the beginning of the array
      return [lecture, ...prev];
    });
  };
  
  const removeLecture = (id: string) => {
    setLectures(prev => prev.filter(lecture => lecture.id !== id));
  };
  
  const clearHistory = () => {
    setLectures([]);
  };
  
  return {
    lectures,
    addLecture,
    removeLecture,
    clearHistory,
  };
};

export default usePreviousLectures;