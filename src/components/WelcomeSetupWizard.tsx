import React, { useState } from 'react';
import { AquaLogo } from './AquaLogo';
import { WaterUnit, Goal } from '../types';
import {
  convertToLiters,
  convertFromLiters,
  getUnitLabel,
  getUnitFullName,
  getUnitDescription,
  formatWaterVolume,
} from '../lib/waterCalculations';
import {
  Droplets,
  Target,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Calendar,
} from 'lucide-react';

interface WelcomeSetupWizardProps {
  initialNickname: string;
  initialUnit?: WaterUnit;
  onComplete: (data: {
    preferredUnit: WaterUnit;
    nickname: string;
    goal: {
      title: string;
      targetQuantity: number;
      period: 'daily' | 'weekly' | 'monthly' | 'custom';
      category?: string;
      startDate?: string;
      endDate?: string;
    };
  }) => Promise<void>;
}

export const WelcomeSetupWizard: React.FC<WelcomeSetupWizardProps> = ({
  initialNickname,
  initialUnit = 'liters',
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nickname, setNickname] = useState(initialNickname || 'Friend');
  const [selectedUnit, setSelectedUnit] = useState<WaterUnit>(initialUnit);

  // Goal state
  const [goalPeriod, setGoalPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [goalTitle, setGoalTitle] = useState('');
  const [targetQuantity, setTargetQuantity] = useState<number>(() => {
    // Sensible initial suggestion for daily
    return selectedUnit === 'gallons' ? 30 : selectedUnit === 'imperial_gallons' ? 25 : selectedUnit === 'milliliters' ? 100000 : 120;
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Status state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adjust default target recommendation when unit changes
  const handleUnitChange = (newUnit: WaterUnit) => {
    setSelectedUnit(newUnit);
    // Convert current target amount to new unit or set suggested baseline
    const inLiters = convertToLiters(targetQuantity, selectedUnit);
    const inNewUnit = convertFromLiters(inLiters, newUnit);
    setTargetQuantity(Math.max(1, Math.round(inNewUnit * 10) / 10));
  };

  // Helper suggested baselines based on unit & period
  const getSuggestion = () => {
    const dailyBase =
      selectedUnit === 'gallons' ? 32 :
      selectedUnit === 'imperial_gallons' ? 26 :
      selectedUnit === 'milliliters' ? 120000 :
      selectedUnit === 'cubic_meters' ? 0.12 : 120;

    if (goalPeriod === 'weekly') return Math.round(dailyBase * 7 * 10) / 10;
    if (goalPeriod === 'monthly') return Math.round(dailyBase * 30 * 10) / 10;
    return dailyBase;
  };

  const applySuggestion = () => {
    setTargetQuantity(getSuggestion());
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!nickname.trim()) {
      setError('Please provide a nickname so AquaTrack can personalize your experience.');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!targetQuantity || targetQuantity <= 0) {
      setError('Please specify a positive water-saving target greater than zero.');
      return;
    }
    if (goalPeriod === 'custom' && startDate && endDate && startDate > endDate) {
      setError('Start date cannot be after the end date.');
      return;
    }
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setError(null);
    setSaving(true);

    const defaultTitle =
      goalTitle.trim() ||
      `${goalPeriod.charAt(0).toUpperCase() + goalPeriod.slice(1)} Water Conservation Target`;

    try {
      await onComplete({
        preferredUnit: selectedUnit,
        nickname: nickname.trim(),
        goal: {
          title: defaultTitle,
          targetQuantity: Number(targetQuantity),
          period: goalPeriod,
          category: 'all',
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to complete setup. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const unitsList: Array<{ id: WaterUnit; name: string; symbol: string }> = [
    { id: 'liters', name: 'Liters', symbol: 'L' },
    { id: 'milliliters', name: 'Milliliters', symbol: 'mL' },
    { id: 'gallons', name: 'US Gallons', symbol: 'US gal' },
    { id: 'imperial_gallons', name: 'Imperial Gallons', symbol: 'Imp gal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#0d1e33] border border-slate-200 dark:border-cyan-900/50 rounded-3xl p-6 sm:p-10 max-w-2xl w-full shadow-2xl relative my-8">
        {/* Step indicator header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <AquaLogo size="sm" withWordmark={true} />
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
              Welcome Setup Wizard
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/30'
                      : step > s
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 3 && <div className={`w-4 h-0.5 ${step > s ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Error notification banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Setup Requirement</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* STEP 1: CHOOSE WATER MEASUREMENT UNITS */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Step 1 of 3 — Measurement Preferences
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Choose Your Preferred Water Unit
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Before tracking your water consumption, select your primary measurement unit. All dashboard figures, consumption records, and analytics will be formatted according to this preference.
              </p>
            </div>

            {/* Personal Nickname */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Your Preferred Nickname
              </label>
              <input
                type="text"
                required
                maxLength={30}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Marian"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#081524] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-[11px] text-slate-400">
                Used in your personalized multilingual greetings and AI dialogues.
              </p>
            </div>

            {/* Unit options grid */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Select Measurement Unit
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unitsList.map((u) => {
                  const isSelected = selectedUnit === u.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleUnitChange(u.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/40 shadow-sm shadow-cyan-500/10 ring-2 ring-cyan-500/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a1727] hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {u.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                            isSelected
                              ? 'bg-cyan-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {u.symbol}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        {getUnitDescription(u.id)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#081524] border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <HelpCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <span>
                You can change your preferred unit anytime later in <strong>Settings</strong>. Measurements are converted reliably without altering the underlying recorded quantity.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Continue to Goal Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: SELECT A WATER-SAVING GOAL */}
        {step === 2 && (
          <form onSubmit={handleStep2Next} className="space-y-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Step 2 of 3 — Water Conservation Goal
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Set Your Initial Conservation Goal
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Choose a realistic target to track your progress. AquaTrack evaluates your daily logs against this goal to highlight savings.
              </p>
            </div>

            {/* Goal Period Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Target Period
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'daily', label: 'Daily Target' },
                  { id: 'weekly', label: 'Weekly Target' },
                  { id: 'monthly', label: 'Monthly Target' },
                  { id: 'custom', label: 'Custom Target' },
                ].map((p) => {
                  const isSelected = goalPeriod === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setGoalPeriod(p.id as any);
                        // update target based on period
                        if (p.id === 'weekly') setTargetQuantity((prev) => Math.round(prev * 7));
                        else if (p.id === 'monthly') setTargetQuantity((prev) => Math.round(prev * 30));
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Quantity Input with Unit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Target Water Ceiling ({getUnitLabel(selectedUnit)})
                </label>
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Use suggestion: {getSuggestion()} {getUnitLabel(selectedUnit)}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={500000}
                  step={selectedUnit === 'cubic_meters' ? 0.01 : 1}
                  required
                  value={targetQuantity}
                  onChange={(e) => setTargetQuantity(Number(e.target.value))}
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#081524] text-slate-900 dark:text-white font-bold text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm shrink-0 border border-slate-200 dark:border-slate-700">
                  {getUnitLabel(selectedUnit)} / {goalPeriod}
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                Suggested target basis: Typical domestic sustainable target for household usage is ~100–120 L/day (~30 US gal/day). Adjust to your household size and needs.
              </p>
            </div>

            {/* Optional Custom Goal Dates */}
            {goalPeriod === 'custom' && (
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#081524] border border-slate-200/80 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Start Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0a1727] text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0a1727] text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Review & Confirm Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: REVIEW & CONFIRM SETUP */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Step 3 of 3 — Confirmation
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Review Your Preferences
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Please verify your unit selection and initial conservation goal before entering the dashboard.
              </p>
            </div>

            {/* Review Cards */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#081524] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Profile Nickname
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {nickname}
                  </span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#081524] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Measurement Unit
                  </span>
                  <span className="text-base font-bold text-cyan-600 dark:text-cyan-400">
                    {getUnitFullName(selectedUnit)}
                  </span>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 block mb-0.5">
                    Initial Conservation Goal ({goalPeriod})
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-data text-slate-900 dark:text-white">
                      {targetQuantity} {getUnitLabel(selectedUnit)}
                    </span>
                    {selectedUnit !== 'liters' && (
                      <span className="text-xs text-slate-400">
                        (≈ {Math.round(convertToLiters(targetQuantity, selectedUnit))} Liters)
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Confirmation Note */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <span className="font-bold block mb-0.5">Zero Fabricated Data Guarantee</span>
                Your dashboard will initialize with 0 consumption. You can add genuine water records anytime with "+ Record Water Usage".
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={handleFinalSubmit}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Preferences & Goal...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Setup & Open Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
