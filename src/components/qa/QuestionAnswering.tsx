import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ChatMessage from './ChatMessage';
import TypingIndicator from '../common/TypingIndicator';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface QuestionAnsweringProps {
  transcript: string;
  transcriptionId: string;
}

const QuestionAnswering: React.FC<QuestionAnsweringProps> = ({ transcript, transcriptionId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsProcessing(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ask-question`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question,
            transcriptionId
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const { answer } = await response.json();
      
      const aiMessage: Message = {
        id: uuidv4(),
        type: 'ai',
        content: answer,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing question:', error);
      // Handle error appropriately
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-center">
              Ask questions about the lecture content to get insights and clarifications.
            </p>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isUser={message.type === 'user'}
              timestamp={message.timestamp}
            />
          ))
        )}
        
        {isProcessing && <TypingIndicator />}
        
        <div id="chat-end" />
      </div>
      
      <form onSubmit={handleSendQuestion} className="mt-auto flex gap-2">
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask a question about the lecture..."
          className="input flex-1"
          disabled={isProcessing}
        />
        <button 
          type="submit" 
          className="btn-primary"
          disabled={!question.trim() || isProcessing}
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default QuestionAnswering;