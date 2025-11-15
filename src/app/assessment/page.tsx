'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { DASS_21_QUESTIONS, ANSWER_OPTIONS, AssessmentAnswer, AssessmentProgress, AssessmentResult } from '@/types';
import { Card } from '@/components/ui/Card';

export default function AssessmentPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState(DASS_21_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(new Date().toISOString());

  // Randomize questions on mount
  useEffect(() => {
    const shuffled = [...DASS_21_QUESTIONS]
      .map((question, index) => ({ ...question, originalIndex: index }))
      .sort(() => Math.random() - 0.5)
      .map((question, index) => ({ ...question, order: index + 1 }));

    setQuestions(shuffled);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: number) => {
    const newAnswer: AssessmentAnswer = {
      questionId: currentQuestion.id,
      value,
    };

    // Update or add answer
    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 300);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const getCurrentAnswer = () => {
    const answer = answers.find(a => a.questionId === currentQuestion.id);
    return answer?.value;
  };

  const calculateScores = () => {
    const scores = {
      depression: 0,
      anxiety: 0,
      stress: 0,
    };

    answers.forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        scores[question.category] += answer.value;
      }
    });

    return scores;
  };

  const getStressLevel = (score: number, category: 'depression' | 'anxiety' | 'stress') => {
    const thresholds = {
      depression: [9, 13, 20, 27, 28],
      anxiety: [7, 9, 14, 19, 20],
      stress: [14, 18, 25, 33, 34],
    };

    const levels = ['normal', 'mild', 'moderate', 'severe', 'extremely_severe'] as const;
    const categoryThresholds = thresholds[category];

    for (let i = 0; i < categoryThresholds.length; i++) {
      if (score <= categoryThresholds[i]) {
        return levels[i];
      }
    }
    return 'extremely_severe';
  };

  const handleSubmit = async () => {
    if (answers.length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const scores = calculateScores();
      const assessmentData = {
        depression_score: scores.depression,
        anxiety_score: scores.anxiety,
        stress_score: scores.stress,
        depression_level: getStressLevel(scores.depression, 'depression'),
        anxiety_level: getStressLevel(scores.anxiety, 'anxiety'),
        stress_level: getStressLevel(scores.stress, 'stress'),
        answers: answers.reduce((acc, answer) => {
          acc[answer.questionId] = answer.value;
          return acc;
        }, {} as Record<string, number>),
        question_order: questions.map(q => q.originalIndex),
      };

      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData),
      });

      if (!response.ok) {
        throw new Error('Failed to save assessment');
      }

      const result = await response.json();
      setIsCompleted(true);

      // Redirect to results page after showing completion
      setTimeout(() => {
        router.push(`/assessment/results?id=${result.data.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsCompleted(false);
    setIsStarted(false);

    // Re-randomize questions
    const shuffled = [...DASS_21_QUESTIONS]
      .map((question, index) => ({ ...question, originalIndex: index }))
      .sort(() => Math.random() - 0.5)
      .map((question, index) => ({ ...question, order: index + 1 }));

    setQuestions(shuffled);
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-bg via-white to-cream-bg py-12">
        <div className="container-golden">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-bold text-dark-brown mb-6">
                DASS-21 Stress Assessment
              </h1>
              <div className="text-text-brown mb-8 space-y-4">
                <p className="text-lg leading-relaxed">
                  This evidence-based assessment helps measure your levels of depression, anxiety, and stress.
                  It consists of 21 questions and takes approximately 5-10 minutes to complete.
                </p>
                <div className="bg-cream-bg rounded-xl p-6 text-left">
                  <h3 className="font-semibold text-dark-brown mb-4">How it works:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-primary-bronze mr-2">•</span>
                      Answer each question based on how you've felt over the past week
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-bronze mr-2">•</span>
                      There are no right or wrong answers - be honest with yourself
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-bronze mr-2">•</span>
                      Your results are confidential and will help personalize your experience
                    </li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => setIsStarted(true)}
                className="btn-primary text-lg px-8 py-4"
              >
                Begin Assessment
              </button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-bg via-white to-cream-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-bronze rounded-full flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-dark-brown mb-4">
            Assessment Complete!
          </h2>
          <p className="text-text-brown mb-8">
            Your responses have been saved. Redirecting to your results...
          </p>
          <div className="w-8 h-8 border-2 border-primary-bronze border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-bg via-white to-cream-bg py-8">
      <div className="container-golden">
        <div className="max-w-4xl mx-auto">
          {/* Header with progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-dark-brown">
                Stress Assessment
              </h1>
              <button
                onClick={resetAssessment}
                className="flex items-center space-x-2 text-text-brown hover:text-dark-brown transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Progress bar */}
            <div className="bg-cream-bg rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-bronze to-sandy-orange h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-text-brown">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-primary-bronze">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>

          {/* Question card */}
          {currentQuestion && (
            <Card className="p-8 mb-8">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="bg-primary-bronze text-white text-sm font-medium px-3 py-1 rounded-full">
                    {currentQuestion.order}
                  </span>
                  <span className="text-sm text-text-brown capitalize">
                    {currentQuestion.category}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-dark-brown leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>

              {/* Answer options */}
              <div className="space-y-3">
                {ANSWER_OPTIONS.map((option) => {
                  const isSelected = getCurrentAnswer() === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                        isSelected
                          ? 'border-primary-bronze bg-primary-bronze/5 shadow-md'
                          : 'border-light-bronze/30 hover:border-primary-bronze/50 bg-white'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? 'border-primary-bronze bg-primary-bronze'
                            : 'border-light-bronze/50'
                        }`}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-dark-brown mb-1">
                            {option.label}
                          </div>
                          <div className="text-sm text-text-brown">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl border-2 border-light-bronze/30 text-text-brown hover:border-primary-bronze hover:text-primary-bronze transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentQuestionIndex === questions.length - 1 && answers.length === questions.length ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Assessment</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!getCurrentAnswer() || currentQuestionIndex === questions.length - 1}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl border-2 border-light-bronze/30 text-text-brown hover:border-primary-bronze hover:text-primary-bronze transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}