
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ResultsDisplay from '@/components/ResultsDisplay';
import { questionsData } from '@/data/questions';
import { useGameContext } from '@/contexts/GameContext';

const ResultsPage = () => {
  const { userAnswers, resetGame } = useGameContext();
  const navigate = useNavigate();
  
  // If no answers are stored, redirect back to the game
  if (userAnswers.length === 0) {
    navigate('/game');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="container mx-auto">
        <ResultsDisplay 
          userAnswers={userAnswers}
          questions={questionsData.data.questions}
          onRestart={resetGame}
        />
      </div>
    </div>
  );
};

export default ResultsPage;
