import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Fish, Sparkles, Heart, ShieldAlert, RotateCcw, Info, Droplets } from 'lucide-react';

interface Game10AquariumProps {
  onSaveScore: (score: number, stars: number) => void;
  onBack: () => void;
}

interface FishSpecies {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  cost: number;
  diet: string;
  habitat: string;
  conservationStatus: string;
  funFact: string;
}

const SPECIES_CATALOG: FishSpecies[] = [
  {
    id: 'clownfish',
    name: 'Anemone Clownfish',
    icon: '🐠',
    unlocked: true,
    cost: 0,
    diet: 'Plankton & Algae',
    habitat: 'Shallow coral reefs & sea anemones',
    conservationStatus: 'Least Concern',
    funFact: 'Immune to stinging sea anemone tentacles through a protective mucus coating.',
  },
  {
    id: 'blue-tang',
    name: 'Blue Tang (Surgeonfish)',
    icon: '🐟',
    unlocked: true,
    cost: 15,
    diet: 'Macroalgae grazer',
    habitat: 'Coral crests & reef terraces',
    conservationStatus: 'Least Concern',
    funFact: 'Crucial for reef health: grazing prevents runaway algae from suffocating live coral polyps.',
  },
  {
    id: 'seahorse',
    name: 'Spotted Seahorse',
    icon: '🌊',
    unlocked: false,
    cost: 30,
    diet: 'Tiny brine shrimp',
    habitat: 'Seagrass beds & mangrove roots',
    conservationStatus: 'Vulnerable',
    funFact: 'Male seahorses carry and birth the fertilized eggs in an abdominal brood pouch.',
  },
  {
    id: 'sea-turtle',
    name: 'Green Sea Turtle (Pawikan)',
    icon: '🐢',
    unlocked: false,
    cost: 50,
    diet: 'Seagrasses & Seaweeds',
    habitat: 'Coastal waters & sandy nesting beaches',
    conservationStatus: 'Endangered',
    funFact: 'Can hold their breath underwater for up to 5 hours while resting.',
  },
  {
    id: 'manta-ray',
    name: 'Reef Manta Ray',
    icon: '🐡',
    unlocked: false,
    cost: 75,
    diet: 'Zooplankton filter feeder',
    habitat: 'Reef cleaning stations & open coastal bays',
    conservationStatus: 'Vulnerable',
    funFact: 'Possesses the largest brain-to-body ratio of any fish in the world.',
  },
  {
    id: 'whale-shark',
    name: 'Whale Shark (Butanding)',
    icon: '🦈',
    unlocked: false,
    cost: 100,
    diet: 'Plankton & small krill',
    habitat: 'Deep tropical channels & bays (Donsol)',
    conservationStatus: 'Endangered',
    funFact: 'The largest living non-mammalian vertebrate, reaching lengths of over 12 meters.',
  },
];

export const Game10Aquarium: React.FC<Game10AquariumProps> = ({ onSaveScore, onBack }) => {
  const [species, setSpecies] = useState<FishSpecies[]>(SPECIES_CATALOG);
  const [waterClarity, setWaterClarity] = useState(85);
  const [ecoPoints, setEcoPoints] = useState(60);
  const [activeSpeciesInfo, setActiveSpeciesInfo] = useState<FishSpecies | null>(null);
  const [bubbles, setBubbles] = useState<number[]>([1, 2, 3, 4, 5]);

  const cleanTank = () => {
    setWaterClarity((prev) => Math.min(100, prev + 15));
    setEcoPoints((prev) => prev + 10);
  };

  const feedFish = () => {
    setEcoPoints((prev) => prev + 5);
    setWaterClarity((prev) => Math.max(30, prev - 5)); // feeding slightly clouds water
  };

  const unlockSpecies = (item: FishSpecies) => {
    if (ecoPoints < item.cost) return;

    setEcoPoints((prev) => prev - item.cost);
    const updated = species.map((s) => (s.id === item.id ? { ...s, unlocked: true } : s));
    setSpecies(updated);

    const unlockedCount = updated.filter((s) => s.unlocked).length;
    const score = Math.round((unlockedCount / species.length) * 100);
    const stars = unlockedCount === species.length ? 3 : unlockedCount >= 4 ? 2 : 1;
    onSaveScore(score, stars);

    if (unlockedCount === species.length) {
      confetti();
    }
  };

  const activeSwimmingCreatures = species.filter((s) => s.unlocked);

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Fish className="w-5 h-5 text-cyan-500" />
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Virtual Aquarium Sanctuary
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Nurture clean water conditions to unlock protected Philippine marine species
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Eco-Points</span>
            <span className="text-sm font-bold text-cyan-600 dark:text-cyan-400 font-data">
              {ecoPoints} Points
            </span>
          </div>
        </div>
      </div>

      {/* Aquarium Visual Canvas */}
      <div
        className="h-72 rounded-3xl relative overflow-hidden flex flex-col justify-between p-4 shadow-inner border border-cyan-500/30 transition-colors duration-700"
        style={{
          background: `linear-gradient(180deg, rgba(34, 211, 238, ${waterClarity / 300}) 0%, rgba(22, 119, 232, ${waterClarity / 150}) 100%)`,
        }}
      >
        {/* Animated aquatic bubbles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {bubbles.map((b) => (
            <div
              key={b}
              className="absolute w-2.5 h-2.5 rounded-full bg-white/40 animate-water-float"
              style={{
                left: `${b * 18}%`,
                bottom: '10px',
                animationDelay: `${b * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* Top Status */}
        <div className="relative z-10 flex justify-between items-center bg-black/20 backdrop-blur-md px-3.5 py-1.5 rounded-2xl text-white text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-cyan-300" />
            Water Clarity: {waterClarity}%
          </span>
          <span>{activeSwimmingCreatures.length} Species Swimming</span>
        </div>

        {/* Interactive Swimming Fish */}
        <div className="relative z-10 flex-1 flex flex-wrap items-center justify-around gap-6 p-4">
          {activeSwimmingCreatures.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveSpeciesInfo(item)}
              className="flex flex-col items-center group cursor-pointer hover:scale-125 transition-transform duration-300 animate-water-float"
              style={{ animationDelay: `${idx * 0.5}s` }}
              title={`Click to view info on ${item.name}`}
            >
              <span className="text-4xl filter drop-shadow-md">{item.icon}</span>
              <span className="text-[10px] font-bold text-white bg-black/30 px-2 py-0.5 rounded-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.name}
              </span>
            </button>
          ))}
        </div>

        {/* Sandy Bottom & Coral Decor */}
        <div className="relative z-10 flex justify-between items-end border-t border-white/20 pt-2 text-lg">
          <span>🪸</span>
          <span className="text-xs text-white/80 font-medium">✨ Healthy Living Coral Bed ✨</span>
          <span>🪸</span>
        </div>
      </div>

      {/* Tank Controls */}
      <div className="flex gap-3">
        <button
          onClick={cleanTank}
          className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          Filter & Clean Algae (+15% Clarity)
        </button>
        <button
          onClick={feedFish}
          className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <Heart className="w-4 h-4" />
          Feed Plankton (+5 Eco-Points)
        </button>
      </div>

      {/* Species Fact Sheet Panel */}
      {activeSpeciesInfo && (
        <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-[#0c1a2c] border border-cyan-500/30 text-xs leading-relaxed animate-fade-in">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-xl">{activeSpeciesInfo.icon}</span>
              {activeSpeciesInfo.name}
            </h4>
            <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-semibold text-[10px]">
              Status: {activeSpeciesInfo.conservationStatus}
            </span>
          </div>
          <p className="mb-1 text-slate-700 dark:text-slate-300">
            <strong>Habitat:</strong> {activeSpeciesInfo.habitat} • <strong>Diet:</strong> {activeSpeciesInfo.diet}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            <strong>Biological Role:</strong> {activeSpeciesInfo.funFact}
          </p>
        </div>
      )}

      {/* Unlockable Species Catalog */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Sanctuary Wildlife Catalog
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {species.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border transition-all text-center flex flex-col justify-between ${
                item.unlocked
                  ? 'border-cyan-500/40 bg-cyan-50/30 dark:bg-cyan-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0c1a2c]'
              }`}
            >
              <div>
                <span className="text-2xl block mb-1">{item.icon}</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {item.name}
                </span>
              </div>

              <div className="mt-2">
                {item.unlocked ? (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Active in Reef
                  </span>
                ) : (
                  <button
                    onClick={() => unlockSpecies(item)}
                    disabled={ecoPoints < item.cost}
                    className="w-full py-1 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-semibold text-[10px] transition-colors"
                  >
                    Unlock ({item.cost} pts)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational disclaimer */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center gap-2">
        <Info className="w-4 h-4 shrink-0 text-slate-400" />
        <span>Aquarium progress represents an interactive virtual simulation for marine education.</span>
      </div>

      <div>
        <button
          onClick={onBack}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Back to Games
        </button>
      </div>
    </div>
  );
};
