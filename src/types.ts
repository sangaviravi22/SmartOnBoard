export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  skills: string[];
  experienceLevel: string;
  language: string;
  onboarded: boolean;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AssessmentResult {
  score: number;
  maxScore: number;
  suggestedLevel: SkillLevel;
  feedback: string;
  weakAreas: string[];
  strongAreas: string[];
}

export interface LearningDay {
  day: number;
  title: string;
  topic: string;
  content: string;
  resources: {
    type: 'video' | 'doc' | 'link' | 'documentation' | 'tutorial' | 'exercise' | 'blog' | 'example' | 'guide' | 'webinar';
    title: string;
    url: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  };
  completed: boolean;
  locked: boolean;
  quizScore?: number; // Score on the quiz (0-100)
  completedAt?: number; // Timestamp when completed
  timeSpent?: number; // Time spent in minutes
}

export interface LearningPlan {
  id: string;
  title: string;
  targetSkill: string;
  days: LearningDay[];
  currentDay: number;
}

export interface FinalAssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface FinalAssessmentResult {
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
  feedback: string;
  completedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseName: string;
  skillLevel: SkillLevel;
  finalScore: number;
  percentage: number;
  completionDate: string;
  certificateId: string;
  issueDate: string;
}

// Enhanced AI Mentor Types
export interface TopicSuggestion {
  topic: string;
  description: string;
  icon: string;
}

export interface MentorResponse {
  mainContent: string;
  followUpQuestions: string[];
  relatedTopics: TopicSuggestion[];
  codeExamples?: {
    language: string;
    code: string;
  }[];
  encouragement: string;
  topicsTouched: string[];
  intent: 'explanation' | 'how-to' | 'career' | 'error' | 'comparison' | 'general';
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  topicsTouched?: string[];
  isFavorited?: boolean;
}

export interface MentorSession {
  messages: ConversationMessage[];
  topicsDiscussed: string[];
  skillProgression: Record<string, number>;
  favorites: string[];
}
