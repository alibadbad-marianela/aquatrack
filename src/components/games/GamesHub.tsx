import React, { useState, useEffect } from 'react';
import { GameScore } from '../../types';
import { api } from '../../lib/api';
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
import {
  Gamepad2,
  Play,
  Star,
  Trophy,
  Sparkles,
  ArrowLeft,
  Medal,
  Award,
  Users,
  ShieldAlert,
  Calendar,
  RotateCw
} from 'lucide-react';

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

export const ALL_GAMES: GameMeta[] = [
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

interface LeaderboardItem {
  rank: number;
  userId: string;
  displayName: string;
  nickname: string;
  avatarUrl?: string;
  gameId: string;
  highScore: number;
  stars: number;
  achievementsCount: number;
  lastPlayedAt: string;
}

export const GamesHub: React.FC<GamesHubProps> = ({ scores, onSaveScore }) => {
  const [activeTab, setActiveTab] = useState<'games' | 'leaderboard'>('games');
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [selectedLeaderboardGame, setSelectedLeaderboardGame] = useState<string>('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  const activeGame = ALL_GAMES.find((g) => g.id === activeGameId);

  const fetchLeaderboard = async (gameId?: string) => {
    setIsLoadingLeaderboard(true);
    try {
      const res = await api.getGameLeaderboard(gameId === 'all' ? undefined : gameId);
      setLeaderboard(res.leaderboard || []);
    } catch {
      setLeaderboard([]);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      fetchLeaderboard(selectedLeaderboardGame);
    }
  }, [activeTab, selectedLeaderboardGame]);

  const handleScore = async (score: number, stars: number) => {
    if (activeGameId) {
      await onSaveScore(activeGameId, score, stars);
      // Refresh leaderboard data if user saves a score
      fetchLeaderboard(selectedLeaderboardGame);
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
          Back to Games Hub
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
              Water Education Games & Leaderboards
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Genuinely playable games with authentic gameplay rankings. Real scores earned by verified users.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#102338] border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('games')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'games'
                ? 'bg-white dark:bg-[#0c1a2c] text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>All 10 Games</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-white dark:bg-[#0c1a2c] text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Rankings & Leaderboard</span>
          </button>
        </div>
      </div>

      {/* GAMES TAB */}
      {activeTab === 'games' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Play any game to learn and compete on the verified leaderboard</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{totalPlayed} Total Sessions Played</span>
            </div>
          </div>

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
      )}

      {/* LEADERBOARD TAB */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Filter by Game:
              </span>
              <select
                value={selectedLeaderboardGame}
                onChange={(e) => setSelectedLeaderboardGame(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                <option value="all">🏆 All 10 Games Combined</option>
                {ALL_GAMES.map((g, idx) => (
                  <option key={g.id} value={g.id}>
                    Game {idx + 1}: {g.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => fetchLeaderboard(selectedLeaderboardGame)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isLoadingLeaderboard ? 'animate-spin' : ''}`} />
              <span>Refresh Rankings</span>
            </button>
          </div>

          {/* Leaderboard Table / Clean Empty State */}
          {isLoadingLeaderboard ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Loading verified leaderboard standings...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-16 px-4 text-center rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Gameplay Records Yet
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5 leading-relaxed">
                Rankings are based strictly on real user gameplay results—never fabricated bot accounts. Play a game now to record your high score and claim #1 on the leaderboard!
              </p>
              <button
                onClick={() => {
                  setActiveTab('games');
                  if (selectedLeaderboardGame !== 'all') {
                    setActiveGameId(selectedLeaderboardGame);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Now to Enter Leaderboard</span>
              </button>
            </div>
          ) : (
            <div className="rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-[#0c1a2c] text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Player</th>
                      <th className="py-3 px-4">Game</th>
                      <th className="py-3 px-4">High Score</th>
                      <th className="py-3 px-4">Stars</th>
                      <th className="py-3 px-4">Achievements</th>
                      <th className="py-3 px-4">Last Played</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {leaderboard.map((entry) => {
                      const gameObj = ALL_GAMES.find((g) => g.id === entry.gameId);
                      const isTop3 = entry.rank <= 3;
                      const rankBadge =
                        entry.rank === 1
                          ? '🥇 1st'
                          : entry.rank === 2
                          ? '🥈 2nd'
                          : entry.rank === 3
                          ? '🥉 3rd'
                          : `#${entry.rank}`;

                      return (
                        <tr
                          key={`${entry.userId}_${entry.gameId}_${entry.rank}`}
                          className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                            isTop3 ? 'font-semibold' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold ${
                                entry.rank === 1
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                  : entry.rank === 2
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  : entry.rank === 3
                                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400'
                                  : 'text-slate-500'
                              }`}
                            >
                              {rankBadge}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 text-white font-bold text-[10px] flex items-center justify-center overflow-hidden">
                                {entry.avatarUrl && (entry.avatarUrl.startsWith('http') || entry.avatarUrl.startsWith('data:')) ? (
                                  <img src={entry.avatarUrl} alt={entry.nickname} className="w-full h-full object-cover" />
                                ) : entry.avatarUrl ? (
                                  <span>{entry.avatarUrl}</span>
                                ) : (
                                  entry.nickname ? entry.nickname[0].toUpperCase() : 'U'
                                )}
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white">
                                {entry.nickname || entry.displayName || 'Water Conservator'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                            {gameObj ? gameObj.title : entry.gameId}
                          </td>
                          <td className="py-3.5 px-4 font-data font-bold text-cyan-600 dark:text-cyan-400">
                            {entry.highScore} pts
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3 h-3 ${
                                    s <= entry.stars
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-200 dark:text-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            <span className="inline-flex items-center gap-1 font-semibold text-xs text-amber-600 dark:text-amber-400">
                              <Award className="w-3.5 h-3.5" />
                              {entry.achievementsCount} Unlocked
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {entry.lastPlayedAt
                              ? new Date(entry.lastPlayedAt).toLocaleDateString()
                              : 'Recently'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
