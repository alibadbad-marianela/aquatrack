import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeftRight, CheckCircle2, RotateCcw, Trophy, Sparkles, AlertTriangle } from 'lucide-react';

interface Game5SortHabitsProps {
  onSaveScore: (score: number, stars: number) => void;
  onBack: () => void;
}

type HabitCategory = 'saving' | 'wasting' | 'harmful';

interface HabitItem {
  id: string;
  text: string;
  correctCategory: HabitCategory;
  explanation: string;
}

const HABITS: HabitItem[] = [
  {
    id: 'h1',
    text: 'Recycling rice and vegetable rinse water to nourish outdoor garden plants',
    correctCategory: 'saving',
    explanation: 'Rinse water contains safe organic starches that hydrate soil without consuming fresh tap water.',
  },
  {
    id: 'h2',
    text: 'Thawing frozen meat under a continuous stream of warm running tap water',
    correctCategory: 'wasting',
    explanation: 'Thawing in the refrigerator overnight uses zero water and is much safer for food hygiene.',
  },
  {
    id: 'h3',
    text: 'Pouring used cooking oil and grease directly down the kitchen sink drain',
    correctCategory: 'harmful',
    explanation: 'Fats, Oils, and Grease (FOG) solidify into massive sewer fatbergs and asphyxiate aquatic river life.',
  },
  {
    id: 'h4',
    text: 'Installing a dual-flush conversion kit or displacement bottle inside the toilet tank',
    correctCategory: 'saving',
    explanation: 'Saves 3 to 6 Liters on every single flush, preventing thousands of wasted liters per month.',
  },
  {
    id: 'h5',
    text: 'Leaving the garden hose flowing continuously while washing family vehicles',
    correctCategory: 'wasting',
    explanation: 'An open hose sprays 20 Liters/min. Using a bucket and sponge saves up to 250 Liters per wash.',
  },
  {
    id: 'h6',
    text: 'Throwing plastic candy wrappers and food scraps into drainage canals (esteros)',
    correctCategory: 'harmful',
    explanation: 'Clogs urban drainage under RA 9003, worsening monsoon flash floods and polluting marine estuaries.',
  },
];

export const Game5SortHabits: React.FC<Game5SortHabitsProps> = ({ onSaveScore, onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentHabit = HABITS[currentIdx];

  const handleClassify = (cat: HabitCategory) => {
    if (isAnswered) return;
    setSelectedCategory(cat);
    setIsAnswered(true);

    if (cat === currentHabit.correctCategory) {
      setScore((s) => s + 20);
    }
  };

  const handleNext = () => {
    if (currentIdx < HABITS.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedCategory(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
      const finalScore = score + (selectedCategory === currentHabit.correctCategory ? 0 : 0);
      const stars = finalScore >= 100 ? 3 : finalScore >= 60 ? 2 : 1;
      onSaveScore(finalScore, stars);
      if (stars >= 2) confetti();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedCategory(null);
    setIsAnswered(false);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-xl space-y-6">
      {!completed ? (
        <>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Sort the Water Habits
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              {currentIdx + 1} of {HABITS.length} (Score: {score})
            </span>
          </div>

          {/* Current Habit Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-50 to-cyan-50/30 dark:from-[#0c1a2c] dark:to-[#102338] border border-cyan-500/20 text-center shadow-inner">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
              Activity To Classify
            </span>
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              "{currentHabit.text}"
            </p>
          </div>

          {/* 3 Classification Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleClassify('saving')}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border text-center transition-all ${
                isAnswered
                  ? currentHabit.correctCategory === 'saving'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500'
                    : selectedCategory === 'saving'
                    ? 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-600'
                    : 'opacity-40 border-slate-200 dark:border-slate-800'
                  : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 text-slate-800 dark:text-slate-200 font-semibold'
              }`}
            >
              <span className="text-xl block mb-1">💧</span>
              <span className="text-xs font-bold block">Water-Saving Habit</span>
            </button>

            <button
              onClick={() => handleClassify('wasting')}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border text-center transition-all ${
                isAnswered
                  ? currentHabit.correctCategory === 'wasting'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold ring-2 ring-amber-500'
                    : selectedCategory === 'wasting'
                    ? 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-600'
                    : 'opacity-40 border-slate-200 dark:border-slate-800'
                  : 'border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-50/30 text-slate-800 dark:text-slate-200 font-semibold'
              }`}
            >
              <span className="text-xl block mb-1">⏳</span>
              <span className="text-xs font-bold block">Water-Wasting Habit</span>
            </button>

            <button
              onClick={() => handleClassify('harmful')}
              disabled={isAnswered}
              className={`p-4 rounded-2xl border text-center transition-all ${
                isAnswered
                  ? currentHabit.correctCategory === 'harmful'
                    ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold ring-2 ring-red-500'
                    : selectedCategory === 'harmful'
                    ? 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-600'
                    : 'opacity-40 border-slate-200 dark:border-slate-800'
                  : 'border-slate-200 dark:border-slate-800 hover:border-red-500 hover:bg-red-50/30 text-slate-800 dark:text-slate-200 font-semibold'
              }`}
            >
              <span className="text-xl block mb-1">☣️</span>
              <span className="text-xs font-bold block">Harmful Pollution</span>
            </button>
          </div>

          {/* Feedback */}
          {isAnswered && (
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed animate-fade-in ${
                selectedCategory === currentHabit.correctCategory
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-800 dark:text-red-300'
              }`}
            >
              <p className="font-bold text-sm mb-1">
                {selectedCategory === currentHabit.correctCategory ? 'Correct Classification!' : 'Not Quite!'}
              </p>
              <p>{currentHabit.explanation}</p>
            </div>
          )}

          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20"
            >
              {currentIdx < HABITS.length - 1 ? 'Next Habit' : 'See Results'}
            </button>
          )}
        </>
      ) : (
        <div className="text-center space-y-6 py-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Habits Mastered!
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              You scored <span className="font-bold text-cyan-600 font-data">{score}</span> / 120 points
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            You know how to distinguish healthy water conservation practices from wasteful and environmentally hazardous habits!
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-1/2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
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
