
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultsDisplay from '@/components/ResultsDisplay';
import { questionsData } from '@/data/questions';
import { useGameContext } from '@/contexts/GameContext';
import { useUserContext } from '@/contexts/UserContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, Send } from 'lucide-react';

const ResultsPage = () => {
  const { userAnswers, resetGame, totalCoins, emailResults } = useGameContext();
  const { userName } = useUserContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // If no answers are stored or no username, redirect back
  useEffect(() => {
    if (userAnswers.length === 0) {
      navigate('/game');
    } else if (!userName) {
      navigate('/welcome');
    }
  }, [userAnswers, userName, navigate]);
  
  const handleSendEmail = () => {
    // Simple email validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSending(true);
    
    // Call the emailResults function from context
    emailResults(email);
    
    // Simulate sending email (would be an actual API call in production)
    setTimeout(() => {
      setIsSending(false);
      toast.success('Results sent successfully!');
      setEmail('');
    }, 1500);
  };
  
  if (userAnswers.length === 0 || !userName) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-2 sm:py-4 md:py-6 flex items-start justify-center">
      <div className="container mx-auto px-2 h-full">
        <ResultsDisplay 
          userAnswers={userAnswers}
          questions={questionsData.data.questions}
          onRestart={resetGame}
        />
        
        <Card className="mt-4 sm:mt-6 border-blue-200 shadow-md max-w-md mx-auto">
          <CardHeader className="py-3 px-3 sm:px-4">
            <CardTitle className="text-blue-700 text-lg sm:text-xl">Share Your Results</CardTitle>
            <CardDescription className="text-sm">Get your results sent to your email</CardDescription>
          </CardHeader>
          <CardContent className="py-2 px-3 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="pl-7 sm:pl-9 border-blue-200 focus-visible:ring-blue-500 text-sm py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleSendEmail} 
                disabled={isSending} 
                className="bg-blue-600 hover:bg-blue-700 py-1 px-2 sm:px-3 h-auto text-sm"
              >
                {isSending ? 'Sending...' : 'Send'}
                <Send className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultsPage;
