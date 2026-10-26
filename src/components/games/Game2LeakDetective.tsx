import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Search, CheckCircle2, RotateCcw, Trophy, Eye, Lightbulb, AlertTriangle, ArrowRight } from 'lucide-react';

interface Game2LeakDetectiveProps {
  onSaveScore: (score: number, stars: number) => void;
  onBack: () => void;
}

interface RoomItem {
  id: string;
  name: string;
  isLeaking: boolean;
  leakDescription: string;
  fixTip: string;
}

interface Room {
  id: string;
  name: string;
  items: RoomItem[];
}

const ROOMS: Room[] = [
  {
    id: 'bathroom',
    name: 'Bathroom',
    items: [
      { id: 'bath-toilet', name: 'Toilet Tank & Flapper', isLeaking: true, leakDescription: 'Silent rubber flapper leak seeping 200 Liters/day down the drain!', fixTip: 'Replace the cracked rubber flapper ($5 part) to immediately stop silent water loss.' },
      { id: 'bath-faucet', name: 'Sink Faucet', isLeaking: true, leakDescription: 'Worn neoprene washer causing a constant 1-drop/sec leak.', fixTip: 'Disassemble handle and replace the 10-cent O-ring washer.' },
      { id: 'bath-shower', name: 'Showerhead', isLeaking: false, leakDescription: 'Normal flow, tight thread seal.', fixTip: 'Showerhead is properly sealed with Teflon tape.' },
      { id: 'bath-mirror', name: 'Vanity Cabinet', isLeaking: false, leakDescription: 'Dry and clean.', fixTip: 'No moisture detected.' },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    items: [
      { id: 'kitchen-sink', name: 'Kitchen Faucet Base', isLeaking: true, leakDescription: 'Loose swivel spout O-ring puddling water on countertop.', fixTip: 'Tighten swivel nut or replace the dual O-rings inside the neck.' },
      { id: 'kitchen-drain', name: 'Under-Sink P-Trap', isLeaking: true, leakDescription: 'Corroded slip nut dripping into cupboard wood.', fixTip: 'Hand-tighten PVC slip joint or add a fresh rubber slip washer.' },
      { id: 'kitchen-fridge', name: 'Refrigerator Dispenser', isLeaking: false, leakDescription: 'Dry water line.', fixTip: 'Compression fitting is secure.' },
      { id: 'kitchen-stove', name: 'Cooktop Area', isLeaking: false, leakDescription: 'Dry surface.', fixTip: 'No water lines near stove.' },
    ],
  },
  {
    id: 'garden',
    name: 'Outdoor Garden',
    items: [
      { id: 'garden-spigot', name: 'Outdoor Hose Bibb (Spigot)', isLeaking: true, leakDescription: 'Packing nut leak spraying when hose is attached.', fixTip: 'Tighten packing nut beneath the faucet handle with an adjustable wrench.' },
      { id: 'garden-hose', name: 'Garden Hose Coupler', isLeaking: true, leakDescription: 'Missing internal vinyl washer squirting high-pressure water onto driveway.', fixTip: 'Insert a 50-cent round hose gasket washer inside the female coupling.' },
      { id: 'garden-pot', name: 'Terracotta Planters', isLeaking: false, leakDescription: 'Normal potted soil.', fixTip: 'Moisture from healthy watering.' },
      { id: 'garden-barrel', name: 'Rain Barrel Overflow', isLeaking: false, leakDescription: 'Clean overflow diverted to grass.', fixTip: 'Rainwater collection operating properly.' },
    ],
  },
];

export const Game2LeakDetective: React.FC<Game2LeakDetectiveProps> = ({ onSaveScore, onBack }) => {
  const [activeRoomIdx, setActiveRoomIdx] = useState(0);
  const [foundLeaks, setFoundLeaks] = useState<string[]>([]);
  const [inspectedItems, setInspectedItems] = useState<string[]>([]);
  const [activeItemInfo, setActiveItemInfo] = useState<RoomItem | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentRoom = ROOMS[activeRoomIdx];
  const totalLeaksInGame = ROOMS.reduce((acc, r) => acc + r.items.filter((i) => i.isLeaking).length, 0);

  const handleInspect = (item: RoomItem) => {
    setActiveItemInfo(item);
    if (!inspectedItems.includes(item.id)) {
      setInspectedItems((prev) => [...prev, item.id]);
    }

    if (item.isLeaking && !foundLeaks.includes(item.id)) {
      const nextFound = [...foundLeaks, item.id];
      setFoundLeaks(nextFound);

      if (nextFound.length === totalLeaksInGame) {
        setCompleted(true);
        const finalScore = Math.max(50, 100 - (hintUsed ? 15 : 0));
        onSaveScore(finalScore, 3);
        confetti();
      }
    }
  };

  const handleRestart = () => {
    setActiveRoomIdx(0);
    setFoundLeaks([]);
    setInspectedItems([]);
    setActiveItemInfo(null);
    setHintUsed(false);
    setCompleted(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-xl space-y-6">
      {!completed ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-500" />
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Leak Detective Patrol
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Inspect items in each room and uncover all {totalLeaksInGame} hidden household water leaks
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 font-bold text-xs">
                Found: {foundLeaks.length}/{totalLeaksInGame} Leaks
              </span>
              <button
                onClick={() => setHintUsed(true)}
                className="p-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950 text-amber-600 text-xs flex items-center gap-1"
                title="Reveal room hint"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Hint</span>
              </button>
            </div>
          </div>

          {/* Room Selector */}
          <div className="flex gap-2">
            {ROOMS.map((room, idx) => {
              const roomLeaks = room.items.filter((i) => i.isLeaking);
              const foundInRoom = roomLeaks.filter((i) => foundLeaks.includes(i.id)).length;
              const isCurrent = activeRoomIdx === idx;

              return (
                <button
                  key={room.id}
                  onClick={() => {
                    setActiveRoomIdx(idx);
                    setActiveItemInfo(null);
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-semibold border transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{room.name}</span>
                  <span className="text-[10px] opacity-75">
                    {foundInRoom}/{roomLeaks.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Room Scene Items Grid */}
          <div className="grid grid-cols-2 gap-3">
            {currentRoom.items.map((item) => {
              const isFound = foundLeaks.includes(item.id);
              const isInspected = inspectedItems.includes(item.id);

              return (
                <button
                  key={item.id}
                  onClick={() => handleInspect(item)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                    isFound
                      ? 'border-red-400 bg-red-50/70 dark:bg-red-950/30'
                      : isInspected
                      ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c]'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#10243A] hover:border-cyan-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </span>
                    {isFound ? (
                      <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    ) : isInspected ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Eye className="w-4 h-4 text-slate-400 group-hover:text-cyan-500 shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                    {isFound ? '⚠️ Active Leak Detected!' : isInspected ? 'Checked: No Leak' : 'Click to inspect with magnifying glass'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Inspected Feedback Panel */}
          {activeItemInfo && (
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed animate-fade-in ${
                activeItemInfo.isLeaking
                  ? 'bg-red-50/80 dark:bg-red-950/40 border-red-300 dark:border-red-900 text-red-800 dark:text-red-300'
                  : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
              }`}
            >
              <h4 className="font-bold text-sm mb-1">{activeItemInfo.name} Report</h4>
              <p className="mb-2">{activeItemInfo.leakDescription}</p>
              <p>
                <strong>Inspector Solution:</strong> {activeItemInfo.fixTip}
              </p>
            </div>
          )}

          {hintUsed && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/60 text-xs text-amber-800 dark:text-amber-300">
              💡 <strong>Detective Hint:</strong> Check items with moving valves, rubber gaskets, or pressurized hose couplings first!
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
              All Leaks Solved!
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              You uncovered all {totalLeaksInGame} household leaks and saved over 15,000 Liters of water annually!
            </p>
          </div>

          <div className="flex justify-center gap-1.5 text-2xl">⭐⭐⭐</div>

          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            You are now equipped with real-world leak detection skills you can use in your actual home and school today.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="w-1/2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Patrol Again
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
