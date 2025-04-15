
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
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100) || 0;
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

  // Max possible coins calculation - now 10 coins total
  const maxPossibleCoins = 10; // 1 coin per correct question
  const coinPercentage = Math.round((totalCoins / maxPossibleCoins) * 100) || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-4 animate-fade-in h-[calc(100vh-8rem)] overflow-y-auto">
      <Card className="mb-6 border-purple-200 shadow-lg bg-white/90 backdrop-blur-sm overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Results Summary</h2>
          </div>
          <p className="text-purple-100">
            Congratulations on completing the quiz, {userName}!
          </p>
        </div>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-4xl font-bold text-purple-700 mb-1">
                {correctCount}/{totalQuestions}
              </div>
              <p className="text-gray-600 text-sm">Score</p>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-4xl font-bold text-purple-700 mb-1">
                {scorePercentage}%
              </div>
              <p className="text-gray-600 text-sm">Percentage</p>
            </div>
            
            <div className="text-center p-3 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-center justify-center gap-2 text-4xl font-bold text-amber-700 mb-1">
                <Coins className="w-6 h-6" />
                {totalCoins}/{maxPossibleCoins}
              </div>
              <p className="text-gray-600 text-sm">Coins Earned</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700 mb-1">Performance:</p>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                performanceGrade === 'Excellent' || performanceGrade === 'Very Good' ? 'bg-green-100 text-green-800' :
                performanceGrade === 'Good' ? 'bg-blue-100 text-blue-800' :
                performanceGrade === 'Fair' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {performanceGrade}
              </span>
            </div>
            <div className="mt-3">
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
      
      <Tabs defaultValue="summary" className="mb-6">
        <TabsList className="grid grid-cols-3 mb-4">
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
            <CardHeader className="py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Performance Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 py-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium mb-2">Coin Rewards</h3>
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-700 text-sm">Coins Earned</p>
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
                    <p className="text-xs mt-2 text-gray-600">
                      You've earned {totalCoins} out of {maxPossibleCoins} possible coins ({coinPercentage}%)
                      <br/>
                      <span className="font-medium">1 coin is awarded for each correctly answered question</span>
                    </p>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2">Metric</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
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
                      <TableCell>Coins Earned</TableCell>
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
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
            {userAnswers.map((answer, index) => {
              const question = questions.find(q => q.questionId === answer.questionId);
              if (!question) return null;
              
              return (
                <Card key={answer.questionId} className={`border-l-4 ${answer.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardHeader className="pb-2 pt-3 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
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
                    <CardContent className="pt-0 px-4 pb-3">
                      <div className="p-2 bg-gray-50 rounded-md mb-2">
                        <p className="text-sm font-medium text-gray-700">Your Answer:</p>
                        <p className="text-sm">{renderSentenceWithAnswers(question.question, answer.selectedAnswers)}</p>
                      </div>
                      
                      {!answer.isCorrect && (
                        <div className="p-2 bg-green-50 rounded-md border border-green-100">
                          <p className="text-sm font-medium text-gray-700">Correct Answer:</p>
                          <p className="text-sm">{renderSentenceWithAnswers(question.question, question.correctAnswer)}</p>
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
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-lg">Question Breakdown</CardTitle>
              <CardDescription>
                Detailed analysis of each answer
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-[50vh] overflow-y-auto">
                {userAnswers.map((answer, index) => {
                  const question = questions.find(q => q.questionId === answer.questionId);
                  if (!question) return null;
                  
                  const sentenceParts = parseSentence(question.question);
                  
                  return (
                    <div key={answer.questionId} className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-base font-medium">Question {index + 1}</span>
                        {answer.isCorrect ? (
                          <CheckCircle2 className="text-green-600 w-5 h-5" />
                        ) : (
                          <XCircle className="text-red-600 w-5 h-5" />
                        )}
                        {answer.isCorrect && (
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 flex items-center">
                            <Coins className="w-3 h-3 mr-1" />
                            +1 coin
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-3 text-sm text-gray-700 p-3 bg-gray-50 rounded-md">
                        {sentenceParts.map((part, i) => (
                          <React.Fragment key={i}>
                            {part}
                            {i < sentenceParts.length - 1 && (
                              <span className={`px-1.5 py-0.5 mx-1 rounded-md inline-flex items-center justify-center text-xs
                                ${answer.selectedAnswers[i] === question.correctAnswer[i] 
                                  ? 'bg-green-100 text-green-800 border border-green-300' 
                                  : 'bg-red-100 text-red-800 border border-red-300'
                                }`}
                              >
                                {answer.selectedAnswers[i]}
                                {answer.selectedAnswers[i] !== question.correctAnswer[i] && (
                                  <span className="ml-1 text-xs bg-white px-1 py-0.5 rounded border border-red-200">
                                    ✕
                                  </span>
                                )}
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      
                      {!answer.isCorrect && (
                        <div className="mt-3 mb-2">
                          <div className="text-xs font-medium text-gray-700 mb-1">Correct Answer:</div>
                          <div className="text-sm text-gray-800 p-3 bg-green-50 rounded-md border border-green-100">
                            {sentenceParts.map((part, i) => (
                              <React.Fragment key={i}>
                                {part}
                                {i < sentenceParts.length - 1 && (
                                  <span className="px-1.5 py-0.5 mx-1 rounded-md inline-flex items-center justify-center text-xs bg-green-100 text-green-800 border border-green-300">
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
