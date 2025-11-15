export type StressLevel = 'normal' | 'mild' | 'moderate' | 'severe' | 'extremely_severe';

export interface AssessmentQuestion {
  id: string;
  text: string;
  category: 'depression' | 'anxiety' | 'stress';
  order: number;
}

export interface AssessmentAnswer {
  questionId: string;
  value: number; // 0-3 scale: Never, Sometimes, Often, Almost always
}

export interface Assessment {
  id: string;
  user_id: string;
  depression_score: number; // 0-28
  anxiety_score: number; // 0-28
  stress_score: number; // 0-28
  depression_level: StressLevel;
  anxiety_level: StressLevel;
  stress_level: StressLevel;
  answers: Record<string, number>; // questionId -> value
  completed_at: string;
  question_order: number[]; // store randomized question order
}

export interface AssessmentResult {
  id: string;
  completed_at: string;
  scores: {
    depression: {
      score: number;
      level: StressLevel;
    };
    anxiety: {
      score: number;
      level: StressLevel;
    };
    stress: {
      score: number;
      level: StressLevel;
    };
  };
  overall_level: StressLevel;
  recommendations: string[];
}

export interface AssessmentProgress {
  currentQuestionIndex: number;
  answers: AssessmentAnswer[];
  isCompleted: boolean;
  startTime: string;
  lastUpdated: string;
}

// DASS-21 Questions Database
export const DASS_21_QUESTIONS: AssessmentQuestion[] = [
  // Depression Questions (D)
  { id: 'd1', text: 'I found it hard to wind down', category: 'depression', order: 1 },
  { id: 'd2', text: 'I tended to over-react to situations', category: 'depression', order: 2 },
  { id: 'd3', text: 'I felt that I was using a lot of nervous energy', category: 'depression', order: 3 },
  { id: 'd4', text: 'I felt that I was rather touchy', category: 'depression', order: 4 },
  { id: 'd5', text: 'I found it difficult to relax', category: 'depression', order: 5 },
  { id: 'd6', text: 'I found myself getting agitated', category: 'depression', order: 6 },
  { id: 'd7', text: 'I found it difficult to tolerate interruptions', category: 'depression', order: 7 },

  // Anxiety Questions (A)
  { id: 'a1', text: 'I was aware of dryness of my mouth', category: 'anxiety', order: 8 },
  { id: 'a2', text: 'I experienced breathing difficulty', category: 'anxiety', order: 9 },
  { id: 'a3', text: 'I experienced trembling (e.g., in the hands)', category: 'anxiety', order: 10 },
  { id: 'a4', text: 'I felt I was close to panic', category: 'anxiety', order: 11 },
  { id: 'a5', text: 'I felt scared without any good reason', category: 'anxiety', order: 12 },
  { id: 'a6', text: 'I perspired noticeably (e.g., sweaty hands)', category: 'anxiety', order: 13 },
  { id: 'a7', text: 'I was worried about situations in which I might panic and make a fool of myself', category: 'anxiety', order: 14 },

  // Stress Questions (S)
  { id: 's1', text: 'I found it hard to calm down after something upset me', category: 'stress', order: 15 },
  { id: 's2', text: 'I was aware of the action of my heart in the absence of physical exertion', category: 'stress', order: 16 },
  { id: 's3', text: 'I felt scared without any good reason', category: 'stress', order: 17 },
  { id: 's4', text: 'I found myself getting upset by quite trivial things', category: 'stress', order: 18 },
  { id: 's5', text: 'I was intolerant of anything that kept me from getting on with what I was doing', category: 'stress', order: 19 },
  { id: 's6', text: 'I felt that I was rather touchy', category: 'stress', order: 20 },
  { id: 's7', text: 'I found it difficult to relax', category: 'stress', order: 21 }
];

export const ANSWER_OPTIONS = [
  { value: 0, label: 'Never', description: 'Did not apply to me at all' },
  { value: 1, label: 'Sometimes', description: 'Applied to me to some degree, or some of the time' },
  { value: 2, label: 'Often', description: 'Applied to me to a considerable degree, or a good part of the time' },
  { value: 3, label: 'Almost always', description: 'Applied to me very much, or most of the time' }
] as const;

// Scoring thresholds for DASS-21
export const SCORING_THRESHOLDS = {
  depression: [
    { max: 9, level: 'normal' as StressLevel },
    { max: 13, level: 'mild' as StressLevel },
    { max: 20, level: 'moderate' as StressLevel },
    { max: 27, level: 'severe' as StressLevel },
    { max: 28, level: 'extremely_severe' as StressLevel }
  ],
  anxiety: [
    { max: 7, level: 'normal' as StressLevel },
    { max: 9, level: 'mild' as StressLevel },
    { max: 14, level: 'moderate' as StressLevel },
    { max: 19, level: 'severe' as StressLevel },
    { max: 20, level: 'extremely_severe' as StressLevel }
  ],
  stress: [
    { max: 14, level: 'normal' as StressLevel },
    { max: 18, level: 'mild' as StressLevel },
    { max: 25, level: 'moderate' as StressLevel },
    { max: 33, level: 'severe' as StressLevel },
    { max: 34, level: 'extremely_severe' as StressLevel }
  ]
} as const;