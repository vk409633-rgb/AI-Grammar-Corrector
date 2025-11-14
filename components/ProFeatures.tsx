import React from 'react';
import { StyleOption } from '../types';
import { SparklesIcon, LockClosedIcon } from './IconComponents';

interface ProFeaturesProps {
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
  styleOption: StyleOption;
  setStyleOption: (style: StyleOption) => void;
  isProUnlocked: boolean;
  onUnlockProRequest: () => void;
}

export const ProFeatures: React.FC<ProFeaturesProps> = ({
  isPro,
  setIsPro,
  styleOption,
  setStyleOption,
  isProUnlocked,
  onUnlockProRequest,
}) => {
  const styles = Object.values(StyleOption);

  const handleToggleClick = () => {
    if (isPro) {
      setIsPro(false); // Always allow turning Pro off
    } else if (isProUnlocked) {
      setIsPro(true); // Turn on if already unlocked
    } else {
      onUnlockProRequest(); // Request unlock if not on and not unlocked
    }
  };

  return (
    <div className="p-4 bg-base-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Pro Toggle */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center gap-2">
            <span className={`font-bold text-lg ${isPro ? 'text-primary' : 'text-text-secondary'}`}>
                Pro Mode
            </span>
            {!isProUnlocked && <LockClosedIcon className="w-5 h-5 text-gray-400" title="Pro mode is locked"/>}
        </div>
        <button
          onClick={handleToggleClick}
          aria-label={isPro ? "Deactivate Pro Mode" : isProUnlocked ? "Activate Pro Mode" : "Unlock Pro Mode by watching an ad"}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isPro ? 'bg-primary' : 'bg-gray-300'}`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isPro ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
        <SparklesIcon className={`w-6 h-6 transition-colors ${isPro ? 'text-yellow-400' : 'text-gray-400'}`} />
      </div>

      {/* Style Options */}
      <div className={`w-full sm:w-auto transition-opacity duration-300 ${isPro ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm font-medium text-text-secondary mr-2 hidden sm:inline">Style:</span>
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setStyleOption(style)}
              disabled={!isPro}
              className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 ${
                styleOption === style && isPro
                  ? 'bg-primary text-white shadow'
                  : 'bg-base-100 text-text-secondary hover:bg-base-300'
              } ${!isPro ? 'cursor-not-allowed' : ''}`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
