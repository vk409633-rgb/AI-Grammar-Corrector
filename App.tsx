
import React from 'react';
import { Editor } from './components/Editor';
import { Header } from './components/Header';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-200 font-sans text-text-primary">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Editor />
      </main>
      <footer className="text-center py-4 text-text-secondary text-sm">
        <p>Powered by Gemini API</p>
        <p>Contact: <a href="mailto:vk409633@gmail.com" className="text-primary hover:underline">vk409633@gmail.com</a></p>
      </footer>
    </div>
  );
};

export default App;
