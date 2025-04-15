
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { QuestionOption } from '@/data/questions';
import { UserAnswer } from '@/types';
import { parseSentence, checkAnswers } from '@/utils/sentenceUtils';
import Timer from './Timer';
import SentenceDisplay from './SentenceDisplay';
import WordOptions from './WordOptions';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useGameContext } from '@/contexts/GameContext';

interface SentenceGameProps {
  questions: QuestionOption[];
}

const SentenceGame: React.FC<SentenceGameProps> = ({ questions }) => {
  const navigate = useNavigate();
  const { 
    userAnswers, 
    setUserAnswers,
    currentQuestionIndex,
    setCurrentQuestionIndex
  } = useGameContext();
  
  const [selectedWords, setSelectedWords] = useState<(string | null)[]>([]);
  const [timerActive, setTimerActive] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const sentenceParts = parseSentence(currentQuestion.question);
  const blanksCount = sentenceParts.length - 1;
  
  // Initialize selectedWords with nulls based on number of blanks
  useEffect(() => {
    // Check if we already have an answer for this question
    const existingAnswer = userAnswers.find(
      answer => answer.questionId === currentQuestion.questionId
    );
    
    if (existingAnswer) {
      setSelectedWords(existingAnswer.selectedAnswers);
    } else {
      setSelectedWords(Array(blanksCount).fill(null));
    }
    
    setTimerActive(true);
  }, [currentQuestionIndex, blanksCount, currentQuestion.questionId, userAnswers]);

  const handleWordSelect = (word: string) => {
    const nextEmptyIndex = selectedWords.findIndex(w => w === null);
    if (nextEmptyIndex !== -1) {
      const newSelectedWords = [...selectedWords];
      newSelectedWords[nextEmptyIndex] = word;
      setSelectedWords(newSelectedWords);
    }
  };

  const handleRemoveWord = (index: number) => {
    const newSelectedWords = [...selectedWords];
    newSelectedWords[index] = null;
    setSelectedWords(newSelectedWords);
  };

  const handleTimeUp = () => {
    setTimerActive(false);
    toast.error('Time is up!', {
      description: 'Moving to the next question.'
    });
    saveAnswerAndContinue();
  };

  const saveAnswerAndContinue = () => {
    // Save the current answer
    const newUserAnswer: UserAnswer = {
      questionId: currentQuestion.questionId,
      selectedAnswers: [...selectedWords],
      isCorrect: checkAnswers(selectedWords, currentQuestion.correctAnswer)
    };
    
    const updatedUserAnswers = [...userAnswers];
    const existingIndex = updatedUserAnswers.findIndex(
      answer => answer.questionId === currentQuestion.questionId
    );
    
    if (existingIndex !== -1) {
      updatedUserAnswers[existingIndex] = newUserAnswer;
    } else {
      updatedUserAnswers.push(newUserAnswer);
    }
    
    setUserAnswers(updatedUserAnswers);
    
    // Move to next question or complete
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Complete the game
      navigate('/results');
    }
  };

  const isAllBlanksFilledIn = selectedWords.every(word => word !== null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm font-medium bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
          Question {currentQuestionIndex + 1}/{questions.length}
        </div>
        <Timer 
          duration={30} 
          onTimeUp={handleTimeUp} 
          isActive={timerActive}
        />
      </div>
      
      <SentenceDisplay 
        sentenceParts={sentenceParts} 
        selectedWords={selectedWords} 
        onRemoveWord={handleRemoveWord}
      />
      
      <WordOptions 
        options={currentQuestion.options}
        onSelect={handleWordSelect}
        disabledOptions={selectedWords.filter(word => word !== null) as string[]}
      />
      
      <div className="flex justify-center mt-10">
        <Button
          onClick={saveAnswerAndContinue}
          disabled={!isAllBlanksFilledIn}
          className="flex items-center gap-2"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default SentenceGame;
