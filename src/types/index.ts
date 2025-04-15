
export interface Question {
  questionId: string;
  question: string;
  questionType: string;
  answerType: string;
  options: string[];
  correctAnswer: string[];
}

export interface UserAnswer {
  questionId: string;
  selectedAnswers: (string | null)[];
  isCorrect?: boolean;
  questionData?: Question;
}

export interface TestResult {
  totalQuestions: number;
  correctAnswers: number;
  userAnswers: UserAnswer[];
  userName?: string;
  completionTime?: number;
  wordAccuracy?: number;
  totalCoins?: number;
  score?: number;
}
