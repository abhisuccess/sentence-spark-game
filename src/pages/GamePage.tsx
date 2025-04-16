
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SentenceGame from '@/components/SentenceGame';
import { questionsData } from '@/data/questions';
import { useUserContext } from '@/contexts/UserContext';
import { User, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const GamePage = () => {
  const { userName } = useUserContext();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Redirect to welcome page if no username is set
  useEffect(() => {
    if (!userName) {
      navigate('/welcome');
    }
  }, [userName, navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('userName');
    toast.success('Logged out successfully');
    navigate('/welcome');
  };
  
  if (!userName) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white laptop-fit overflow-hidden">
      <div className="container mx-auto px-2 sm:px-4 h-full flex flex-col">
        <div className="flex flex-wrap justify-between items-center py-2 sm:py-3 gap-2">
          <div className="flex items-center gap-2 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm border border-blue-200">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <span className="font-medium text-sm sm:text-base text-gray-700">{userName}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size={isMobile ? "sm" : "default"}
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-1 px-2 sm:px-3 py-1 h-auto"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" /> 
            <span className="text-xs sm:text-sm">Logout</span>
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center game-container">
          <SentenceGame questions={questionsData.data.questions} />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
