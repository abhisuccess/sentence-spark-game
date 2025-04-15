
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { questionsData } from '@/data/questions';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  const startGame = () => {
    navigate('/game');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="text-center max-w-xl p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Sentence Construction Tool</h1>
        <p className="text-lg text-gray-600 mb-8">
          Complete sentences by selecting the right words for each blank space. You'll have 30 seconds per question to make your choices.
        </p>
        
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">How to Play:</h2>
          <ul className="space-y-2 text-left text-gray-700">
            <li className="flex items-start">
              <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
              <p>Read the incomplete sentence carefully.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
              <p>Select words from the options to fill in the blanks.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
              <p>Click on a filled blank to remove the word if you want to change it.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
              <p>Complete all questions to see your final score.</p>
            </li>
          </ul>
        </div>
        
        <Button 
          onClick={startGame} 
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg flex items-center gap-2"
        >
          Start Game
          <Play className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
