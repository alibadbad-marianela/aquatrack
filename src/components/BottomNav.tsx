import React from 'react';
import { Home, Calendar, History, BarChart3, Gamepad2 } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'games', label: 'Games', icon: Gamepad2 },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#071320]/95 backdrop-blur-xl border-t border-cyan-500/20 dark:border-cyan-900/40 shadow-2xl px-2 pt-1 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
      role="navigation"
      aria-label="AquaTrack Primary Navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all duration-200 relative min-h-[48px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                isActive
                  ? 'text-cyan-600 dark:text-cyan-300 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active ambient glow pill */}
              {isActive && (
                <div className="absolute inset-x-2 inset-y-1 bg-gradient-to-t from-cyan-500/15 via-blue-500/10 to-transparent rounded-2xl -z-10 pointer-events-none" />
              )}

              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'scale-110 bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] mt-1 tracking-tight leading-none ${
                  isActive ? 'font-bold text-cyan-700 dark:text-cyan-300' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>

              {/* Glowing active dot */}
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 mt-0.5 shadow-sm shadow-cyan-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
