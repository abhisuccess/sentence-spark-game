
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserContext } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Play, User, Clock, Award, BookOpen, Lightbulb, Coins } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { setUserName } = useUserContext();
  const [name, setName] = useState('');
  
  const handleStart = () => {
    if (!name.trim()) {
      toast.error('Please enter your name to continue');
      return;
    }
    
    setUserName(name.trim());
    navigate('/game');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 py-8">
      <div className="w-full max-w-4xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Main content card - spans 3 columns on medium screens */}
          <Card className="md:col-span-3 shadow-lg border-2 border-purple-200 bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>
            
            <CardHeader className="text-center pt-10">
              <div className="mx-auto bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md">
                <BookOpen className="w-8 h-8" />
              </div>
              <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Sentence Construction
              </CardTitle>
              <CardDescription className="text-lg mt-2 text-gray-600">
                Challenge your language skills and perfect your sentence building
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-6 py-4">
              <div className="mb-6">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-4 mb-6">
                  <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
                    <Coins className="h-5 w-5 text-amber-600" />
                    <h3 className="text-lg">Coin Reward System</h3>
                  </div>
                  <p className="text-sm text-amber-700 mb-2">
                    Earn coins for every correct answer:
                  </p>
                  <ul className="list-disc list-inside text-sm text-amber-700 space-y-1 ml-2">
                    <li>Get 1 coin for each correctly placed word</li>
                    <li>Maximum of 40 coins can be earned (10 questions with 4 blanks each)</li>
                    <li>Track your progress on the game screen</li>
                    <li>See your final coin score on the results screen</li>
                  </ul>
                </div>
                
                <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-600" />
                  Welcome! Please enter your name to begin:
                </h2>
                
                <div className="flex gap-4 mb-6">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-purple-300 focus-visible:ring-purple-500 text-lg py-6"
                    onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pb-8 px-8">
              <Button 
                onClick={handleStart} 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-lg flex items-center justify-center gap-2 rounded-lg transform transition-transform duration-200 hover:scale-[1.02] shadow-md"
              >
                Start Challenge
                <Play className="w-5 h-5 ml-1" fill="white" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Features sidebar - spans 2 columns on medium screens */}
          <div className="md:col-span-2 space-y-4">
            {/* Feature card 1 */}
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 shadow-sm">
              <CardContent className="p-4 flex items-start">
                <div className="bg-purple-100 p-2 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-800">Timed Challenges</h3>
                  <p className="text-sm text-gray-600">30 seconds per question to test your language skills under pressure</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature card 2 */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 shadow-sm">
              <CardContent className="p-4 flex items-start">
                <div className="bg-indigo-100 p-2 rounded-full mr-4">
                  <Award className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-indigo-800">Detailed Analysis</h3>
                  <p className="text-sm text-gray-600">Get comprehensive performance metrics after completing the challenge</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature card 3 - New Coin Rewards */}
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 shadow-sm">
              <CardContent className="p-4 flex items-start">
                <div className="bg-amber-100 p-2 rounded-full mr-4">
                  <Coins className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800">Coin Rewards</h3>
                  <p className="text-sm text-gray-600">Earn coins for every correct answer and track your progress</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature card 4 */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-sm">
              <CardContent className="p-4 flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Enhance Vocabulary</h3>
                  <p className="text-sm text-gray-600">Practice with carefully crafted sentences to improve your language mastery</p>
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
