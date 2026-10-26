import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Footprints, Droplets, Trophy, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Game3FootprintProps {
  onSaveScore: (score: number, stars: number) => void;
  onBack: () => void;
}

interface Dilemma {
  id: string;
  scenario: string;
  optionA: { label: string; liters: number; explanation: string };
  optionB: { label: string; liters: number; explanation: string };
}

const DILEMMAS: Dilemma[] = [
  {
    id: 'dilemma-1',
    scenario: 'Morning Shower Routine',
    optionA: { label: '15-Minute Unrestricted Shower', liters: 180, explanation: 'Standard showerheads discharge 12 Liters/minute, totaling 180 Liters for 15 minutes.' },
    optionB: { label: '5-Minute Shower with Low-Flow Aerator', liters: 30, explanation: 'Low-flow showerheads (6L/min) for 5 minutes consume only 30 Liters, saving 150 Liters daily!' },
  },
  {
    id: 'dilemma-2',
    scenario: 'Brushing Teeth Morning & Night',
    optionA: { label: 'Leaving the Tap Running Constantly', liters: 24, explanation: 'A flowing tap wastes 6 Liters per minute, or 24 Liters for two 2-minute brushing sessions.' },
    optionB: { label: 'Using a Cup of Water for Rinsing', liters: 1, explanation: 'Filling a reusable glass uses just 0.5 Liters per session (1 Liter daily), saving 23 Liters!' },
  },
  {
    id: 'dilemma-3',
    scenario: 'Vehicle & Bicycle Cleaning',
    optionA: { label: 'Open Running Garden Hose', liters: 300, explanation: 'A garden hose gushes roughly 20 Liters/minute, consuming 300 Liters during a 15-minute wash.' },
    optionB: { label: 'Two Buckets (Timba at Tabo) & Sponge', liters: 30, explanation: 'Using two 15-Liter buckets accomplishes a spotless clean while saving 270 Liters of water.' },
  },
  {
    id: 'dilemma-4',
    scenario: 'Washing Dinner Dishes',
    optionA: { label: 'Washing Under Continuous Flowing Faucet', liters: 80, explanation: 'Rinsing dishes under continuous running water runs through 80 Liters.' },
    optionB: { label: 'Filling Dual Wash Basins (Soapy + Rinse)', liters: 20, explanation: 'Two filled basins clean the same stack of dishes with only 20 Liters, saving 60 Liters!' },
  },
  {
    id: 'dilemma-5',
    scenario: 'Weekend Laundry',
    optionA: { label: 'Three Small Half-Loads in Washing Machine', liters: 180, explanation: 'Three separate half-loads use 60 Liters each, consuming 180 Liters for small amounts of clothing.' },
    optionB: { label: 'One Optimized Full Load', liters: 70, explanation: 'Running one single full load cleans all garments using only 70 Liters, saving 110 Liters!' },
  },
];

export const Game3Footprint: React.FC<Game3FootprintProps> = ({ onSaveScore, onBack }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, 'A' | 'B'>>({});
  const [completed, setCompleted] = useState(false);

  const current = DILEMMAS[currentIdx];

  const handleChoose = (choice: 'A' | 'B') => {
    const updated = { ...selectedChoices, [current.id]: choice };
    setSelectedChoices(updated);

    if (currentIdx < DILEMMAS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCompleted(true);
      // Calculate total saved water
      let totalSaved = 0;
      for (const d of DILEMMAS) {
        const c = updated[d.id];
        if (c === 'B') {
          totalSaved += d.optionA.liters - d.optionB.liters;
        }
      }
      const score = Math.round((totalSaved / 613) * 100);
      const stars = score >= 80 ? 3 : score >= 60 ? 2 : 1;
      onSaveScore(score, stars);
      if (stars >= 2) confetti();
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedChoices({});
    setCompleted(false);
  };

  const totalSavedLiters = DILEMMAS.reduce((acc, d) => {
    return selectedChoices[d.id] === 'B' ? acc + (d.optionA.liters - d.optionB.liters) : acc;
  }, 0);

  return (
    <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-xl space-y-6">
      {!completed ? (
        <>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Footprints className="w-5 h-5 text-cyan-500" />
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Water Footprint Challenge
              </h3>
            </div>
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
              Scenario {currentIdx + 1} of {DILEMMAS.length}
            </span>
          </div>

          <div className="text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Everyday Dilemma</span>
            <h4 className="text-xl font-bold font-display text-slate-900 dark:text-white">{current.scenario}</h4>
            <p className="text-xs text-slate-500">Pick which habit you would adopt in your daily life:</p>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {/* Option A */}
            <button
              onClick={() => handleChoose('A')}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 bg-white dark:bg-[#0c1a2c] text-left transition-all group"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-500">
                  Option A: {current.optionA.label}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full">
                  {current.optionA.liters} Liters
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {current.optionA.explanation}
              </p>
            </button>

            {/* Option B */}
            <button
              onClick={() => handleChoose('B')}
              className="p-5 rounded-2xl border border-cyan-500/40 hover:border-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20 text-left transition-all group ring-1 ring-cyan-500/20"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-500">
                  Option B: {current.optionB.label}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full">
                  {current.optionB.liters} Liters
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {current.optionB.explanation}
              </p>
            </button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-6 py-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Footprint Calculated!
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Your decisions conserved{' '}
              <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400 font-data">
                {totalSavedLiters} Liters
              </span>{' '}
              of clean domestic water daily!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-700 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
            Over a full year, adopting these 5 simple water-smart choices saves over{' '}
            <strong>{(totalSavedLiters * 365).toLocaleString()} Liters</strong> of clean municipal water for your household!
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-1/2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Challenge
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
