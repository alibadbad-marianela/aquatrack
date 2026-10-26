import React, { useState } from 'react';
import { AquaLogo } from './AquaLogo';
import { Droplets, Sparkles, Target, BookOpen, Bot, CheckCircle2, ArrowRight } from 'lucide-react';
import { WaterUnit } from '../types';

interface OnboardingModalProps {
  initialNickname: string;
  onComplete: (preferences: { nickname: string; preferredUnit: WaterUnit; dailyGoalLiters: number }) => void;
  onDismiss: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialNickname,
  onComplete,
  onDismiss,
}) => {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState(initialNickname || 'Friend');
  const [unit, setUnit] = useState<WaterUnit>('liters');
  const [dailyGoal, setDailyGoal] = useState<number>(100);

  const handleFinish = () => {
    onComplete({
      nickname: nickname.trim() || 'Friend',
      preferredUnit: unit,
      dailyGoalLiters: Number(dailyGoal) || 100,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Progress header dots */}
        <div className="flex items-center justify-between mb-6">
          <AquaLogo size="sm" withWordmark={false} />
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-8 bg-cyan-500' : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          <button
            onClick={onDismiss}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Skip
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Welcome to AquaTrack!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                “Track Every Drop. Protect Every Tomorrow.” Let’s personalize your conservation journey.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                What should we call you?
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                maxLength={30}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-xs text-slate-400">
                Used in your personalized multilingual greeting in 14 languages!
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all mt-6"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Units & Daily Conservation Goal
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Select your preferred water volume unit and target daily consumption.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Preferred Measurement Unit
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'liters', label: 'Liters (L)' },
                  { id: 'gallons', label: 'Gallons (gal)' },
                  { id: 'milliliters', label: 'Milliliters (mL)' },
                  { id: 'cubic_meters', label: 'Cubic Meters (m³)' },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUnit(u.id as WaterUnit)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                      unit === u.id
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Target Daily Limit (Liters)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={20}
                    max={1000}
                    step={10}
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <span className="text-sm font-semibold text-slate-500">Liters/day</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tip: 100 Liters/day is an achievable sustainable target for personal domestic water use.
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                How AquaTrack Works
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Six interconnected tools to empower your conservation habits:
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#0c1a2c]">
                <Droplets className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span><strong>Record Usage:</strong> Log daily activities with measured or estimated quantities.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#0c1a2c]">
                <Target className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Review Trends & Goals:</strong> Interactive charts and streaks track your savings.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#0c1a2c]">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Play 10 Educational Games:</strong> Test your skills from Leak Detective to Virtual Aquarium.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#0c1a2c]">
                <BookOpen className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <span><strong>Philippine Laws & Learning:</strong> Explore the Clean Water Act (RA 9275) and water cycle science.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#0c1a2c]">
                <Bot className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <span><strong>AI Assistant:</strong> Ask questions about your personal water records and conservation tips.</span>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all mt-4"
            >
              <CheckCircle2 className="w-5 h-5" />
              Let's Start Tracking!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
