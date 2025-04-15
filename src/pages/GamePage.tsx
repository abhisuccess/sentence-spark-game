
import React from 'react';
import SentenceGame from '@/components/SentenceGame';
import { questionsData } from '@/data/questions';

const GamePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <SentenceGame questions={questionsData.data.questions} />
      </div>
    </div>
  );
};

export default GamePage;
