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
  const items = [
    { id: 'dashboard', label: t.navHome, subtitle: 'Dashboard', icon: Home },
    { id: 'calendar', label: t.navCalendar, subtitle: 'Daily Logs', icon: Calendar },
    { id: 'history', label: t.navHistory, subtitle: 'Records', icon: History },
    { id: 'analytics', label: t.navAnalytics, subtitle: 'Trends', icon: BarChart3 },
    { id: 'games', label: t.navGames, subtitle: '10 Games', icon: Gamepad2 },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:bottom-5 md:left-1/2 md:-translate-x-1/2 z-40 w-full md:w-auto md:min-w-[560px] md:max-w-2xl bg-white/95 dark:bg-[#071320]/95 backdrop-blur-2xl border-t md:border border-cyan-500/25 dark:border-cyan-800/60 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-2xl md:rounded-full px-2 sm:px-3 pt-1 pb-[max(0.6rem,env(safe-area-inset-bottom))] md:py-2 md:px-5 transition-all"
      role="navigation"
      aria-label="AquaTrack Dashboard Navigation Bar"
    >
      <div className="flex items-center justify-around md:justify-center md:gap-3 h-16 md:h-14 max-w-md md:max-w-none mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 md:flex-initial md:px-4 flex flex-col md:flex-row items-center justify-center py-1.5 px-1 rounded-2xl md:rounded-full transition-all duration-200 relative min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer ${
                isActive
                  ? 'text-cyan-600 dark:text-cyan-300 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
              aria-label={`${item.label} - ${item.subtitle}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active ambient glow pill */}
              {isActive && (
                <div className="absolute inset-x-1 inset-y-1 bg-gradient-to-t md:bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent rounded-2xl md:rounded-full -z-10 pointer-events-none" />
              )}

              <div
                className={`p-1.5 rounded-xl md:rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'scale-110 md:scale-100 bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/35'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-5 h-5 md:w-4 md:h-4 shrink-0" />
              </div>

              <div className="flex flex-col items-center md:items-start md:ml-2">
                <span
                  className={`text-[11px] md:text-xs mt-1 md:mt-0 tracking-tight leading-none ${
                    isActive ? 'font-bold text-cyan-700 dark:text-cyan-300' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
                <span className="hidden lg:block text-[9px] text-slate-400 dark:text-slate-500 leading-tight">
                  {item.subtitle}
                </span>
              </div>

              {/* Glowing active indicator dot for mobile */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mt-0.5 md:hidden shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
