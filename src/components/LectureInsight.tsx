import React, { useState, useEffect } from 'react';
import AudioUploader from './upload/AudioUploader';
import TranscriptView from './transcript/TranscriptView';
import QuestionAnswering from './qa/QuestionAnswering';
import { Lecture } from '../types/lecture';
import usePreviousLectures from '../hooks/usePreviousLectures';
import LectureHistory from './history/LectureHistory';
import EmptyState from './common/EmptyState';
import { createClient } from '@supabase/supabase-js';

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const LectureInsight: React.FC = () => {
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { 
    lectures, 
    addLecture, 
    clearHistory 
  } = usePreviousLectures();

  useEffect(() => {
    if (!supabase) {
      setError('Please connect to Supabase to use this application.');
    }
  }, []);

  const handleLectureUpload = async (file: File) => {
    if (!supabase) {
      setError('Supabase connection not available');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-lecture`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Failed to process lecture');
      }

      const { transcription } = await response.json();
      
      const newLecture: Lecture = {
        id: transcription.id,
        title: file.name.replace(/\.[^/.]+$/, ""),
        transcript: transcription.content,
        uploadDate: transcription.created_at,
        duration: 0,
        fileSize: file.size,
        fileType: file.type
      };
      
      setCurrentLecture(newLecture);
      addLecture(newLecture);
    } catch (error) {
      console.error('Error processing file:', error);
      setError('Failed to process the lecture. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectLecture = (lecture: Lecture) => {
    setCurrentLecture(lecture);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
      <div className="lg:w-1/3 space-y-6">
        <section className="card p-4 md:p-6 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Upload Lecture</h2>
          <AudioUploader onUpload={handleLectureUpload} isProcessing={isProcessing} />
        </section>
        
        <section className="card p-4 md:p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">History</h2>
            {lectures.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear All
              </button>
            )}
          </div>
          <LectureHistory 
            lectures={lectures} 
            onSelectLecture={handleSelectLecture} 
            currentLectureId={currentLecture?.id}
          />
        </section>
      </div>
      
      <div className="lg:w-2/3 space-y-6">
        {currentLecture ? (
          <>
            <section className="card p-4 md:p-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Transcript</h2>
              <TranscriptView transcript={currentLecture.transcript} />
            </section>
            
            <section className="card p-4 md:p-6 animate-fade-in">
              <h2 className="text-xl font-semibold mb-4">Ask Questions</h2>
              <QuestionAnswering 
                transcript={currentLecture.transcript}
                transcriptionId={currentLecture.id}
              />
            </section>
          </>
        ) : (
          <section className="card p-8 flex-1 flex items-center justify-center">
            <EmptyState 
              title="No Lecture Selected" 
              description="Upload a lecture recording or select one from your history to view its transcript and ask questions."
            />
          </section>
        )}
      </div>
    </div>
  );
};

export default LectureInsight;