
import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
  currentQuestionIndex: number; // Add this to track question changes
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isActive, currentQuestionIndex }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  // Reset timer when question changes or when isActive changes
  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration);
    }
  }, [duration, isActive, currentQuestionIndex]);
  
  // Handle countdown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timer) clearInterval(timer);
            // Ensure onTimeUp is called immediately when time is up
            setTimeout(() => onTimeUp(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, timeLeft, onTimeUp]);
  
  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Calculate progress percentage for the timer display
  const progressPercentage = (timeLeft / duration) * 100;
  
  // Determine color based on time left
  const getColor = () => {
    if (timeLeft <= 5) return 'text-red-500';
    if (timeLeft <= 10) return 'text-orange-500';
    return 'text-blue-600';
  };
  
  const getProgressColor = () => {
    if (timeLeft <= 5) return 'bg-red-500';
    if (timeLeft <= 10) return 'bg-orange-500';
    return 'bg-blue-600';
  };

  return (
    <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-3 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2">
        {timeLeft <= 10 ? (
          <AlertTriangle className={`w-5 h-5 ${timeLeft <= 5 ? 'animate-pulse text-red-500' : 'text-orange-500'}`} />
        ) : (
          <Clock className="w-5 h-5 text-blue-600" />
        )}
        <span className={`font-mono text-lg font-semibold ${getColor()}`}>
          {formattedTime}
        </span>
      </div>
      
      <div className="w-full">
        <Progress 
          value={progressPercentage} 
          className="h-2 bg-gray-200"
          indicatorClassName={getProgressColor()}
        />
      </div>
    </div>
  );
};

export default Timer;
