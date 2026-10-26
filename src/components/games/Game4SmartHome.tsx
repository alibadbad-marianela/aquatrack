import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Home, Check, Plus, Trophy, RotateCcw, Sparkles, Droplets, ShieldCheck } from 'lucide-react';

interface Game4SmartHomeProps {
  onSaveScore: (score: number, stars: number) => void;
  onBack: () => void;
}

interface Upgrade {
  id: string;
  name: string;
  room: string;
  cost: number;
  efficiencyBoost: number;
  annualSavingsLiters: number;
  description: string;
}

const UPGRADES: Upgrade[] = [
  {
    id: 'faucet-aerator',
    name: 'Micro-Bubble Faucet Aerators',
    room: 'Bathroom & Kitchen Sinks',
    cost: 15,
    efficiencyBoost: 20,
    annualSavingsLiters: 12000,
    description: 'Blends atmospheric air into water stream, cutting flow from 12L/min to 5L/min with equal pressure.',
  },
  {
    id: 'dual-toilet',
    name: 'Dual-Flush Toilet Mechanism',
    room: 'Main Bathroom',
    cost: 35,
    efficiencyBoost: 25,
    annualSavingsLiters: 25000,
    description: 'Offers 3L liquid flush vs 6L solid flush, eliminating standard 12L single-flush tanks.',
  },
  {
    id: 'rain-barrel',
    name: '200L Rainwater Harvesting Barrel',
    room: 'Outdoor Roof Gutters',
    cost: 40,
    efficiencyBoost: 20,
    annualSavingsLiters: 18000,
    description: 'Captures tropical monsoon runoff with mosquito mesh screen for plant watering and general cleaning.',
  },
  {
    id: 'drip-irrigation',
    name: 'Drip Irrigation Garden Tubing',
    room: 'Outdoor Plant Beds',
    cost: 25,
    efficiencyBoost: 15,
    annualSavingsLiters: 14000,
    description: 'Applies water directly to soil root zones at low pressure, cutting evaporation and wind overspray by 90%.',
  },
  {
    id: 'greywater-diverter',
    name: 'Laundry Greywater Gravity Diverter',
    room: 'Laundry & Garden',
    cost: 35,
    efficiencyBoost: 20,
    annualSavingsLiters: 20000,
    description: 'Directs non-potable laundry rinse water directly to outdoor ornamental shrubs and fruit trees.',
  },
];

export const Game4SmartHome: React.FC<Game4SmartHomeProps> = ({ onSaveScore, onBack }) => {
  const [installedUpgrades, setInstalledUpgrades] = useState<string[]>([]);
  const [budget, setBudget] = useState(150); // initial credits
  const [completed, setCompleted] = useState(false);

  const totalEfficiency = installedUpgrades.reduce((acc, id) => {
    const up = UPGRADES.find((u) => u.id === id);
    return acc + (up ? up.efficiencyBoost : 0);
  }, 0);

  const totalAnnualSavings = installedUpgrades.reduce((acc, id) => {
    const up = UPGRADES.find((u) => u.id === id);
    return acc + (up ? up.annualSavingsLiters : 0);
  }, 0);

  const handleInstall = (upgrade: Upgrade) => {
    if (installedUpgrades.includes(upgrade.id)) return;
    if (budget < upgrade.cost) return;

    const nextInstalled = [...installedUpgrades, upgrade.id];
    setInstalledUpgrades(nextInstalled);
    setBudget((b) => b - upgrade.cost);

    if (nextInstalled.length === UPGRADES.length) {
      setCompleted(true);
      onSaveScore(100, 3);
      confetti();
    }
  };

  const handleRestart = () => {
    setInstalledUpgrades([]);
    setBudget(150);
    setCompleted(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-cyan-500" />
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Build a Water-Smart Home
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Install eco-fixtures across your household to reach 100% water conservation efficiency
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Budget</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-data">
              {budget} Eco-Credits
            </span>
          </div>
        </div>
      </div>

      {/* Efficiency Meter */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-1 text-xs">
          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            Home Efficiency Rating
          </span>
          <span className="font-bold text-cyan-600 dark:text-cyan-400 font-data text-sm">
            {totalEfficiency}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-300 transition-all duration-500"
            style={{ width: `${Math.min(100, totalEfficiency)}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
          <span>Estimated Annual Conservation:</span>
          <span className="font-semibold text-cyan-600 dark:text-cyan-400">
            {totalAnnualSavings.toLocaleString()} Liters / Year
          </span>
        </div>
      </div>

      {/* Upgrades Catalog */}
      <div className="space-y-3">
        {UPGRADES.map((upgrade) => {
          const isInstalled = installedUpgrades.includes(upgrade.id);
          const canAfford = budget >= upgrade.cost;

          return (
            <div
              key={upgrade.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isInstalled
                  ? 'border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#10243A]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{upgrade.name}</h4>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {upgrade.room}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                  {upgrade.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px]">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                    +{upgrade.efficiencyBoost}% Efficiency
                  </span>
                  <span className="text-slate-400">
                    Saves ~{upgrade.annualSavingsLiters.toLocaleString()} L/yr
                  </span>
                </div>
              </div>

              <div>
                {isInstalled ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    <Check className="w-3.5 h-3.5" />
                    Installed
                  </span>
                ) : (
                  <button
                    onClick={() => handleInstall(upgrade)}
                    disabled={!canAfford}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs disabled:opacity-40 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Install ({upgrade.cost} credits)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completed && (
        <div className="p-6 text-center rounded-3xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-500/30 animate-fade-in space-y-3">
          <Trophy className="w-10 h-10 text-cyan-500 mx-auto" />
          <h4 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            100% Water-Smart Home Achieved!
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            You transformed standard domestic plumbing into an ultra-efficient green architecture saving over {totalAnnualSavings.toLocaleString()} Liters of water every single year!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
            >
              Reset Floor Plan
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold"
            >
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
