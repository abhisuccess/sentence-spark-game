
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserContext } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Play, User, Clock, Award, BookOpen, Lightbulb } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-white py-8">
      <div className="w-full max-w-4xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Main content card - spans 3 columns on medium screens */}
          <Card className="md:col-span-3 shadow-lg border-2 border-blue-200 bg-white/90 backdrop-blur-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
            
            <CardHeader className="text-center pt-10">
              <div className="mx-auto bg-gradient-to-br from-blue-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md">
                <BookOpen className="w-8 h-8" />
              </div>
              <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">
                Sentence Construction
              </CardTitle>
              <CardDescription className="text-lg mt-2 text-gray-600">
                Challenge your language skills and perfect your sentence building
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-6 py-4">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Welcome! Please enter your name to begin:
                </h2>
                
                <div className="flex gap-4 mb-6">
                  <Input
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-blue-300 focus-visible:ring-blue-500 text-lg py-6"
                    onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pb-8 px-8">
              <Button 
                onClick={handleStart} 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 text-lg flex items-center justify-center gap-2 rounded-lg transform transition-transform duration-200 hover:scale-[1.02] shadow-md"
              >
                Start Challenge
                <Play className="w-5 h-5 ml-1" fill="white" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Features sidebar - spans 2 columns on medium screens */}
          <div className="md:col-span-2 space-y-4">
            {/* Feature card 1 */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
              <CardContent className="p-4 flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Timed Challenges</h3>
                  <p className="text-sm text-gray-600">30 seconds per question to test your language skills under pressure</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature card 2 */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
              <CardContent className="p-4 flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800">Detailed Analysis</h3>
                  <p className="text-sm text-gray-600">Get comprehensive performance metrics after completing the challenge</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Feature card 3 */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
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
