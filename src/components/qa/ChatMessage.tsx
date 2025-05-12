import React from 'react';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser, timestamp }) => {
  return (
    <div className={`flex gap-3 animate-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-secondary-700" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'bg-primary-100 text-primary-900' : 'bg-white border border-gray-200 text-gray-800'} p-3 rounded-lg shadow-sm`}>
        <p className="whitespace-pre-wrap">{message}</p>
        <div className={`text-xs mt-1 ${isUser ? 'text-primary-700' : 'text-gray-500'}`}>
          {formatTime(timestamp)}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-primary-700" />
        </div>
      )}
    </div>
  );
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default ChatMessage;