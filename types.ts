
export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cohort?: string;
  testHistory: string[]; // Submission IDs
}

export enum QuestionType {
  MCQ = 'mcq',
  SHORT = 'short',
  CODING = 'coding',
  HTML = 'html',
  REACT = 'react'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  category: 'HTML' | 'JavaScript' | 'React' | 'DSA';
  difficulty: Difficulty;
  questionText: string;
  options?: string[];
  correctAnswer?: string;
  testCases?: TestCase[];
  initialCode?: string;
  explanation: string;
}

export interface TestSection {
  title: string;
  weight: number;
  questionIds: string[];
}

export interface Assessment {
  id: string;
  title: string;
  duration: number; // in minutes
  assignedCohort: string;
  sections: TestSection[];
  totalMarks: number;
}

export interface ProctorLog {
  timestamp: number;
  type: 'tab-switch' | 'window-blur' | 'fullscreen-exit' | 'snapshot';
  details: string;
  snapshotUrl?: string;
}

export interface PerformanceMetrics {
  logic: number;
  syntax: number;
  optimization: number;
  documentation: number;
}

export interface Submission {
  id: string;
  studentId: string;
  testId: string;
  answers: Record<string, any>; // questionId -> answer
  score: number;
  metrics: PerformanceMetrics;
  sectionScores: Record<string, number>;
  logs: ProctorLog[];
  submittedAt: number;
  timeTaken: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}
