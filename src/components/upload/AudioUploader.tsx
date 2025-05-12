import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileAudio, AlertCircle } from 'lucide-react';
import ProgressIndicator from '../common/ProgressIndicator';

interface AudioUploaderProps {
  onUpload: (file: File) => void;
  isProcessing: boolean;
}

const ACCEPTED_FILE_TYPES = {
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
  'audio/x-m4a': ['.m4a'],
  'audio/mp4': ['.m4a'],
  'audio/x-wav': ['.wav'],
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/ogg': ['.ogv'],
  'video/quicktime': ['.mov'],
};

const AudioUploader: React.FC<AudioUploaderProps> = ({ onUpload, isProcessing }) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  const simulateProgress = useCallback(() => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, []);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    const cleanup = simulateProgress();
    onUpload(file);
    
    return () => cleanup();
  }, [onUpload, simulateProgress]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    disabled: isProcessing,
  });
  
  return (
    <div className="space-y-4">
      <div 
        {...getRootProps({ 
          className: `dropzone ${isDragActive ? 'dropzone-active' : ''} ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}` 
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-3">
          {isDragActive ? (
            <>
              <FileAudio className="w-12 h-12 text-primary-500 animate-bounce-slow" />
              <p className="text-primary-600 font-medium">Drop the file here</p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-400" />
              <p className="text-gray-600 font-medium">Drag & drop an audio/video file or click to browse</p>
              <p className="text-gray-500 text-sm">Supports MP3, WAV, M4A, MP4, WebM, MOV</p>
            </>
          )}
        </div>
      </div>
      
      {uploadError && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-50 rounded-md">
          <AlertCircle className="w-5 h-5" />
          <span>{uploadError}</span>
        </div>
      )}
      
      {isProcessing && (
        <div className="animate-fade-in">
          <ProgressIndicator progress={uploadProgress} />
          <p className="text-center text-sm text-gray-600 mt-3">
            Processing your lecture... This may take a few moments.
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;