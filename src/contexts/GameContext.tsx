
import React, { createContext, useContext, useState, useEffect } from 'react';
import { QuestionOption } from '@/data/questions';
import { UserAnswer } from '@/types';

interface GameContextType {
  userAnswers: UserAnswer[];
  setUserAnswers: React.Dispatch<React.SetStateAction<UserAnswer[]>>;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  saveAnswer: (answer: UserAnswer) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Load saved state from localStorage when component mounts
  useEffect(() => {
    const savedAnswers = localStorage.getItem('userAnswers');
    if (savedAnswers) {
      setUserAnswers(JSON.parse(savedAnswers));
    }
    
    const savedIndex = localStorage.getItem('currentQuestionIndex');
    if (savedIndex) {
      setCurrentQuestionIndex(Number(savedIndex));
    }
  }, []);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    if (userAnswers.length > 0) {
      localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    }
    
    localStorage.setItem('currentQuestionIndex', String(currentQuestionIndex));
  }, [userAnswers, currentQuestionIndex]);
  
  const saveAnswer = (answer: UserAnswer) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      const existingIndex = newAnswers.findIndex(a => a.questionId === answer.questionId);
      
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = answer;
      } else {
        newAnswers.push(answer);
      }
      
      return newAnswers;
    });
  };
  
  const resetGame = () => {
    setUserAnswers([]);
    setCurrentQuestionIndex(0);
    localStorage.removeItem('userAnswers');
    localStorage.removeItem('currentQuestionIndex');
  };
  
  const value = {
    userAnswers,
    setUserAnswers,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    saveAnswer,
    resetGame,
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
