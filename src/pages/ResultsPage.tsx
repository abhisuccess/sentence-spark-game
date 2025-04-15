
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultsDisplay from '@/components/ResultsDisplay';
import { questionsData } from '@/data/questions';
import { useGameContext } from '@/contexts/GameContext';
import { useUserContext } from '@/contexts/UserContext';

const ResultsPage = () => {
  const { userAnswers, resetGame } = useGameContext();
  const { userName } = useUserContext();
  const navigate = useNavigate();
  
  // If no answers are stored or no username, redirect back
  useEffect(() => {
    if (userAnswers.length === 0) {
      navigate('/game');
    } else if (!userName) {
      navigate('/welcome');
    }
  }, [userAnswers, userName, navigate]);
  
  if (userAnswers.length === 0 || !userName) {
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
