
import React from 'react';

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
  return (
    <div className="text-lg md:text-xl text-center leading-relaxed my-8">
      {sentenceParts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < sentenceParts.length - 1 && (
            <span 
              onClick={() => selectedWords[index] && onRemoveWord(index)} 
              className={`px-2 py-1 mx-1 rounded-md inline-flex items-center justify-center min-w-24 
                ${selectedWords[index] 
                  ? 'bg-purple-100 hover:bg-purple-200 text-purple-800 border border-purple-300 cursor-pointer transition-colors' 
                  : 'border border-dashed border-gray-400 bg-gray-50'
                }`}
            >
              {selectedWords[index] || "________"}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default SentenceDisplay;
