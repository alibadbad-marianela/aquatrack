import React from 'react';
import { AquaLogo } from '../AquaLogo';
import { MultilingualGreeting } from '../MultilingualGreeting';
import { MarineShowcase } from './MarineShowcase';
import { UserProfile, WaterRecord, Goal } from '../../types';
import { formatWaterVolume, CATEGORY_LABELS } from '../../lib/waterCalculations';
import { getTranslations } from '../../lib/localization';
import {
  Droplets,
  Plus,
  Compass,
  ArrowRight,
  TrendingDown,
  Award,
  Calendar,
  Sparkles,
  Scale,
  Gamepad2,
  BookOpen,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Clock,
  History,
  Newspaper
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  records: WaterRecord[];
  goals: Goal[];
  analyticsData: any;
  currentStreak: number;
  onOpenRecordModal: () => void;
  onNavigate: (view: string) => void;
  onOpenAIAssistant: () => void;
  onLanguageChange?: (langCode: string) => void;
}

const DAILY_TIPS = [
  'Inspect your toilet tank with 5 drops of food coloring. If color appears in the bowl after 15 minutes without flushing, your flapper needs replacement.',
  'Turn off the bathroom tap while lathering soap or brushing teeth to immediately save up to 12 Liters per session.',
  'Only run dishwashers and washing machines with complete, full loads to maximize both water and electrical efficiency.',
  'Water your garden and potted plants before 8:00 AM to eliminate rapid evaporation from the midday tropical sun.',
  'Never pour cooking fats, oils, or grease (FOG) down the kitchen drain — they form pipe fatbergs and pollute municipal rivers under RA 9275.',
  'Install inexpensive micro-bubble faucet aerators on bathroom and kitchen taps to cut water volume by 50% without dropping pressure.',
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  records,
  goals,
  analyticsData,
  currentStreak,
  onOpenRecordModal,
  onNavigate,
  onOpenAIAssistant,
  onLanguageChange,
}) => {
  const t = getTranslations(user.preferredLanguage || 'en');
  const stats = analyticsData?.stats || {
    todayTotalLiters: 0,
    weekTotalLiters: 0,
    monthTotalLiters: 0,
    averageDailyLiters: 0,
    totalRecordsCount: records.length,
  };

  // Today's Tip based on day of month
  const tipIndex = new Date().getDate() % DAILY_TIPS.length;
  const tipOfTheDay = DAILY_TIPS[tipIndex];

  // Algorithmic Personalized Recommendation based on highest category
  const categoryTotals = analyticsData?.categoryTotals || {};
  let highestCat = 'bathing_showering';
  let highestCatVal = 0;
  for (const [cat, val] of Object.entries(categoryTotals)) {
    if ((val as number) > highestCatVal) {
      highestCatVal = val as number;
      highestCat = cat;
    }
  }

  const primaryGoal = goals.find((g) => g.active && g.period === 'daily') || goals[0];
  const goalProgressPct = primaryGoal
    ? Math.min(100, Math.round((stats.todayTotalLiters / primaryGoal.targetLiters) * 100))
    : 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/40 dark:from-[#102338] dark:via-[#0c1a2c] dark:to-[#081522] border border-cyan-500/20 shadow-xl overflow-hidden text-center">
        {/* Subtle Underwater Coral Reef Background */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15 dark:opacity-20 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />

        {/* Ambient background glow */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-20 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-5">
          {/* Animated Water Droplet */}
          <div className="flex justify-center">
            <AquaLogo size="lg" animate={true} />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="font-display font-bold text-3xl sm:text-4xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                Aqua
              </span>
              <span className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white">
                Track
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-300 tracking-wide">
              Track Every Drop. Protect Every Tomorrow.
            </p>
          </div>

          {/* Multilingual Greeting */}
          <div className="flex justify-center pt-1">
            <MultilingualGreeting
              nickname={user.nickname}
              autoRotate={user.autoRotateGreeting}
              intervalSec={user.greetingRotateIntervalSec}
              initialLangCode={user.preferredLanguage}
              onLanguageChange={onLanguageChange}
            />
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Welcome to your personalized water conservation headquarters. Record daily domestic activities, examine consumption analytics, explore verified Philippine environmental laws, and participate in interactive games.
          </p>

          {/* Primary & Secondary Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenRecordModal}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t.recordWaterUsage}</span>
            </button>

            <button
              onClick={() => onNavigate('learn')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 text-cyan-500" />
              <span>{t.exploreTips}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.todayWater}
            </span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-data text-cyan-600 dark:text-cyan-400">
            {formatWaterVolume(stats.todayTotalLiters, user.preferredUnit)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active date consumption</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.past7Days}
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-data text-blue-600 dark:text-blue-400">
            {formatWaterVolume(stats.weekTotalLiters, user.preferredUnit)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Rolling weekly total</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.activeStreak}
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-data text-amber-500">
            {currentStreak} <span className="text-sm font-semibold text-slate-400">Days</span>
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Consecutive tracking</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t.dailyTarget}
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          {primaryGoal ? (
            <div>
              <p className="text-2xl sm:text-3xl font-bold font-data text-slate-900 dark:text-white">
                {goalProgressPct}%
              </p>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full ${
                    goalProgressPct > 100 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, goalProgressPct)}%` }}
                />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-slate-400 mt-1">No goal configured</p>
              <button
                onClick={() => onNavigate('goals')}
                className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline mt-1"
              >
                + Set Goal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tip of the Day & Personalized Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tip of the Day */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Practical Tip of the Day
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              "{tipOfTheDay}"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Updated daily</span>
            <button
              onClick={() => onNavigate('learn')}
              className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              Browse All Guides →
            </button>
          </div>
        </div>

        {/* Contextual Recommendation */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-cyan-50/60 to-blue-50/60 dark:from-[#0c1a2c] dark:to-[#102338] border border-cyan-500/20 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Personalized Recommendation
              </span>
            </div>

            {records.length > 0 ? (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Based on your records, <strong>{CATEGORY_LABELS[highestCat as keyof typeof CATEGORY_LABELS]?.label || 'Water Use'}</strong> represents your highest domestic consumption category ({Math.round(highestCatVal)} Liters). Consider installing an aerator or timing your sessions to conserve water.
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Log your first domestic water activity today! Once you record multiple activities, AquaTrack automatically analyzes your habits to generate tailored conservation advice.
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-cyan-500/20 flex justify-between items-center text-xs">
            <span className="text-slate-400">Data-driven insight</span>
            <button
              onClick={onOpenAIAssistant}
              className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              Ask AI Assistant →
            </button>
          </div>
        </div>
      </div>

      {/* Marine Ecosystem & Coastal Biodiversity Showcase */}
      <MarineShowcase onNavigateToLearn={() => onNavigate('learn')} />

      {/* Secondary Features & Conservation Hub (No duplicate shortcuts for Calendar, History, Analytics, Games) */}
      <div className="space-y-3">
        <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
          {t.secondaryFeaturesTitle}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigate('news')}
            className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] hover:border-cyan-500 text-left transition-all shadow-sm group"
          >
            <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500 w-fit mb-2.5 group-hover:scale-110 transition-transform">
              <Newspaper className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{t.navNews}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Daily Global & PH Water News</p>
          </button>

          <button
            onClick={() => onNavigate('laws')}
            className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] hover:border-cyan-500 text-left transition-all shadow-sm group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 w-fit mb-2.5 group-hover:scale-110 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{t.navLaws}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">RA 9275 & PD 1067 Guides</p>
          </button>

          <button
            onClick={() => onNavigate('learn')}
            className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] hover:border-cyan-500 text-left transition-all shadow-sm group"
          >
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500 w-fit mb-2.5 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{t.navLearn}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Conservation Lessons</p>
          </button>

          <button
            onClick={() => onNavigate('goals')}
            className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] hover:border-cyan-500 text-left transition-all shadow-sm group"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 w-fit mb-2.5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{t.navGoals}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Limits & Badges</p>
          </button>
        </div>
      </div>

      {/* Recent Activity List preview */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{t.recentActivities}</h3>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            {t.viewAllHistory} ({records.length}) →
          </button>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] text-xs text-slate-500">
            <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
              {t.noRecordsYet}
            </p>
            <p className="mb-4 max-w-md mx-auto">
              {t.noRecordsSub}
            </p>
            <button
              onClick={onOpenRecordModal}
              className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-semibold shadow-sm hover:bg-cyan-700 transition-colors"
            >
              {t.logFirstDrop}
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {records.slice(0, 4).map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {r.activityName}
                    </h5>
                    <span className="text-[11px] text-slate-400">
                      {r.date} • {r.time}
                    </span>
                  </div>
                </div>

                <span className="text-sm font-bold font-data text-cyan-600 dark:text-cyan-400">
                  {formatWaterVolume(r.quantityLiters, user.preferredUnit)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
