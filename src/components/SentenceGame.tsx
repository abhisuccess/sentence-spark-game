
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
import { ChevronRight, AlertCircle } from 'lucide-react';
import { useGameContext } from '@/contexts/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    // Auto-save current answer state even if incomplete
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
    
    // Move to next question automatically after a brief delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Complete the game if this was the last question
        navigate('/results');
      }
    }, 1000);
  };

  const saveAnswerAndContinue = () => {
    setIsSubmitting(true);
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
    
    // Add a small delay for the animation
    setTimeout(() => {
      // Move to next question or complete
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Complete the game
        navigate('/results');
      }
      setIsSubmitting(false);
    }, 500);
  };

  const isAllBlanksFilledIn = selectedWords.every(word => word !== null);
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="max-w-3xl mx-auto shadow-lg border-purple-200 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6 md:p-8">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
              <Progress value={progressPercentage} className="h-2 bg-gray-200" />
            </div>
            
            <Timer 
              duration={30} 
              onTimeUp={handleTimeUp} 
              isActive={timerActive}
            />
          </div>
          
          {!isAllBlanksFilledIn && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2 text-amber-800 text-sm mt-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Fill in all blanks to continue to the next question.</p>
            </div>
          )}
        </div>
        
        <div className="bg-purple-50 rounded-xl p-4 md:p-6 border border-purple-100 mb-8">
          <SentenceDisplay 
            sentenceParts={sentenceParts} 
            selectedWords={selectedWords} 
            onRemoveWord={handleRemoveWord}
          />
        </div>
        
        <WordOptions 
          options={currentQuestion.options}
          onSelect={handleWordSelect}
          disabledOptions={selectedWords.filter(word => word !== null) as string[]}
        />
        
        <div className="flex justify-center mt-8">
          <Button
            onClick={saveAnswerAndContinue}
            disabled={!isAllBlanksFilledIn || isSubmitting}
            className={`flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 text-lg rounded-lg transition-all 
              ${isAllBlanksFilledIn ? 'animate-pulse shadow-md' : ''}
              ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentenceGame;
