import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
        <span className="w-5 h-5 flex items-center justify-center">
          <span className="processing-wave">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </span>
        </span>
      </div>
      <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-sm max-w-[80%]">
        <div className="processing-wave">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;