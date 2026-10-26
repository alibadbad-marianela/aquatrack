import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Waves, Trophy, RotateCcw, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Game7RiverCleanupProps {
  onSaveScore: (score: number, stars: number) => void;
  onBack: () => void;
}

interface RiverItem {
  id: number;
  label: string;
  icon: string;
  isTrash: boolean;
  points: number;
}

const TRASH_TYPES = [
  { label: 'Plastic Bottle', icon: '🧴', isTrash: true, points: 10 },
  { label: 'Discarded Tire', icon: '🛞', isTrash: true, points: 15 },
  { label: 'Food Styrofoam', icon: '🥡', isTrash: true, points: 10 },
  { label: 'Aluminum Can', icon: '🥫', isTrash: true, points: 10 },
  { label: 'Oil Slick Patch', icon: '🛢️', isTrash: true, points: 20 },
];

const NATURE_TYPES = [
  { label: 'Freshwater Fish', icon: '🐟', isTrash: false, points: -15 },
  { label: 'River Reed', icon: '🌿', isTrash: false, points: -10 },
  { label: 'River Crab', icon: '🦀', isTrash: false, points: -15 },
];

export const Game7RiverCleanup: React.FC<Game7RiverCleanupProps> = ({ onSaveScore, onBack }) => {
  const [items, setItems] = useState<RiverItem[]>([]);
  const [score, setScore] = useState(0);
  const [cleanedTrashCount, setCleanedTrashCount] = useState(0);
  const [targetTrash] = useState(12);
  const [completed, setCompleted] = useState(false);
  const [lastNotice, setLastNotice] = useState<string | null>(null);

  // Spawns items in the river
  useEffect(() => {
    if (completed) return;

    const interval = setInterval(() => {
      setItems((prev) => {
        if (prev.length >= 8) return prev;
        const isSpawningTrash = Math.random() > 0.3;
        const template = isSpawningTrash
          ? TRASH_TYPES[Math.floor(Math.random() * TRASH_TYPES.length)]
          : NATURE_TYPES[Math.floor(Math.random() * NATURE_TYPES.length)];

        const newItem: RiverItem = {
          id: Date.now() + Math.random(),
          ...template,
        };
        return [...prev, newItem];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [completed]);

  const handleClickItem = (item: RiverItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    if (item.isTrash) {
      const nextCleaned = cleanedTrashCount + 1;
      setCleanedTrashCount(nextCleaned);
      setScore((s) => s + item.points);
      setLastNotice(`Cleaned: ${item.label} (+${item.points} pts)`);

      if (nextCleaned >= targetTrash) {
        setCompleted(true);
        const finalScore = score + item.points;
        onSaveScore(Math.max(50, finalScore), 3);
        confetti();
      }
    } else {
      setScore((s) => Math.max(0, s + item.points));
      setLastNotice(`⚠️ Protected Wildlife! Leave the ${item.label} in the river (${item.points} pts)`);
    }
  };

  const handleRestart = () => {
    setItems([]);
    setScore(0);
    setCleanedTrashCount(0);
    setCompleted(false);
    setLastNotice(null);
  };

  const riverCleanlinessPct = Math.round((cleanedTrashCount / targetTrash) * 100);

  return (
    <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-xl space-y-6">
      {!completed ? (
        <>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-cyan-500" />
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  River Cleanup Challenge
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Click floating pollutants before they reach the ocean estuary. Do not disturb wildlife!
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Cleanliness</span>
              <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-data">
                {riverCleanlinessPct}% ({cleanedTrashCount}/{targetTrash})
              </span>
            </div>
          </div>

          {/* Cleanliness Bar */}
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-teal-400 transition-all duration-300"
              style={{ width: `${riverCleanlinessPct}%` }}
            />
          </div>

          {/* River Stream Simulation Surface */}
          <div className="h-64 rounded-3xl bg-gradient-to-b from-blue-500/20 via-cyan-500/30 to-blue-600/40 dark:from-[#0c1a2c] dark:to-[#10243A] border border-cyan-500/30 relative overflow-hidden flex items-center justify-center p-4">
            {/* Water flow waves */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]" />

            {items.length === 0 ? (
              <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                Scanning the river current for pollutants...
              </span>
            ) : (
              <div className="grid grid-cols-4 gap-3 w-full h-full p-2 relative z-10">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleClickItem(item)}
                    className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/60 dark:border-slate-700 shadow-md hover:scale-110 active:scale-95 transition-all flex flex-col items-center justify-center"
                  >
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-full">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {lastNotice && (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200 dark:border-slate-800 text-xs text-center font-medium text-slate-700 dark:text-slate-300">
              {lastNotice}
            </div>
          )}
        </>
      ) : (
        <div className="text-center space-y-6 py-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              River Restored to Health!
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              You cleared all {targetTrash} waste items and scored{' '}
              <span className="font-bold text-cyan-600 font-data">{score} points</span>.
            </p>
          </div>

          <div className="flex justify-center gap-1.5 text-2xl">⭐⭐⭐</div>

          <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-700 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
            By preventing plastics and chemical slicks from washing into municipal rivers, you protect delicate mangrove sanctuaries and coastal coral reefs downstream under RA 9275 and RA 9003!
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-1/2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clean Again
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
