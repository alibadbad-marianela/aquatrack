import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Eye, RotateCcw, Trophy, Clock, CheckCircle2 } from 'lucide-react';

interface Game6MemoryMatchProps {
  onSaveScore: (score: number, stars: number) => void;
  onBack: () => void;
}

interface CardItem {
  id: number;
  symbol: string;
  name: string;
  fact: string;
}

const SYMBOLS = [
  { symbol: '🐬', name: 'Dugong', fact: 'Philippine sea cow grazing on shallow seagrass beds in Palawan.' },
  { symbol: '🦈', name: 'Whale Shark', fact: 'The gentle Butanding filter-feeder of Donsol and Southern Leyte.' },
  { symbol: '🐟', name: 'Taal Tawilis', fact: 'The world’s only freshwater sardine, endemic to Taal Lake.' },
  { symbol: '🪸', name: 'Coral Reef', fact: 'Breaks 97% of typhoon wave energy and protects coastlines.' },
  { symbol: '🌱', name: 'Mangrove Forest', fact: 'Filters river sediment before it smothers marine coral beds.' },
  { symbol: '🐢', name: 'Sea Turtle (Pawikan)', fact: 'Nesting on clean Philippine sandy beaches and eating jellyfish.' },
  { symbol: '💧', name: 'Pure Aquifer Drop', fact: 'Clean groundwater takes decades to filter naturally through soil.' },
  { symbol: '🦦', name: 'River Otter', fact: 'Thrives only in clean, unpolluted freshwater streams.' },
];

function generateCards(): CardItem[] {
  const deck: CardItem[] = [];
  let id = 1;
  for (const s of SYMBOLS) {
    deck.push({ id: id++, ...s });
    deck.push({ id: id++, ...s });
  }
  return deck.sort(() => Math.random() - 0.5);
}

export const Game6MemoryMatch: React.FC<Game6MemoryMatchProps> = ({ onSaveScore, onBack }) => {
  const [cards, setCards] = useState<CardItem[]>(generateCards);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedSymbols, setMatchedSymbols] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [lastMatchedFact, setLastMatchedFact] = useState<string | null>(null);

  // Timer
  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [completed]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(index)) return;
    if (matchedSymbols.includes(cards[index].symbol)) return;

    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const card1 = cards[nextFlipped[0]];
      const card2 = cards[nextFlipped[1]];

      if (card1.symbol === card2.symbol) {
        const nextMatched = [...matchedSymbols, card1.symbol];
        setMatchedSymbols(nextMatched);
        setLastMatchedFact(`${card1.name}: ${card1.fact}`);
        setFlippedIndices([]);

        if (nextMatched.length === SYMBOLS.length) {
          setCompleted(true);
          const stars = moves <= 14 ? 3 : moves <= 20 ? 2 : 1;
          const score = Math.max(30, 100 - moves * 2 - Math.floor(seconds / 5));
          onSaveScore(score, stars);
          confetti();
        }
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const handleRestart = () => {
    setCards(generateCards());
    setFlippedIndices([]);
    setMatchedSymbols([]);
    setMoves(0);
    setSeconds(0);
    setCompleted(false);
    setLastMatchedFact(null);
  };

  return (
    <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-xl space-y-6">
      {!completed ? (
        <>
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Aquatic Memory Match
              </h3>
              <p className="text-xs text-slate-500">
                Match all 8 pairs of Philippine marine and watershed species
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-500" />
                {seconds}s
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400">
                {moves} Moves
              </span>
            </div>
          </div>

          {/* Cards Grid: 4x4 */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 select-none">
            {cards.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx) || matchedSymbols.includes(card.symbol);
              const isMatched = matchedSymbols.includes(card.symbol);

              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className={`h-20 sm:h-24 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center relative ${
                    isFlipped
                      ? isMatched
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500 text-cyan-600 scale-[0.98]'
                        : 'bg-white dark:bg-[#0c1a2c] border-blue-500 text-blue-600 shadow-md'
                      : 'bg-gradient-to-br from-blue-600 to-cyan-500 border-transparent text-white hover:scale-105 shadow-sm'
                  }`}
                  aria-label={isFlipped ? card.name : 'Hidden card'}
                >
                  {isFlipped ? (
                    <>
                      <span className="text-2xl sm:text-3xl">{card.symbol}</span>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-1 truncate max-w-[90%]">
                        {card.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg opacity-80">💧</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Educational Fact popup after each match */}
          {lastMatchedFact && (
            <div className="p-3.5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-900 dark:text-cyan-300 flex items-start gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <span>{lastMatchedFact}</span>
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
              All Aquatic Pairs Matched!
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Completed in <span className="font-bold text-cyan-600">{moves} moves</span> and {seconds} seconds.
            </p>
          </div>

          <div className="flex justify-center gap-1.5 text-2xl">
            {moves <= 14 ? '⭐⭐⭐' : moves <= 20 ? '⭐⭐' : '⭐'}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
            You discovered iconic species of Philippine coral reefs and freshwater rivers, from the Dugong to the Taal Tawilis!
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
