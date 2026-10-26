import React, { useState } from 'react';
import { Goal, Reminder, Achievement, WaterRecord } from '../../types';
import { calculateGoalProgress, formatWaterVolume } from '../../lib/waterCalculations';
import {
  Target,
  Bell,
  Award,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  Flame,
  Check,
  Sparkles
} from 'lucide-react';

interface GoalsViewProps {
  goals: Goal[];
  reminders: Reminder[];
  achievements: Array<{ achievementId: string; unlockedAt: string }>;
  currentStreak: number;
  records: WaterRecord[];
  onCreateGoal: (data: any) => Promise<void>;
  onDeleteGoal: (id: string) => Promise<void>;
  onCreateReminder: (data: any) => Promise<void>;
  onToggleReminder: (id: string, enabled: boolean) => Promise<void>;
  onDeleteReminder: (id: string) => Promise<void>;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  reminders,
  achievements,
  currentStreak,
  records,
  onCreateGoal,
  onDeleteGoal,
  onCreateReminder,
  onToggleReminder,
  onDeleteReminder,
}) => {
  const [activeTab, setActiveTab] = useState<'goals' | 'reminders' | 'achievements'>('goals');

  // New Goal Form State
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTarget, setGoalTarget] = useState('100');
  const [goalPeriod, setGoalPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [submittingGoal, setSubmittingGoal] = useState(false);

  // New Reminder Form State
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [remTitle, setRemTitle] = useState('Log Daily Water Consumption');
  const [remTime, setRemTime] = useState('20:00');
  const [remType, setRemType] = useState<any>('log_usage');
  const [notificationStatus, setNotificationStatus] = useState<string>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  const requestNotificationPermission = async () => {
    if (typeof Notification !== 'undefined') {
      const res = await Notification.requestPermission();
      setNotificationStatus(res);
      if (res === 'granted') {
        new Notification('AquaTrack Notifications Enabled!', {
          body: 'You will receive timely reminders to log water activities and check goals.',
          icon: '/logo-droplet.svg',
        });
      }
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || !goalTarget) return;

    setSubmittingGoal(true);
    try {
      await onCreateGoal({
        title: goalTitle.trim(),
        targetLiters: parseFloat(goalTarget),
        period: goalPeriod,
        category: 'all',
      });
      setShowGoalModal(false);
      setGoalTitle('');
      setGoalTarget('100');
    } finally {
      setSubmittingGoal(false);
    }
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remTitle.trim() || !remTime) return;

    await onCreateReminder({
      title: remTitle.trim(),
      time: remTime,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      enabled: true,
      type: remType,
    });
    setShowReminderModal(false);
  };

  // Calculate actual consumption against goals
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLiters = records.filter((r) => r.date === todayStr).reduce((s, r) => s + r.quantityLiters, 0);

  const ALL_ACHIEVEMENTS = [
    { id: 'first_drop', title: 'First Drop', desc: 'Recorded your first water activity', icon: '💧' },
    { id: 'streak_master', title: 'Streak Champion', desc: 'Maintained a 3+ day tracking streak', icon: '🔥' },
    { id: 'eco_scholar', title: 'Eco Scholar', desc: 'Completed an educational lesson in the Hub', icon: '📚' },
    { id: 'game_player', title: 'Game Explorer', desc: 'Played one of AquaTrack’s 10 educational games', icon: '🎮' },
    { id: 'game_master', title: 'Master Gamer', desc: 'Achieved a perfect 3-star score in a game', icon: '⭐' },
    { id: 'goal_crusher', title: 'Goal Keeper', desc: 'Set and satisfied a daily conservation limit', icon: '🎯' },
    { id: 'law_scholar', title: 'Legal Scholar', desc: 'Reviewed Philippine Clean Water Act provisions', icon: '⚖️' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Streak summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Goals, Reminders & Badges
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Set conservation thresholds and celebrate genuine habit milestones
          </p>
        </div>

        {/* Current streak badge */}
        <div className="self-start sm:self-center flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
          <Flame className="w-5 h-5 text-amber-500 animate-bounce" />
          <span className="font-bold text-sm">
            {currentStreak} Day{currentStreak === 1 ? '' : 's'} Active Streak
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('goals')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'goals'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Conservation Goals ({goals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reminders')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'reminders'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Reminders ({reminders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'achievements'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Achievements ({achievements.length}/{ALL_ACHIEVEMENTS.length})</span>
        </button>
      </div>

      {/* GOALS TAB */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Conservation Targets</h3>
            <button
              onClick={() => setShowGoalModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Goal</span>
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52]">
              <Target className="w-10 h-10 text-cyan-500 mx-auto mb-2 opacity-80" />
              <p className="font-bold text-slate-900 dark:text-white">No active conservation goals</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Creating a daily ceiling (such as 100 Liters/day) helps prevent wasteful habits before they add up.
              </p>
              <button
                onClick={() => setShowGoalModal(true)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold"
              >
                Set a Daily Water Goal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => {
                const consumed = goal.period === 'daily' ? todayLiters : todayLiters * 3;
                const { percentage, remaining, isExceeded } = calculateGoalProgress(goal.targetLiters, consumed);

                return (
                  <div
                    key={goal.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/40">
                            {goal.period} Limit
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                            {goal.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => onDeleteGoal(goal.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                          title="Delete goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-2xl font-bold font-data text-slate-900 dark:text-white">
                          {Math.round(consumed * 10) / 10} <span className="text-xs text-slate-400">/ {goal.targetLiters} L</span>
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isExceeded ? 'text-red-500' : percentage >= 80 ? 'text-amber-500' : 'text-emerald-500'
                          }`}
                        >
                          {percentage}% Used
                        </span>
                      </div>

                      <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isExceeded
                              ? 'bg-red-500'
                              : percentage >= 80
                              ? 'bg-amber-500'
                              : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                          }`}
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex justify-between items-center text-slate-500">
                      <span>{isExceeded ? 'Exceeded by' : 'Remaining capacity:'}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {isExceeded ? `${Math.round((consumed - goal.targetLiters) * 10) / 10} L over` : `${remaining} L`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* REMINDERS TAB */}
      {activeTab === 'reminders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Daily Habit Reminders</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scheduled prompts to record readings and inspect fixtures
              </p>
            </div>

            <div className="flex items-center gap-2">
              {notificationStatus !== 'granted' && (
                <button
                  onClick={requestNotificationPermission}
                  className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 text-xs font-medium"
                >
                  Enable Browser Alerts
                </button>
              )}
              <button
                onClick={() => setShowReminderModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-semibold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Reminder</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${rem.enabled ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' : 'bg-slate-100 text-slate-400'}`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rem.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <span>Daily at {rem.time}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleReminder(rem.id, !rem.enabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      rem.enabled ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        rem.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => onDeleteReminder(rem.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS TAB */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Earned Badges & Milestones</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Genuine application achievements awarded exclusively for real actions
              </p>
            </div>
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
              {achievements.length} of {ALL_ACHIEVEMENTS.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ALL_ACHIEVEMENTS.map((ach) => {
              const isUnlocked = achievements.some((a) => a.achievementId === ach.id);
              const record = achievements.find((a) => a.achievementId === ach.id);

              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-3xl border transition-all ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-white to-cyan-50/50 dark:from-[#102338] dark:to-[#0c1a2c] border-cyan-500/30 shadow-md shadow-cyan-500/5'
                      : 'bg-slate-50/50 dark:bg-[#0c1a2c]/40 border-slate-200 dark:border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl p-2 rounded-2xl bg-white dark:bg-slate-800 shadow-sm">
                      {ach.icon}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ach.title}</h4>
                      <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">
                        {isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{ach.desc}</p>
                  {isUnlocked && record?.unlockedAt && (
                    <p className="text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      Earned on {record.unlockedAt.split('T')[0]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Create Goal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Set Conservation Goal</h3>
            <p className="text-xs text-slate-500 mb-4">Establish a maximum water consumption target.</p>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Daily Household Limit"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Period
                </label>
                <select
                  value={goalPeriod}
                  onChange={(e) => setGoalPeriod(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="daily">Daily Target</option>
                  <option value="weekly">Weekly Target</option>
                  <option value="monthly">Monthly Target</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Max Volume (Liters)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingGoal}
                  className="w-1/2 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-700"
                >
                  {submittingGoal ? 'Saving...' : 'Set Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Reminder */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Add Reminder</h3>
            <p className="text-xs text-slate-500 mb-4">Never miss logging daily water habits.</p>

            <form onSubmit={handleCreateReminder} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reminder Title
                </label>
                <input
                  type="text"
                  required
                  value={remTitle}
                  onChange={(e) => setRemTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scheduled Time
                </label>
                <input
                  type="time"
                  required
                  value={remTime}
                  onChange={(e) => setRemTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReminderModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-700"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
