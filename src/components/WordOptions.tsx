
import React from 'react';
import { Button } from '@/components/ui/button';

interface WordOptionsProps {
  options: string[];
  onSelect: (word: string) => void;
  disabledOptions: string[];
}

const WordOptions: React.FC<WordOptionsProps> = ({ options, onSelect, disabledOptions }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-8">
      {options.map((option, index) => (
        <Button
          key={index}
          onClick={() => onSelect(option)}
          disabled={disabledOptions.includes(option)}
          variant={disabledOptions.includes(option) ? "ghost" : "default"}
          className="text-base py-2 px-4 transition-all"
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default WordOptions;
