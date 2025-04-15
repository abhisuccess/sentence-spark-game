
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserContext } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Play, User } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 py-8">
      <div className="w-full max-w-xl p-4">
        <Card className="shadow-lg border-2 border-purple-200 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-purple-700">Sentence Construction</CardTitle>
            <CardDescription className="text-lg mt-2">
              Challenge your language skills by completing sentences
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Welcome! Please enter your name to begin:
              </h2>
              
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-purple-300 focus-visible:ring-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                />
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h3 className="font-semibold text-gray-700 mb-2">How to Play:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
                    <p>Complete each sentence by selecting the right words for each blank.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
                    <p>You'll have 30 seconds per question to make your choices.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-purple-200 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
                    <p>Click on a filled blank to remove the word if you want to change it.</p>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleStart} 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-lg flex items-center justify-center gap-2 rounded-lg transform transition-transform duration-200 hover:scale-[1.02]"
            >
              Start Game
              <Play className="w-5 h-5 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WelcomePage;
