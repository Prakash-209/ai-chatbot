import React from 'react';
import { BrainCog } from 'lucide-react';
import AppLayout from './components/layout/AppLayout';
import LectureInsight from './components/LectureInsight';

function App() {
  return (
    <AppLayout>
      <header className="w-full bg-white border-b border-gray-200 px-4 py-4 md:py-6">
        <div className="container mx-auto flex items-center">
          <BrainCog className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Lecture Insight</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <LectureInsight />
      </main>
      
      <footer className="w-full bg-gray-100 border-t border-gray-200 py-4 px-4">
        <div className="container mx-auto text-center text-gray-600 text-sm">
          <p>© 2025 Lecture Insight. All rights reserved.</p>
        </div>
      </footer>
    </AppLayout>
  );
}

export default App;