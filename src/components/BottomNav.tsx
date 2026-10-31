import React from 'react';
import { Home, Calendar, History, BarChart3, Gamepad2 } from 'lucide-react';
import { getTranslations } from '../lib/localization';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  langCode?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, langCode = 'en' }) => {
  const t = getTranslations(langCode);

  // Exactly FIVE primary destinations required by AquaTrack architecture
  const destinations = [
    {
      id: 'dashboard',
      label: t.navHome || 'Home',
      subtitle: 'Dashboard',
      icon: Home,
    },
    {
      id: 'calendar',
      label: t.navCalendar || 'Calendar',
      subtitle: 'Daily Logs',
      icon: Calendar,
    },
    {
      id: 'history',
      label: t.navHistory || 'History',
      subtitle: 'Records',
      icon: History,
    },
    {
      id: 'analytics',
      label: t.navAnalytics || 'Analytics',
      subtitle: 'Trends',
      icon: BarChart3,
    },
    {
      id: 'games',
      label: t.navGames || 'Games',
      subtitle: 'Eco Arcade',
      icon: Gamepad2,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:bottom-5 md:left-1/2 md:-translate-x-1/2 z-40 w-full md:w-auto md:min-w-[580px] md:max-w-2xl bg-white/95 dark:bg-[#071320]/95 backdrop-blur-2xl border-t md:border border-cyan-500/20 dark:border-cyan-800/60 shadow-[0_-8px_30px_rgba(6,182,212,0.12)] md:shadow-[0_12px_40px_rgba(6,182,212,0.18)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.7)] md:rounded-full px-2 sm:px-3 pt-1.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] md:py-2 md:px-5 transition-all duration-300"
      role="navigation"
      aria-label="AquaTrack Primary Navigation"
    >
      <div className="flex items-center justify-around md:justify-center md:gap-2 h-16 md:h-14 max-w-lg md:max-w-none mx-auto">
        {destinations.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex-1 md:flex-initial md:px-4 flex flex-col md:flex-row items-center justify-center py-1 px-1 rounded-2xl md:rounded-full transition-all duration-200 relative min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer ${
                isActive
                  ? 'text-cyan-700 dark:text-cyan-200 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
              aria-label={`${item.label} - ${item.subtitle}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active subtle background pill */}
              {isActive && (
                <div className="absolute inset-0.5 md:inset-x-1 md:inset-y-0.5 bg-gradient-to-t md:bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-teal-500/10 dark:from-cyan-400/20 dark:via-blue-500/15 dark:to-teal-400/15 border border-cyan-500/30 dark:border-cyan-400/35 rounded-2xl md:rounded-full -z-10 pointer-events-none transition-all duration-200" />
              )}

              {/* Water droplet styled icon container */}
              <div
                className={`p-1.5 rounded-xl md:rounded-full transition-all duration-200 flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'scale-105 md:scale-100 bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 text-white shadow-md shadow-cyan-500/35 ring-2 ring-white/50 dark:ring-cyan-900/40'
                    : 'group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950/40 text-slate-500 dark:text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300'
                }`}
              >
                <Icon className="w-5 h-5 md:w-4 md:h-4" />
              </div>

              {/* Destination label & subtitle */}
              <div className="flex flex-col items-center md:items-start md:ml-2.5">
                <span
                  className={`text-[10px] sm:text-[11px] md:text-xs mt-0.5 md:mt-0 tracking-tight leading-none whitespace-nowrap ${
                    isActive
                      ? 'font-bold text-cyan-900 dark:text-cyan-100'
                      : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </span>
                <span className="hidden lg:block text-[9px] text-slate-400 dark:text-slate-500 leading-tight whitespace-nowrap">
                  {item.subtitle}
                </span>
              </div>

              {/* Glowing active indicator dot for mobile viewports */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 mt-0.5 md:hidden shadow-sm shadow-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
