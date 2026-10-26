import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, Trophy, ArrowRight, Award } from 'lucide-react';

interface Game1QuizProps {
  onSaveScore: (score: number, stars: number) => void;
  onBack: () => void;
}

const QUIZ_QUESTIONS = [
  {
    question: 'How much clean water can a single faucet dripping at one drop per second waste in a year?',
    options: ['About 10 Liters', 'Roughly 100 Liters', 'Over 11,000 Liters (3,000 Gallons)', 'Less than 1 Liter'],
    correct: 2,
    explanation: 'A steady drip squanders over 11,350 Liters annually — enough for more than 180 standard showers!',
  },
  {
    question: 'What is the most effective household test to check if a toilet has a silent flapper leak?',
    options: [
      'Listen closely with the bathroom door closed',
      'Add 5-10 drops of food coloring to the tank and check the bowl after 15 minutes',
      'Flush the toilet three times rapidly',
      'Turn the water supply valve completely off',
    ],
    correct: 1,
    explanation: 'If food coloring placed in the tank seeps into the bowl without flushing, the rubber flapper is degraded and leaking.',
  },
  {
    question: 'What primary statutory mandate does Republic Act No. 9275 enforce across the Philippines?',
    options: [
      'Mandatory water rationing every Sunday',
      'Comprehensive water quality management and wastewater discharge permits (Clean Water Act)',
      'A tax on municipal bottled water sales',
      'Prohibiting swimming in all national lakes',
    ],
    correct: 1,
    explanation: 'RA 9275 is the Philippine Clean Water Act of 2004, safeguarding inland and coastal water bodies through strict effluent standards.',
  },
  {
    question: 'What is the best time of day to water outdoor plants and garden beds to minimize evaporative loss?',
    options: ['Noon when the sun is at its peak', 'Early morning before 8:00 AM or late afternoon', 'Late evening at midnight only', 'During a rainstorm'],
    correct: 1,
    explanation: 'Watering in the early morning allows moisture to sink deep into the soil before hot daytime sun and wind evaporate it.',
  },
  {
    question: 'Which of the following describes greywater that can be safely reused for garden root irrigation?',
    options: [
      'Toilet bowl discharge water',
      'Untreated water used to wash raw meats',
      'Gentle rinse water from washing machines, bathroom sinks, and showers',
      'Chemical solvent wash water',
    ],
    correct: 2,
    explanation: 'Greywater comes from laundry and bathing. It should never be confused with blackwater (toilets) or grease-laden kitchen effluent.',
  },
];

export const Game1Quiz: React.FC<Game1QuizProps> = ({ onSaveScore, onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    if (idx === currentQ.correct) {
      setScore((prev) => prev + 20);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
      const finalScore = score + (selectedOpt === currentQ.correct ? 0 : 0);
      const stars = finalScore >= 80 ? 3 : finalScore >= 60 ? 2 : 1;
      onSaveScore(finalScore, stars);
      if (finalScore >= 60) confetti();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-xl">
      {!completed ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Score: {score} pts
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white leading-snug">
            {currentQ.question}
          </h3>

          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOpt === idx;
              const isCorrect = idx === currentQ.correct;

              let style = 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200';
              if (isAnswered) {
                if (isCorrect) {
                  style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold';
                } else if (isSelected) {
                  style = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300';
                } else {
                  style = 'border-slate-200 dark:border-slate-800 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-900 dark:text-cyan-300 animate-fade-in">
              <strong>Fact:</strong> {currentQ.explanation}
            </div>
          )}

          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <span>{currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="text-center space-y-6 py-4 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Quiz Completed!
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              You scored <span className="font-bold text-cyan-600 dark:text-cyan-400">{score}</span> out of 100 points
            </p>
          </div>

          <div className="flex justify-center gap-1.5 text-2xl">
            {score >= 60 ? '⭐⭐⭐' : score >= 40 ? '⭐⭐' : '⭐'}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
            {score >= 80
              ? 'Outstanding! You have exceptional water conservation awareness and legal knowledge.'
              : 'Great effort! Replay anytime or read our Learning Hub modules to master all questions.'}
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-1/2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Replay Quiz
            </button>
            <button
              onClick={onBack}
              className="w-1/2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold"
            >
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
