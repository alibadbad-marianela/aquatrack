import React, { useState } from 'react';
import { GameScore } from '../../types';
import { Game1Quiz } from './Game1Quiz';
import { Game2LeakDetective } from './Game2LeakDetective';
import { Game3Footprint } from './Game3Footprint';
import { Game4SmartHome } from './Game4SmartHome';
import { Game5SortHabits } from './Game5SortHabits';
import { Game6MemoryMatch } from './Game6MemoryMatch';
import { Game7RiverCleanup } from './Game7RiverCleanup';
import { Game8WaterCycle } from './Game8WaterCycle';
import { Game9Missions } from './Game9Missions';
import { Game10Aquarium } from './Game10Aquarium';
import { Gamepad2, Play, Star, Trophy, Sparkles, ArrowLeft } from 'lucide-react';

interface GamesHubProps {
  scores: GameScore[];
  onSaveScore: (gameId: string, score: number, stars: number) => Promise<void>;
}

interface GameMeta {
  id: string;
  title: string;
  icon: string;
  category: string;
  description: string;
  component: React.ComponentType<{ onSaveScore: (score: number, stars: number) => void; onBack: () => void }>;
}

const ALL_GAMES: GameMeta[] = [
  {
    id: 'game-1',
    title: 'Water-Saving Quiz',
    icon: '❓',
    category: 'Trivia & Science',
    description: 'Test your knowledge on domestic water efficiency, silent leaks, and Philippine Clean Water regulations.',
    component: Game1Quiz,
  },
  {
    id: 'game-2',
    title: 'Leak Detective Patrol',
    icon: '🔍',
    category: 'Inspection & Repair',
    description: 'Inspect household rooms to locate worn flappers, faucet washers, and loose pipe slip-joints.',
    component: Game2LeakDetective,
  },
  {
    id: 'game-3',
    title: 'Water Footprint Challenge',
    icon: '👣',
    category: 'Lifestyle Impact',
    description: 'Compare everyday dilemmas and quantify how many thousands of liters simple habit tweaks conserve.',
    component: Game3Footprint,
  },
  {
    id: 'game-4',
    title: 'Build a Water-Smart Home',
    icon: '🏡',
    category: 'Green Architecture',
    description: 'Select and install aerators, dual-flush toilets, and rain barrels to boost home efficiency to 100%.',
    component: Game4SmartHome,
  },
  {
    id: 'game-5',
    title: 'Sort the Water Habits',
    icon: '🔄',
    category: 'Habit Classification',
    description: 'Rapidly classify daily actions into Water-Saving, Water-Wasting, or Harmful Waterway Pollution.',
    component: Game5SortHabits,
  },
  {
    id: 'game-6',
    title: 'Aquatic Memory Match',
    icon: '🪸',
    category: 'Memory & Biodiversity',
    description: 'Flip and match Philippine marine and watershed species, from the Dugong to the Taal Tawilis.',
    component: Game6MemoryMatch,
  },
  {
    id: 'game-7',
    title: 'River Cleanup Challenge',
    icon: '🌊',
    category: 'Reflex & Watersheds',
    description: 'Retrieve floating plastics, tires, and oil slicks before they wash downstream to coastal reefs.',
    component: Game7RiverCleanup,
  },
  {
    id: 'game-8',
    title: 'Water Cycle Sequence Puzzle',
    icon: '🌧️',
    category: 'Hydrology Science',
    description: 'Reorder the 6 stages of the Earth’s natural water cycle from solar evaporation to aquifer recharge.',
    component: Game8WaterCycle,
  },
  {
    id: 'game-9',
    title: 'Daily Conservation Missions',
    icon: '📋',
    category: 'Habit Missions',
    description: 'Complete practical daily household tasks to cultivate real conservation habits and earn streak badges.',
    component: Game9Missions,
  },
  {
    id: 'game-10',
    title: 'Virtual Aquarium Sanctuary',
    icon: '🐠',
    category: 'Ecosystem Care',
    description: 'Maintain pristine water clarity to unlock and nurture endangered Philippine marine species.',
    component: Game10Aquarium,
  },
];

export const GamesHub: React.FC<GamesHubProps> = ({ scores, onSaveScore }) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const activeGame = ALL_GAMES.find((g) => g.id === activeGameId);

  const handleScore = async (score: number, stars: number) => {
    if (activeGameId) {
      await onSaveScore(activeGameId, score, stars);
    }
  };

  if (activeGame) {
    const Component = activeGame.component;
    return (
      <div className="space-y-4">
        <button
          onClick={() => setActiveGameId(null)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All 10 Games
        </button>
        <Component onSaveScore={handleScore} onBack={() => setActiveGameId(null)} />
      </div>
    );
  }

  const totalPlayed = scores.reduce((sum, s) => sum + s.playedCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Gamepad2 className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              10 Educational Games
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Genuinely interactive, playable games designed to reinforce water efficiency and environmental responsibility
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/20 text-xs font-bold text-cyan-700 dark:text-cyan-300">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{totalPlayed} Game Sessions Played</span>
        </div>
      </div>

      {/* Grid of 10 Games */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_GAMES.map((game, index) => {
          const userScore = scores.find((s) => s.gameId === game.id);
          const stars = userScore ? userScore.stars : 0;

          return (
            <div
              key={game.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm hover:border-cyan-500/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c]">
                    {game.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                    Game {index + 1}
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                  {game.title}
                </h4>
                <span className="text-[11px] font-medium text-slate-400 block mb-2">
                  {game.category}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {game.description}
                </p>
              </div>

              <div>
                {/* Score & Stars */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mb-3 text-xs">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-slate-400 font-data">
                    {userScore ? `High: ${userScore.highScore} pts` : 'Not played yet'}
                  </span>
                </div>

                <button
                  onClick={() => setActiveGameId(game.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Game</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
