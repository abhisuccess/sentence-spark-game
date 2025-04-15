
import React, { useState } from 'react';
import { UserAnswer } from '@/types';
import { QuestionOption } from '@/data/questions';
import { parseSentence } from '@/utils/sentenceUtils';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Trophy, 
  BarChart3, 
  ListChecks, 
  Coins, 
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserContext } from '@/contexts/UserContext';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useGameContext } from '@/contexts/GameContext';

interface ResultsDisplayProps {
  userAnswers: UserAnswer[];
  questions: QuestionOption[];
  onRestart: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ userAnswers, questions, onRestart }) => {
  const correctCount = userAnswers.filter(answer => answer.isCorrect).length;
  const totalQuestions = questions.length;
  const attemptedQuestions = userAnswers.length;
  const scorePercentage = Math.round((correctCount / attemptedQuestions) * 100) || 0;
  const navigate = useNavigate();
  const { userName } = useUserContext();
  const { totalCoins, emailResults } = useGameContext();
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const toggleQuestion = (questionId: string) => {
    if (expandedQuestion === questionId) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(questionId);
    }
  };
  
  const handleSendEmail = () => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSending(true);
    try {
      emailResults(email);
      toast.success('Results sent to your email!');
    } catch (error) {
      toast.error('Failed to send results');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };
  
  // Calculate analytics
  const totalBlanks = questions.reduce((sum, q) => sum + (parseSentence(q.question).length - 1), 0);
  const correctBlanks = userAnswers.reduce((sum, answer) => {
    const question = questions.find(q => q.questionId === answer.questionId);
    if (!question) return sum;
    
    const correctOptions = question.correctAnswer;
    let correctCount = 0;
    
    answer.selectedAnswers.forEach((selected, index) => {
      if (selected === correctOptions[index]) correctCount++;
    });
    
    return sum + correctCount;
  }, 0);
  
  const incorrectBlanks = totalBlanks - correctBlanks;
  const blankAccuracy = Math.round((correctBlanks / totalBlanks) * 100);
  
  // Performance data
  const performanceGrade = scorePercentage >= 90 ? 'Excellent' :
    scorePercentage >= 80 ? 'Very Good' :
    scorePercentage >= 70 ? 'Good' :
    scorePercentage >= 60 ? 'Fair' : 'Needs Improvement';

  // Max possible coins calculation
  const maxPossibleCoins = totalBlanks;
  const coinPercentage = Math.round((totalCoins / maxPossibleCoins) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <Card className="mb-10 border-purple-200 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Results Summary</h2>
          </div>
          <p className="text-purple-100">
            Congratulations on completing the quiz, {userName}!
          </p>
        </div>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-5xl font-bold text-purple-700 mb-2">
                {scorePercentage}%
              </div>
              <p className="text-gray-600">Overall Score</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-5xl font-bold text-purple-700 mb-2">
                {correctCount}/{attemptedQuestions}
              </div>
              <p className="text-gray-600">Questions Correct</p>
            </div>
            
            <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-center justify-center gap-2 text-5xl font-bold text-amber-700 mb-2">
                <Coins className="w-8 h-8" />
                {totalCoins}/{maxPossibleCoins}
              </div>
              <p className="text-gray-600">Coins Earned</p>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 mb-1">Performance Assessment:</p>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                performanceGrade === 'Excellent' || performanceGrade === 'Very Good' ? 'bg-green-100 text-green-800' :
                performanceGrade === 'Good' ? 'bg-blue-100 text-blue-800' :
                performanceGrade === 'Fair' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {performanceGrade}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Send Results to Email:</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-purple-200"
                />
                <Button 
                  onClick={handleSendEmail}
                  disabled={isSending || !email}
                  className="whitespace-nowrap"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => {
              onRestart();
              navigate('/welcome');
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="summary" className="mb-8">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <ListChecks className="w-4 h-4" />
            <span className="hidden sm:inline">Questions</span>
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">Details</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Performance Analytics
              </CardTitle>
              <CardDescription>
                Detailed breakdown of your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Word Placement Accuracy</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Correct Words</p>
                        <p className="text-2xl font-bold text-green-600">{correctBlanks}</p>
                      </div>
                      <CheckCircle2 className="w-10 h-10 text-green-500 opacity-40" />
                    </div>
                    
                    <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Incorrect Words</p>
                        <p className="text-2xl font-bold text-red-600">{incorrectBlanks}</p>
                      </div>
                      <XCircle className="w-10 h-10 text-red-500 opacity-40" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Coin Rewards</h3>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-700">Coins Earned</p>
                      <div className="flex items-center">
                        <Coins className="w-5 h-5 text-amber-500 mr-1" />
                        <span className="font-medium text-amber-700">{totalCoins}</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full" 
                        style={{ width: `${coinPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>{maxPossibleCoins}</span>
                    </div>
                    <p className="text-sm mt-2 text-gray-600">
                      You've earned {totalCoins} out of {maxPossibleCoins} possible coins ({coinPercentage}%)
                    </p>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Questions Available</TableCell>
                      <TableCell>{totalQuestions}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Questions Attempted</TableCell>
                      <TableCell>{attemptedQuestions}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Correct Questions</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">{correctCount}</span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Incorrect Questions</TableCell>
                      <TableCell>
                        <span className="text-red-600 font-medium">{attemptedQuestions - correctCount}</span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Success Rate</TableCell>
                      <TableCell>{scorePercentage}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Word Blanks</TableCell>
                      <TableCell>{totalBlanks}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Word Placement Accuracy</TableCell>
                      <TableCell>{blankAccuracy}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total Coins Earned</TableCell>
                      <TableCell>
                        <span className="text-amber-600 font-medium flex items-center">
                          <Coins className="w-4 h-4 mr-1" /> {totalCoins}
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions">
          <div className="space-y-4">
            {userAnswers.map((answer, index) => {
              const question = questions.find(q => q.questionId === answer.questionId);
              if (!question) return null;
              
              return (
                <Card key={answer.questionId} className={`border-l-4 ${answer.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        Question {index + 1}
                        {answer.isCorrect ? (
                          <CheckCircle2 className="text-green-600 w-5 h-5" />
                        ) : (
                          <XCircle className="text-red-600 w-5 h-5" />
                        )}
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleQuestion(answer.questionId)}
                        className="p-1 h-auto"
                      >
                        {expandedQuestion === answer.questionId ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {expandedQuestion === answer.questionId && (
                    <CardContent className="pt-0">
                      <div className="p-3 bg-gray-50 rounded-md mb-3">
                        <p className="text-sm font-medium text-gray-700">Your Answer:</p>
                        <p className="text-base">{renderSentenceWithAnswers(question.question, answer.selectedAnswers)}</p>
                      </div>
                      
                      {!answer.isCorrect && (
                        <div className="p-3 bg-green-50 rounded-md border border-green-100">
                          <p className="text-sm font-medium text-gray-700">Correct Answer:</p>
                          <p className="text-base">{renderSentenceWithAnswers(question.question, question.correctAnswer)}</p>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Question Breakdown</CardTitle>
              <CardDescription>
                Detailed word-by-word analysis of each answer
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {userAnswers.map((answer, index) => {
                  const question = questions.find(q => q.questionId === answer.questionId);
                  if (!question) return null;
                  
                  const sentenceParts = parseSentence(question.question);
                  
                  return (
                    <div key={answer.questionId} className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-medium">Question {index + 1}</span>
                        {answer.isCorrect ? (
                          <CheckCircle2 className="text-green-600 w-5 h-5" />
                        ) : (
                          <XCircle className="text-red-600 w-5 h-5" />
                        )}
                      </div>
                      
                      <div className="mb-4 text-gray-700 p-4 bg-gray-50 rounded-md">
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
                                {answer.selectedAnswers[i] !== question.correctAnswer[i] && (
                                  <span className="ml-2 text-xs bg-white px-1.5 py-0.5 rounded border border-red-200">
                                    ✕
                                  </span>
                                )}
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      
                      {!answer.isCorrect && (
                        <div className="mt-4">
                          <div className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</div>
                          <div className="text-gray-800 p-4 bg-green-50 rounded-md border border-green-100">
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
                      
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {question.correctAnswer.map((word, i) => {
                          const isCorrect = answer.selectedAnswers[i] === word;
                          return (
                            <div key={i} className={`text-center text-sm p-2 rounded-md border ${
                              isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                            }`}>
                              <div className="font-medium">Blank {i+1}</div>
                              <div className="flex flex-col items-center justify-center mt-1">
                                <div className="flex items-center gap-1">
                                  <span>Your:</span>
                                  <span className="font-medium">{answer.selectedAnswers[i] || '(empty)'}</span>
                                </div>
                                {!isCorrect && (
                                  <div className="flex items-center gap-1">
                                    <span>Correct:</span>
                                    <span className="font-medium">{word}</span>
                                  </div>
                                )}
                                {isCorrect && (
                                  <div className="text-green-600 mt-1 flex items-center">
                                    <Coins className="w-3.5 h-3.5 mr-1" />
                                    <span>+1 coin</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to render a sentence with filled in answers
const renderSentenceWithAnswers = (sentence: string, answers: (string | null)[]) => {
  const parts = parseSentence(sentence);
  let result = '';
  
  parts.forEach((part, i) => {
    result += part;
    if (i < parts.length - 1) {
      result += ` [${answers[i] || '___'}] `;
    }
  });
  
  return result;
};

export default ResultsDisplay;
