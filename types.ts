export type Language = 'ar' | 'en';

export type UserRole = 'student' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string; // Added email
  role: UserRole; // Added role
  xp: number;
  levelTitle: string;
  streak: number;
  completedLessons: string[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  icon: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
}

export interface Course {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  thumbnail: string;
  instructor: string;
  totalChapters: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: { ar: string; en: string };
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: { ar: string; en: string };
  videoUrl: string; // Placeholder or Youtube ID
  content: { ar: string; en: string }; // Summary content
  duration: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Comment {
  id: string;
  user: string;
  text: string;
  upvotes: number;
  timestamp: string;
}