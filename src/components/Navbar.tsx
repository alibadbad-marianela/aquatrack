import React, { useState } from 'react';
import { AquaLogo } from './AquaLogo';
import { MultilingualGreeting } from './MultilingualGreeting';
import { LocalTimeDisplay } from './LocalTimeDisplay';
import { UserProfile, WaterRecord } from '../types';
import { getTranslations } from '../lib/localization';
import {
  Plus,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  Scale,
  Users,
  Target,
  Bot,
  GraduationCap,
  Wifi,
  WifiOff,
  ChevronDown,
  RefreshCw,
  Flame,
} from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  currentView?: string;
  currentTheme: 'light' | 'dark' | 'system';
  isOnline: boolean;
  pendingSyncCount: number;
  streakCount?: number;
  onOpenStreak?: () => void;
  onThemeToggle: () => void;
  onOpenRecordModal: () => void;
  onOpenAIAssistant: () => void;
  onOpenCreator: () => void;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onManualSync: () => void;
  onLanguageChange?: (langCode: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentView = 'dashboard',
  currentTheme,
  isOnline,
  pendingSyncCount,
  streakCount = 0,
  onOpenStreak,
  onThemeToggle,
  onOpenRecordModal,
  onOpenAIAssistant,
  onOpenCreator,
  onNavigate,
  onLogout,
  onManualSync,
  onLanguageChange,
}) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const t = getTranslations(user.preferredLanguage || 'en');

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#081522]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Left: AquaTrack Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="focus:outline-none hover:opacity-95 transition-opacity"
            aria-label="AquaTrack Home"
          >
            <AquaLogo size="md" withWordmark={true} withTagline={false} />
          </button>

          {/* Multilingual Greeting (visible on xl screens) */}
          <div className="hidden xl:block">
            <MultilingualGreeting
              nickname={user.nickname}
              autoRotate={user.autoRotateGreeting}
              intervalSec={user.greetingRotateIntervalSec}
              initialLangCode={user.preferredLanguage}
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>

        {/* Center: Dynamic Local Date and Time (IP Geolocation & Browser Fallback) */}
        <LocalTimeDisplay />

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online / Offline Sync indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all">
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg">
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Online</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 border-amber-500/20 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline</span>
              </span>
            )}

            {pendingSyncCount > 0 && (
              <button
                onClick={onManualSync}
                className="flex items-center gap-1 text-[10px] bg-cyan-500 text-white px-2 py-0.5 rounded-lg hover:bg-cyan-600"
                title="Sync offline records to database"
              >
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>{pendingSyncCount} queued</span>
              </button>
            )}
          </div>

          {/* Quick AI Assistant Trigger */}
          <button
            onClick={onOpenAIAssistant}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Open AquaTrack AI Assistant"
            aria-label="Open AI Assistant"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden md:inline">AI Help</span>
          </button>

          {/* Water-Saving Streak Trigger (Next to AI Help) */}
          {onOpenStreak && (
            <button
              onClick={onOpenStreak}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title={`Water-Saving Streak: ${streakCount} consecutive days logged. Click to view history.`}
              aria-label="View Water-Saving Streak History"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500/40 animate-pulse" />
              <span className="font-data font-bold">{streakCount}d</span>
              <span className="hidden md:inline text-amber-700 dark:text-amber-300">Streak</span>
            </button>
          )}

          {/* Log Water Usage CTA */}
          <button
            onClick={onOpenRecordModal}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all"
            aria-label="Record Water Usage"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Record</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle light or dark theme"
            title="Toggle theme"
          >
            {currentTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="User navigation menu"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                {user.avatarUrl && (user.avatarUrl.startsWith('http') || user.avatarUrl.startsWith('data:')) ? (
                  <img src={user.avatarUrl} alt={user.nickname} className="w-full h-full object-cover" />
                ) : user.avatarUrl ? (
                  <span className="text-sm">{user.avatarUrl}</span>
                ) : (
                  user.nickname ? user.nickname[0].toUpperCase() : 'J'
                )}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-1.5">
                {/* Account Information with Direct Profile Edit Option */}
                <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {user.displayName || user.nickname}
                      </p>
                      {user.username && (
                        <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-data">
                          @{user.username}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('profile');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[11px] font-semibold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                    title="Edit profile, photo, and account details"
                    aria-label="Edit Profile"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-900 dark:text-white font-semibold"
                  >
                    <User className="w-4 h-4 text-cyan-500" />
                    <span>My Profile & Photo</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('goals');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                  >
                    <Target className="w-4 h-4 text-cyan-500" />
                    <span>Goals & Reminders</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('laws');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                  >
                    <Scale className="w-4 h-4 text-amber-500" />
                    <span>Philippine Environmental Laws</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('community');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                  >
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>Community Hub</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenCreator();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                  >
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    <span>About Creator & Project</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings & Units</span>
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
