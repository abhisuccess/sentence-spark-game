
import React from 'react';
import { UserAnswer } from '@/types';
import { QuestionOption } from '@/data/questions';
import { parseSentence } from '@/utils/sentenceUtils';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResultsDisplayProps {
  userAnswers: UserAnswer[];
  questions: QuestionOption[];
  onRestart: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ userAnswers, questions, onRestart }) => {
  const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
  const totalQuestions = questions.length;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Results</h1>
        <div className="text-6xl font-bold mb-4">
          {correctCount} <span className="text-gray-500">/ {totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2 max-w-md mx-auto">
          <div 
            className={`h-4 rounded-full ${
              scorePercentage >= 70 ? 'bg-green-600' : 
              scorePercentage >= 40 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`} 
            style={{ width: `${scorePercentage}%` }}
          ></div>
        </div>
        <div className="text-lg text-gray-600 mb-8">
          {scorePercentage >= 70 ? 'Great job!' : 
           scorePercentage >= 40 ? 'Good effort!' : 
           'Keep practicing!'}
        </div>

        <Button 
          onClick={() => {
            onRestart();
            navigate('/');
          }}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Question Breakdown</h2>
        
        {userAnswers.map((answer, index) => {
          const question = questions.find(q => q.questionId === answer.questionId);
          if (!question) return null;
          
          const sentenceParts = parseSentence(question.question);
          
          return (
            <div 
              key={answer.questionId} 
              className={`p-6 rounded-lg border ${
                answer.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-medium">Question {index + 1}</span>
                {answer.isCorrect ? (
                  <CheckCircle2 className="text-green-600 w-5 h-5" />
                ) : (
                  <XCircle className="text-red-600 w-5 h-5" />
                )}
              </div>
              
              <div className="mb-4 text-gray-700">
                {sentenceParts.map((part, i) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < sentenceParts.length - 1 && (
                      <span className={`px-2 py-1 mx-1 rounded-md inline-flex items-center justify-center
                        ${answer.selectedAnswers[i] === question.correctAnswer[i] 
                          ? 'bg-green-100 text-green-800 border border-green-300' 
                          : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {answer.selectedAnswers[i]}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              {!answer.isCorrect && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</div>
                  <div className="text-gray-800">
                    {sentenceParts.map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < sentenceParts.length - 1 && (
                          <span className="px-2 py-1 mx-1 rounded-md inline-flex items-center justify-center bg-green-100 text-green-800 border border-green-300">
                            {question.correctAnswer[i]}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsDisplay;
