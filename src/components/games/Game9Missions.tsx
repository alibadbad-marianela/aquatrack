import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckSquare, Square, Trophy, Sparkles, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';

interface Game9MissionsProps {
  onSaveScore: (score: number, stars: number) => void;
  onBack: () => void;
}

interface Mission {
  id: string;
  title: string;
  category: string;
  description: string;
  litersSavedEst: number;
}

const MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Toothbrush Cup Protocol',
    category: 'Personal Care',
    description: 'Use a cup of water to rinse teeth rather than leaving the faucet flowing continuously.',
    litersSavedEst: 15,
  },
  {
    id: 'm2',
    title: 'Sunrise Plant Hydration',
    category: 'Gardening',
    description: 'Water all outdoor shrubs and potted plants before 9:00 AM or after sunset to stop rapid midday evaporation.',
    litersSavedEst: 25,
  },
  {
    id: 'm3',
    title: 'Food Coloring Toilet Flapper Check',
    category: 'Leak Audit',
    description: 'Place 5 drops of food coloring in the toilet tank and verify zero dye leaks into the bowl after 15 minutes.',
    litersSavedEst: 60,
  },
  {
    id: 'm4',
    title: 'Kitchen FOG Containment',
    category: 'Pollution Prevention',
    description: 'Collect used cooking oil in a glass container; never pour warm grease or cooking oil down the sink drain.',
    litersSavedEst: 40,
  },
  {
    id: 'm5',
    title: 'Batch Laundry Optimization',
    category: 'Appliance',
    description: 'Wait until laundry hamper is full before starting the washing machine cycle.',
    litersSavedEst: 50,
  },
];

export const Game9Missions: React.FC<Game9MissionsProps> = ({ onSaveScore, onBack }) => {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const toggleMission = (id: string) => {
    let next: string[];
    if (completedIds.includes(id)) {
      next = completedIds.filter((mId) => mId !== id);
    } else {
      next = [...completedIds, id];
    }
    setCompletedIds(next);

    const score = Math.round((next.length / MISSIONS.length) * 100);
    const stars = next.length === MISSIONS.length ? 3 : next.length >= 3 ? 2 : 1;
    onSaveScore(score, stars);

    if (next.length === MISSIONS.length) {
      confetti();
    }
  };

  const totalSavedToday = MISSIONS.filter((m) => completedIds.includes(m.id)).reduce(
    (acc, m) => acc + m.litersSavedEst,
    0
  );

  return (
    <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-cyan-500" />
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Daily Conservation Missions
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Check off self-reported conservation practices completed in your household today
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed</span>
          <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-data">
            {completedIds.length} / {MISSIONS.length} Missions
          </span>
        </div>
      </div>

      {/* Daily impact banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-teal-500/10 border border-cyan-500/20 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            Estimated Daily Savings
          </span>
          <p className="text-[11px] text-slate-500">From checked actions</p>
        </div>
        <span className="text-xl font-bold font-data text-cyan-600 dark:text-cyan-400">
          ~{totalSavedToday} Liters
        </span>
      </div>

      {/* Mission Checklist */}
      <div className="space-y-3">
        {MISSIONS.map((m) => {
          const isDone = completedIds.includes(m.id);

          return (
            <button
              key={m.id}
              onClick={() => toggleMission(m.id)}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                isDone
                  ? 'border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1a2c] hover:border-cyan-500'
              }`}
            >
              <div className="mt-0.5 text-cyan-600 dark:text-cyan-400 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${isDone ? 'text-emerald-800 dark:text-emerald-300 line-through' : 'text-slate-900 dark:text-white'}`}>
                    {m.title}
                  </h4>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                    +{m.litersSavedEst}L
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {completedIds.length === MISSIONS.length && (
        <div className="p-4 text-center rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-900 dark:text-cyan-300 animate-fade-in">
          🎉 <strong>All Daily Missions Fulfilled!</strong> You maintained a clean, leak-free, water-smart household today.
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
        >
          Back to Games
        </button>
      </div>
    </div>
  );
};
