import React from 'react';
import { Flame, Droplets, Calendar, Award, CheckCircle2, ChevronRight, X, Sparkles, TrendingUp, Clock } from 'lucide-react';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  bestStreak: number;
  totalDaysLogged: number;
  recentDatesLogged: string[];
  onOpenRecordModal: () => void;
}

export const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  onClose,
  currentStreak,
  bestStreak,
  totalDaysLogged,
  recentDatesLogged,
  onOpenRecordModal,
}) => {
  if (!isOpen) return null;

  // Build last 28 days calendar grid (4 weeks of 7 days)
  const daysGrid: Array<{ dateStr: string; label: string; isLogged: boolean; isToday: boolean }> = [];
  const today = new Date();
  const loggedSet = new Set(recentDatesLogged);

  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const isLogged = loggedSet.has(dateStr);
    const isToday = i === 0;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'narrow' });
    const dayNum = d.getDate();

    daysGrid.push({
      dateStr,
      label: `${dayName} ${dayNum}`,
      isLogged,
      isToday,
    });
  }

  const milestones = [
    { days: 3, title: '3-Day Water Conscious', desc: 'Log water usage 3 days consecutively', icon: '💧' },
    { days: 7, title: '7-Day Stream Keeper', desc: 'A full week of uninterrupted water mindfulness', icon: '🌊' },
    { days: 14, title: '14-Day River Guardian', desc: 'Two weeks of consistent conservation discipline', icon: '🏞️' },
    { days: 30, title: '30-Day Ocean Master', desc: 'One whole month of sustainable household habits', icon: '🐋' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-title"
    >
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c1a2c] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Aqua Gradient Banner */}
        <div className="relative p-6 bg-gradient-to-br from-amber-500 via-orange-500 to-cyan-600 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close Streak Modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <span className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-amber-200">
              <Flame className="w-6 h-6 fill-current animate-pulse" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">Habit Continuity</span>
              <h2 id="streak-title" className="text-xl sm:text-2xl font-bold font-display">
                Water-Saving Streak
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-amber-50/90 leading-relaxed max-w-md">
            Consistently recording your water consumption builds conservation mindfulness. Keep your streak alive by logging every single day!
          </p>

          {/* Current & Best Streak Counter Cards */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/20">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-200 mb-0.5">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Current</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-data tracking-tight">
                {currentStreak}
                <span className="text-xs font-normal ml-0.5">days</span>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-200 mb-0.5">
                <Award className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Record</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-data tracking-tight">
                {bestStreak}
                <span className="text-xs font-normal ml-0.5">days</span>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-cyan-200 mb-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Logged</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold font-data tracking-tight">
                {totalDaysLogged}
                <span className="text-xs font-normal ml-0.5">days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* 28-Day Consistency Calendar Grid */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#102338] border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Calendar className="w-4 h-4 text-cyan-500" />
                <span>Last 28 Days Activity</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500 inline-block" /> Logged
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-200 dark:bg-slate-700 inline-block" /> Missed
                </span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {daysGrid.map((day) => (
                <div
                  key={day.dateStr}
                  title={`${day.dateStr}: ${day.isLogged ? 'Water Logged' : 'No records'}`}
                  className={`h-9 rounded-xl flex flex-col items-center justify-center text-[10px] font-semibold transition-all relative ${
                    day.isLogged
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-200/80 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  } ${day.isToday ? 'ring-2 ring-amber-400 font-bold' : ''}`}
                >
                  <span>{day.label.split(' ')[0]}</span>
                  <span className="text-[9px] opacity-80">{day.label.split(' ')[1]}</span>
                  {day.isToday && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 text-center">
              Today is highlighted with a gold ring. Log today's usage to keep the streak blazing!
            </p>
          </div>

          {/* Streak Milestones */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Streak Milestones</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {milestones.map((m) => {
                const isReached = currentStreak >= m.days;
                const progressPct = Math.min(100, Math.round((currentStreak / m.days) * 100));

                return (
                  <div
                    key={m.days}
                    className={`p-3 rounded-2xl border transition-all ${
                      isReached
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-50/70 dark:bg-[#102338]/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{m.icon}</span>
                        <span className="text-xs font-bold">{m.title}</span>
                      </div>
                      {isReached ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">{progressPct}%</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{m.desc}</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isReached ? 'bg-emerald-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Streak Maintenance Rules */}
          <div className="p-3.5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-900 dark:text-cyan-200 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              How to maintain your streak:
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              • Record at least one water usage entry each calendar day (from drinking, showers, dishes, laundry, etc.).
              <br />
              • If you miss a calendar day without logging, your streak resets to 0, but your best streak record is always preserved!
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-[#081522] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenRecordModal();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs shadow-md shadow-orange-500/20 transition-all"
          >
            <Droplets className="w-4 h-4" />
            <span>+ Record Water Usage Today</span>
          </button>
        </div>
      </div>
    </div>
  );
};
