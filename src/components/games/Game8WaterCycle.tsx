import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CloudRain, CheckCircle2, RotateCcw, Trophy, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

interface Game8WaterCycleProps {
  onSaveScore: (score: number, stars: number) => void;
  onBack: () => void;
}

interface Stage {
  id: string;
  name: string;
  icon: string;
  correctOrder: number;
  description: string;
}

const STAGES: Stage[] = [
  { id: 'evap', name: 'Evaporation', icon: '☀️', correctOrder: 1, description: 'Solar energy warms oceans, rivers, and soil, converting liquid water into buoyant invisible water vapor.' },
  { id: 'trans', name: 'Transpiration', icon: '🌿', correctOrder: 2, description: 'Forest trees and plants draw water through roots and exhale moisture into the air through leaf stomata.' },
  { id: 'cond', name: 'Condensation', icon: '☁️', correctOrder: 3, description: 'Rising water vapor cools in the high atmosphere, condensing into microscopic droplets that form clouds.' },
  { id: 'precip', name: 'Precipitation', icon: '🌧️', correctOrder: 4, description: 'Cloud water droplets merge until heavy enough to fall to Earth as rainfall or tropical monsoons.' },
  { id: 'infilt', name: 'Infiltration & Recharge', icon: '⛰️', correctOrder: 5, description: 'Rainwater soaks into mountain forest soil, filtering naturally to recharge subterranean aquifers.' },
  { id: 'runoff', name: 'Surface Runoff & Collection', icon: '🌊', correctOrder: 6, description: 'Excess water flows through creeks and rivers back into lakes and oceans, completing the closed cycle.' },
];

function shuffleStages(array: Stage[]): Stage[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export const Game8WaterCycle: React.FC<Game8WaterCycleProps> = ({ onSaveScore, onBack }) => {
  const [stages, setStages] = useState<Stage[]>(() => shuffleStages(STAGES));
  const [validated, setValidated] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...stages];
    const temp = newArr[index - 1];
    newArr[index - 1] = newArr[index];
    newArr[index] = temp;
    setStages(newArr);
    setValidated(false);
  };

  const moveDown = (index: number) => {
    if (index === stages.length - 1) return;
    const newArr = [...stages];
    const temp = newArr[index + 1];
    newArr[index + 1] = newArr[index];
    newArr[index] = temp;
    setStages(newArr);
    setValidated(false);
  };

  const handleValidate = () => {
    setAttempts((a) => a + 1);
    const correct = stages.every((s, i) => s.correctOrder === i + 1);
    setValidated(true);
    setIsCorrect(correct);

    if (correct) {
      const stars = attempts === 0 ? 3 : attempts <= 2 ? 2 : 1;
      const score = Math.max(50, 100 - attempts * 10);
      onSaveScore(score, stars);
      confetti();
    }
  };

  const handleReset = () => {
    setStages(shuffleStages(STAGES));
    setValidated(false);
    setIsCorrect(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <CloudRain className="w-5 h-5 text-cyan-500" />
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
            Water Cycle Sequence Puzzle
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          title="Shuffle sequence"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Arrange the 6 hydrological phases in chronological order from solar evaporation to ocean collection:
      </p>

      {/* Ordered List of Stages */}
      <div className="space-y-2.5">
        {stages.map((stage, idx) => {
          const isSlotCorrect = validated && stage.correctOrder === idx + 1;

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                validated
                  ? isSlotCorrect
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                    : 'border-red-400 bg-red-50/50 dark:bg-red-950/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1a2c]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xl shrink-0">{stage.icon}</span>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    {stage.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{stage.description}</p>
                </div>
              </div>

              {/* Up / Down Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 disabled:opacity-20"
                  aria-label="Move stage up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  disabled={idx === stages.length - 1}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 disabled:opacity-20"
                  aria-label="Move stage down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {validated && (
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed animate-fade-in ${
            isCorrect
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
              : 'bg-red-50 dark:bg-red-950/40 border-red-300 text-red-800 dark:text-red-300'
          }`}
        >
          {isCorrect ? (
            <div className="space-y-1">
              <p className="font-bold text-sm">Perfect Hydrological Sequence!</p>
              <p>
                The Earth's water cycle is a continuous closed loop: solar evaporation and plant transpiration feed clouds, rain recharges deep aquifers, and surface rivers return water to the sea.
              </p>
            </div>
          ) : (
            <p>
              Some stages are currently out of sequence. Remember: Evaporation & Transpiration come first, followed by cloud Condensation, Rain Precipitation, Infiltration into aquifers, and Surface Runoff!
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        {!isCorrect ? (
          <button
            onClick={handleValidate}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20"
          >
            Check Sequence Order
          </button>
        ) : (
          <button
            onClick={onBack}
            className="w-full py-3 rounded-xl bg-cyan-600 text-white font-semibold text-xs sm:text-sm"
          >
            Back to Games
          </button>
        )}
      </div>
    </div>
  );
};
