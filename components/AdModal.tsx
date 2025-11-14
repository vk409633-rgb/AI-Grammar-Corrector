import React, { useState, useEffect } from 'react';
import { LockClosedIcon, LockOpenIcon } from './IconComponents';

interface AdModalProps {
  onAdComplete: () => void;
  onClose: () => void;
}

export const AdModal: React.FC<AdModalProps> = ({ onAdComplete, onClose }) => {
  const adDuration = 5;
  const [countdown, setCountdown] = useState(adDuration);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const progressPercentage = ((adDuration - countdown) / adDuration) * 100;

  return (
    <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ad-modal-title"
    >
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 text-center relative animate-fade-in-up">
        <button
            onClick={onClose}
            className="absolute top-4 right-4 text-text-secondary hover:text-text-primary text-2xl font-bold"
            aria-label="Close dialog"
        >&times;</button>

        <div className="mx-auto bg-primary/10 rounded-full p-3 w-16 h-16 flex items-center justify-center">
            {countdown > 0 ? <LockClosedIcon className="w-8 h-8 text-primary" /> : <LockOpenIcon className="w-8 h-8 text-primary" />}
        </div>
        
        <h2 id="ad-modal-title" className="text-2xl font-bold text-text-primary mt-4">
          Unlock Pro Features
        </h2>
        <p className="text-text-secondary mt-2">
          Watch this short ad to unlock enhanced corrections and style options for this session.
        </p>

        <div className="my-6">
            <div className="w-full bg-base-300 rounded-full h-2.5">
                <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-linear" 
                    style={{ width: `${progressPercentage}%` }}>
                </div>
            </div>
            <p className="text-sm text-text-secondary mt-2">
                {countdown > 0 ? `Ad playing... ${countdown}s remaining` : 'Ad finished!'}
            </p>
        </div>

        <button
          onClick={onAdComplete}
          disabled={countdown > 0}
          className="w-full px-4 py-3 bg-primary text-white font-bold rounded-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {countdown > 0 ? 'Unlocking...' : 'Continue to Pro'}
        </button>
      </div>
       <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
       `}</style>
    </div>
  );
};
