import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { correctGrammar } from '../services/geminiService';
import { StyleOption } from '../types';
import { ProFeatures } from './ProFeatures';
import { AdModal } from './AdModal';
import { CheckCircleIcon, ClipboardIcon, LoadingSpinner, WarningIcon } from './IconComponents';

const TextStats: React.FC<{ text: string }> = ({ text }) => {
  const characters = text.length;
  const words = text.match(/\b\w+\b/g)?.length || 0;

  return (
    <div className="flex justify-end items-center gap-4 text-xs text-text-secondary mt-2 px-1">
      <span>{characters} characters</span>
      <span className="h-3 w-px bg-base-300"></span>
      <span>{words} words</span>
    </div>
  );
};

export const Editor: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [styleOption, setStyleOption] = useState<StyleOption>(StyleOption.Standard);
  const [copied, setCopied] = useState(false);

  // New state for ad-based unlock
  const [isProUnlocked, setIsProUnlocked] = useState<boolean>(false);
  const [showAdModal, setShowAdModal] = useState<boolean>(false);

  const debouncedInputText = useDebounce(inputText, 1000);

  const handleCorrection = useCallback(async () => {
    if (!debouncedInputText.trim()) {
      setOutputText('');
      setExplanation(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // API call now depends on both isPro and isProUnlocked
      const result = await correctGrammar(debouncedInputText, isPro && isProUnlocked, styleOption);
      setOutputText(result.correctedText);
      setExplanation(result.explanation);
    } catch (err: any)
    {
      setError(err.message || 'An unknown error occurred.');
      setOutputText('');
      setExplanation(null);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedInputText, isPro, isProUnlocked, styleOption]);

  useEffect(() => {
    handleCorrection();
  }, [handleCorrection]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handlers for the Ad Modal
  const handleUnlockProRequest = () => {
    setShowAdModal(true);
  };
  
  const handleAdComplete = () => {
    setIsProUnlocked(true);
    setIsPro(true); // Automatically turn on Pro mode after unlocking
    setShowAdModal(false);
  };

  const handleAdClose = () => {
    setShowAdModal(false);
  }

  return (
    <>
      {showAdModal && <AdModal onAdComplete={handleAdComplete} onClose={handleAdClose} />}
      <div className="bg-base-100 p-4 sm:p-6 rounded-2xl shadow-lg w-full max-w-6xl mx-auto">
        <ProFeatures
          isPro={isPro}
          setIsPro={setIsPro}
          styleOption={styleOption}
          setStyleOption={setStyleOption}
          isProUnlocked={isProUnlocked}
          onUnlockProRequest={handleUnlockProRequest}
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Text Area */}
          <div>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Start writing or paste your text here..."
                className="w-full h-96 p-4 border-2 border-base-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition duration-200 resize-none text-base text-text-primary bg-base-200 placeholder-text-secondary"
                aria-label="Input text for grammar correction"
              />
            </div>
            <TextStats text={inputText} />
          </div>

          {/* Output Text Area */}
          <div>
            <div className="relative bg-secondary p-4 rounded-xl border-2 border-primary/30 h-96 overflow-y-auto">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl z-10">
                        <LoadingSpinner />
                    </div>
                )}
                {error && !isLoading && (
                     <div className="flex flex-col items-center justify-center h-full text-red-600">
                        <WarningIcon className="w-12 h-12 mb-4" />
                        <p className="font-semibold">Oops! Something went wrong.</p>
                        <p className="text-sm text-center">{error}</p>
                    </div>
                )}
                {!isLoading && !error && outputText && (
                    <>
                        <p className="text-text-primary whitespace-pre-wrap">{outputText}</p>
                        <button 
                            onClick={handleCopyToClipboard}
                            className="absolute top-3 right-3 p-2 rounded-full bg-base-100 hover:bg-base-300 transition"
                            aria-label="Copy corrected text to clipboard"
                        >
                            {copied ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <ClipboardIcon className="w-5 h-5 text-text-secondary" />}
                        </button>
                    </>
                )}
                 {!isLoading && !error && !outputText && !debouncedInputText && (
                    <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                        <p>Your corrected text will appear here.</p>
                    </div>
                )}
            </div>
            {!isLoading && !error && debouncedInputText.trim() && <TextStats text={outputText} />}
          </div>
        </div>
        {isPro && isProUnlocked && explanation && !isLoading && (
          <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
              <h3 className="text-lg font-semibold text-primary mb-2">Explanation of Changes</h3>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: explanation.replace(/•/g, '<br>•') }}></div>
          </div>
        )}
      </div>
    </>
  );
};