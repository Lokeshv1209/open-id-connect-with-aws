/**
 * Quiz and Questionnaire type definitions
 */

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "single" | "multiple" | "text";
  options: QuizOption[];
  correctAnswer?: string | string[];
  points?: number;
}

export interface Quiz {
  quizId: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  questions: QuizQuestion[];
  totalPoints?: number;
  duration?: number; // in minutes
  status: "draft" | "published" | "archived";
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizSubmission {
  quizId: string;
  userId: string;
  answers: Record<string, string | string[]>;
  score?: number;
  totalScore?: number;
  submittedAt: string;
  timeTaken?: number; // in seconds
}

export interface SolvedQuiz {
  submissionId: string;
  quiz: Quiz;
  submission: QuizSubmission;
  userName: string;
  userEmail: string;
  percentage?: number;
}
