
import React, { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [duration, onTimeUp, isActive]);
  
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);
  
  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Calculate progress percentage for the timer display
  const progressPercentage = (timeLeft / duration) * 100;
  
  return (
    <div className="flex items-center gap-2 bg-white p-3 rounded-full shadow-md">
      <TimerIcon className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`} />
      <div className="flex items-center">
        <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${timeLeft <= 10 ? 'bg-red-500' : 'bg-green-500'}`} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className={`ml-2 font-mono text-sm font-semibold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-600'}`}>
          {formattedTime}
        </span>
      </div>
    </div>
  );
};

export default Timer;
