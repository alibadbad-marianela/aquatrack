import React from 'react';
import { AquaLogo } from '../AquaLogo';
import { MultilingualGreeting } from '../MultilingualGreeting';
import { MarineShowcase } from './MarineShowcase';
import { UserProfile, WaterRecord, Goal } from '../../types';
import { formatWaterVolume, CATEGORY_LABELS } from '../../lib/waterCalculations';
import { getTranslations } from '../../lib/localization';
import { BASELINE_VERIFIED_NEWS } from '../../lib/waterNewsData';
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

      {/* Tracking Streak Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-cyan-500/5 to-blue-500/10 border border-amber-500/25 dark:border-amber-400/20 text-xs text-amber-800 dark:text-amber-200 gap-2 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white shadow-sm shadow-amber-500/30">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold">Active Tracking Streak: </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {currentStreak > 0 ? `${currentStreak} consecutive days logged` : 'Start your logging streak today!'}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden md:inline">
          Track Every Drop. Protect Every Tomorrow.
        </span>
      </div>

      {/* Main Dashboard Metrics: Today, Weekly, Monthly, Goal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Water Consumption */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm hover:border-cyan-500/40 transition-colors">
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

        {/* Weekly Consumption Summary (7 Days) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Weekly (7 Days)
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-data text-blue-600 dark:text-blue-400">
            {formatWaterVolume(stats.weekTotalLiters, user.preferredUnit)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Rolling 7-day usage</span>
        </div>

        {/* Monthly Consumption Summary (30 Days) */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Monthly (30 Days)
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold font-data text-indigo-600 dark:text-indigo-400">
            {formatWaterVolume(stats.monthTotalLiters, user.preferredUnit)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Rolling 30-day volume</span>
        </div>

        {/* Water-Saving Goal and Progress */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm hover:border-emerald-500/40 transition-colors">
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
              <div className="flex items-baseline justify-between">
                <p className="text-2xl sm:text-3xl font-bold font-data text-slate-900 dark:text-white">
                  {goalProgressPct}%
                </p>
                <span className="text-[10px] sm:text-xs text-slate-400 font-data truncate max-w-[100px]">
                  of {formatWaterVolume(primaryGoal.targetLiters, user.preferredUnit)}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
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

      {/* Water Issues & Environmental News Preview (Real unique photographs) */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Newspaper className="w-4 h-4" />
              <span>Water Issues & Field News</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white">
              Latest Conservation Intelligence
            </h3>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 group"
          >
            <span>{t.navNews} Center</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BASELINE_VERIFIED_NEWS.slice(0, 2).map((article) => (
            <div
              key={article.id}
              onClick={() => onNavigate('news')}
              className="group rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] hover:border-cyan-500/60 dark:hover:border-cyan-400/60 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={article.imageUrl}
                  alt={article.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                  <span className="font-semibold truncate pr-2">{article.publisher}</span>
                  <span className="text-white/80 shrink-0">{article.publishedAt}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                    {article.headline}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold">{article.categoryLabel}</span>
                  <span className="text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 font-medium flex items-center gap-1">
                    Read Report <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
