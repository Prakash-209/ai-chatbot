import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Copy, Check } from 'lucide-react';

interface TranscriptViewProps {
  transcript: string;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <button onClick={handleCopy} className="btn-outline py-1 px-3 flex items-center gap-1 text-sm">
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
        <button onClick={handleDownload} className="btn-outline py-1 px-3 flex items-center gap-1 text-sm">
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
      
      <div className="overflow-auto max-h-96 p-4 bg-gray-50 rounded-md border border-gray-200">
        <article className="transcript-text prose">
          <ReactMarkdown>{transcript}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default TranscriptView;