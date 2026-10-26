import React, { useState, useEffect } from 'react';
import { GREETING_LANGUAGES, formatGreeting } from '../lib/localization';
import { Globe, Pause, Play, ChevronDown } from 'lucide-react';

interface MultilingualGreetingProps {
  nickname: string;
  autoRotate?: boolean;
  intervalSec?: number;
  initialLangCode?: string;
  className?: string;
  onLanguageChange?: (langCode: string) => void;
}

export const MultilingualGreeting: React.FC<MultilingualGreetingProps> = ({
  nickname,
  autoRotate = true,
  intervalSec = 8,
  initialLangCode = 'en',
  className = '',
  onLanguageChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = GREETING_LANGUAGES.findIndex((l) => l.code === initialLangCode);
    return idx !== -1 ? idx : 0;
  });

  const [isPaused, setIsPaused] = useState(!autoRotate);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GREETING_LANGUAGES.length);
    }, Math.max(3000, intervalSec * 1000));

    return () => clearInterval(timer);
  }, [isPaused, intervalSec]);

  const currentLang = GREETING_LANGUAGES[currentIndex];
  const { text, isRtl, language } = formatGreeting(currentLang.code, nickname);

  const selectLanguage = (code: string) => {
    const idx = GREETING_LANGUAGES.findIndex((l) => l.code === code);
    if (idx !== -1) {
      setCurrentIndex(idx);
      setIsPaused(true); // pause when manually selected
      if (onLanguageChange) onLanguageChange(code);
    }
    setDropdownOpen(false);
  };

  return (
    <div
      className={`inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 p-2 px-3.5 rounded-2xl bg-white/70 dark:bg-[#10243A]/80 backdrop-blur-md border border-cyan-500/20 shadow-sm ${className}`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="flex items-center gap-2">
        <span className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
          <Globe className="w-4 h-4 shrink-0" />
        </span>

        {/* Greeting text with stable min-width to prevent layout shifts */}
        <div className="min-w-[140px] sm:min-w-[180px] text-left">
          <p className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight leading-tight transition-all duration-300">
            {text}
          </p>
          <span className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400">
            {language} ({currentLang.nativeName})
          </span>
        </div>
      </div>

      {/* Controls: Pause/Play and Language Selector */}
      <div className="flex items-center gap-1 self-end sm:self-center ml-auto border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-1 sm:pt-0 sm:pl-2">
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-slate-800 transition-colors"
          title={isPaused ? 'Resume greeting rotation' : 'Pause rotation'}
          aria-label={isPaused ? 'Resume rotation' : 'Pause rotation'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Select greeting language"
          >
            <span className="font-semibold uppercase">{currentLang.code}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 max-h-60 overflow-y-auto rounded-xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                14 Supported Languages
              </div>
              {GREETING_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                    lang.code === currentLang.code
                      ? 'bg-cyan-500 text-white font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{lang.language}</span>
                  <span className="text-[10px] opacity-75">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
