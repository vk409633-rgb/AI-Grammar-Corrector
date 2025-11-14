
import React from 'react';
import { SparklesIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-100 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
            <SparklesIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                AI Grammar Corrector
            </h1>
        </div>
      </div>
    </header>
  );
};
