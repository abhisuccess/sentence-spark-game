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
import { ChevronRight, AlertCircle, LogOut, Coins, Info } from 'lucide-react';
import { useGameContext } from '@/contexts/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SentenceGameProps {
  questions: QuestionOption[];
}

const SentenceGame: React.FC<SentenceGameProps> = ({ questions }) => {
  const navigate = useNavigate();
  const { 
    userAnswers, 
    saveAnswer,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    totalCoins
  } = useGameContext();
  
  const [selectedWords, setSelectedWords] = useState<(string | null)[]>([]);
  const [timerActive, setTimerActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuitDialogOpen, setIsQuitDialogOpen] = useState(false);
  const [isCoinInfoOpen, setIsCoinInfoOpen] = useState(false);

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
    toast.warning('Time is up!', {
      description: 'Moving to the next question.'
    });
    
    // Auto-save current answer state even if incomplete
    saveUserAnswer();
    
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

  const saveUserAnswer = () => {
    // Save the current answer, complete or not
    const newUserAnswer: UserAnswer = {
      questionId: currentQuestion.questionId,
      selectedAnswers: [...selectedWords],
      isCorrect: checkAnswers(selectedWords, currentQuestion.correctAnswer),
      questionData: currentQuestion // Store question data for result display
    };
    
    saveAnswer(newUserAnswer);
  };

  const saveAnswerAndContinue = () => {
    setIsSubmitting(true);
    // Save the current answer
    saveUserAnswer();
    
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

  const handleQuit = () => {
    // Save current progress before quitting
    saveUserAnswer();
    toast.info('Quiz ended', {
      description: 'Redirecting to results page'
    });
    navigate('/results');
    setIsQuitDialogOpen(false);
  };

  const isAllBlanksFilledIn = selectedWords.every(word => word !== null);
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <Card className="max-w-3xl mx-auto shadow-lg border-blue-200 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
            <Progress value={progressPercentage} className="h-2 bg-gray-200" indicatorClassName="bg-blue-500" />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-blue-500" />
                      <span className="font-medium text-blue-700">{totalCoins} coins</span>
                      <Info className="w-3.5 h-3.5 text-blue-500 ml-0.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white p-2 text-xs w-48 text-gray-700">
                    Earn 1 coin for each correctly answered question. Maximum 10 coins total.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Dialog open={isQuitDialogOpen} onOpenChange={setIsQuitDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4 mr-1" /> Quit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Quit Quiz</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to quit? Your current progress will be saved, and you'll see your results based on questions answered so far.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsQuitDialogOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleQuit}>Yes, quit quiz</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 sm:hidden bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200">
              <Coins className="w-4 h-4 text-blue-500" />
              <span className="font-medium text-blue-700">{totalCoins} coins</span>
              
              <Dialog open={isCoinInfoOpen} onOpenChange={setIsCoinInfoOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    <Info className="h-3.5 w-3.5 text-blue-500" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Coin Rewards</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <p>Earn coins by answering questions correctly:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Each <span className="font-medium">completely correct</span> question earns you 1 coin</li>
                      <li>Maximum of 10 coins total (1 per question)</li>
                      <li>All blanks must be filled correctly to earn a coin</li>
                    </ul>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Timer 
            duration={30} 
            onTimeUp={handleTimeUp} 
            isActive={timerActive}
            currentQuestionIndex={currentQuestionIndex} // Pass the current question index
          />
        </div>
        
        {!isAllBlanksFilledIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2 text-blue-800 text-sm mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>Fill in all blanks to continue to the next question.</p>
          </div>
        )}
        
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-6">
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
        
        <div className="flex justify-center mt-6">
          <Button
            onClick={saveAnswerAndContinue}
            disabled={!isAllBlanksFilledIn || isSubmitting}
            className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg rounded-lg transition-all 
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
