
import React from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SentenceDisplayProps {
  sentenceParts: string[];
  selectedWords: (string | null)[];
  onRemoveWord: (index: number) => void;
}

const SentenceDisplay: React.FC<SentenceDisplayProps> = ({ 
  sentenceParts, 
  selectedWords, 
  onRemoveWord 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-center leading-relaxed`}>
      {sentenceParts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < sentenceParts.length - 1 && (
            <span 
              onClick={() => selectedWords[index] && onRemoveWord(index)} 
              className={`px-2 sm:px-3 py-0.5 sm:py-1 mx-1 rounded-md inline-flex items-center justify-center 
                ${isMobile ? 'min-w-16 text-sm' : 'min-w-24'} transition-all
                ${selectedWords[index] 
                  ? 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 cursor-pointer group' 
                  : 'border-2 border-dashed border-gray-400 bg-white/50'
                }`}
            >
              {selectedWords[index] ? (
                <span className="flex items-center justify-center">
                  {selectedWords[index]}
                  <span className="ml-1 sm:ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 text-purple-700" />
                  </span>
                </span>
              ) : (
                <span className="text-gray-400">{isMobile ? '_____' : '_______'}</span>
              )}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SentenceDisplay;
