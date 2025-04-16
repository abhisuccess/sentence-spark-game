
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserContext } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Play, User, Clock, Award, BookOpen, Lightbulb, Coins } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { setUserName } = useUserContext();
  const [name, setName] = useState('');
  const isMobile = useIsMobile();
  
  const handleStart = () => {
    if (!name.trim()) {
      toast.error('Please enter your name to continue');
      return;
    }
    
    setUserName(name.trim());
    navigate('/game');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-white py-0 laptop-fit overflow-hidden">
      <div className="w-full max-w-4xl px-2 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4">
          {/* Main content card - spans 3 columns on medium screens */}
          <Card className="md:col-span-3 shadow-lg border-2 border-blue-200 bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
            
            <CardHeader className="text-center pt-4 sm:pt-8 px-3 sm:px-6">
              <div className="mx-auto bg-gradient-to-br from-blue-500 to-blue-600 text-white w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-md">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <CardTitle className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">
                Sentence Construction
              </CardTitle>
              <CardDescription className="text-sm sm:text-lg mt-1 sm:mt-2 text-gray-600">
                Challenge your language skills
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-3 sm:px-6 py-1 sm:py-2">
              <div className="mb-3 sm:mb-4">
                <h2 className="text-base sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-700 flex items-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-blue-600" />
                  {isMobile ? 'Enter your name:' : 'Welcome! Please enter your name to begin:'}
                </h2>
                
                <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-blue-300 focus-visible:ring-blue-500 text-base sm:text-lg py-4 sm:py-5"
                    onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pb-4 sm:pb-6 px-3 sm:px-6">
              <Button 
                onClick={handleStart} 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 sm:py-5 text-base sm:text-lg flex items-center justify-center gap-2 rounded-lg transform transition-transform duration-200 hover:scale-[1.02] shadow-md"
              >
                Start Challenge
                <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-1" fill="white" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Features sidebar - spans 2 columns on medium screens */}
          <div className="md:col-span-2 space-y-2 sm:space-y-3">
            {/* Feature card 1 */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
              <CardContent className="p-2 sm:p-3 flex items-start">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-4">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-blue-800">Timed Challenges</h3>
                  <p className="text-xs sm:text-sm text-gray-600">30 seconds per question to test your language skills</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature card 2 */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
              <CardContent className="p-2 sm:p-3 flex items-start">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-4">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-blue-800">Detailed Analysis</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Get comprehensive performance metrics</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature card 3 */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
              <CardContent className="p-2 sm:p-3 flex items-start">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-4">
                  <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-blue-800">Enhance Vocabulary</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Practice with carefully crafted sentences</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Coin Rewards Feature - New */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
              <CardContent className="p-2 sm:p-3 flex items-start">
                <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-4">
                  <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-blue-800">Coin Rewards</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Earn 1 coin for each correct answer</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
