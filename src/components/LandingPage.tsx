import React from 'react';
import { AquaLogo } from './AquaLogo';
import { CreatorCard } from './CreatorCard';
import { WaterNewsSection } from './news/WaterNewsSection';
import {
  Droplets,
  BarChart3,
  Gamepad2,
  BookOpen,
  Scale,
  Bot,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Heart,
  Globe2,
  GraduationCap,
  Newspaper
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenCreator: () => void;
  onOpenNews: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenCreator,
  onOpenNews,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] dark:bg-[#081522] text-[#172B4D] dark:text-[#F1F7FF] transition-colors">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#081522]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <AquaLogo size="md" withWordmark={true} withTagline={true} />

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenNews}
              className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <Newspaper className="w-4 h-4 text-cyan-500" />
              <span>Water News</span>
            </button>

            <button
              onClick={onOpenCreator}
              className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-cyan-500" />
              <span>About Creator</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Log In
            </button>

            <button
              onClick={onOpenRegister}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient aquatic background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-cyan-400/15 via-blue-500/10 to-teal-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
            <span>Water Conservation & Environmental Education Platform</span>
          </div>

          {/* Large Hero Droplet */}
          <div className="flex justify-center pt-2">
            <AquaLogo size="xl" animate={true} />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Track Every Drop.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              Protect Every Tomorrow.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            AquaTrack is your personal companion for smarter water use and environmental responsibility. Track daily consumption, uncover hidden household leaks, set meaningful conservation goals, master Philippine environmental laws, and play 10 interactive games.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Feature Pillars Grid */}
      <section className="py-16 bg-white dark:bg-[#0c1a2c]/60 border-t border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Complete Environmental Ecosystem
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">
              Everything Needed for Responsible Water Stewardship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
              <div className="p-3 w-fit rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 mb-4">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                Water Usage CRUD Tracking
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Log showers, laundry, and gardening in Liters, Gallons, or m³. Distinguish measured readings from estimates, filter by categories, and export spreadsheets.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
              <div className="p-3 w-fit rounded-2xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                Real Data Analytics (Recharts)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Calculated strictly from your saved records: 14-day area graphs, category donut breakdowns, rolling weekly averages, and goal progress bars.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
              <div className="p-3 w-fit rounded-2xl bg-amber-600/10 text-amber-600 dark:text-amber-400 mb-4">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                10 Interactive Games
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Fully playable experiences: Leak Detective Patrol, Smart Home Builder, Aquatic Memory Match, River Cleanup, Water Cycle Puzzle, and Virtual Aquarium.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
              <div className="p-3 w-fit rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 mb-4">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                Philippine Environmental Laws
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Authoritative legal curriculum covering RA 9275 (Clean Water Act), PD 1067 (Water Code), RA 9003 (Solid Waste), and verified Official Gazette sources.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
              <div className="p-3 w-fit rounded-2xl bg-purple-600/10 text-purple-600 dark:text-purple-400 mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                Personalized AI Assistant
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Server-side Gemini integration analyzes your authorized water usage statistics to offer practical household advice and legal explanations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
              <div className="p-3 w-fit rounded-2xl bg-teal-600/10 text-teal-600 dark:text-teal-400 mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-2">
                14 Multilingual Greetings
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Personalized greeting rotating smoothly in 14 languages including Filipino, Cebuano, Arabic (RTL), Spanish, French, Japanese, and Mandarin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Water Issues & Environmental News Section (Publicly accessible) */}
      <WaterNewsSection onOpenNews={onOpenNews} />

      {/* Dedicated Project Background & Creator Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <CreatorCard />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1a2c] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AquaLogo size="sm" withWordmark={true} />
            <span className="text-slate-400">|</span>
            <span>Track Every Drop. Protect Every Tomorrow.</span>
          </div>

          <div className="text-center sm:text-right">
            <p>Created by Marian Ela J. Alibadbad — Maasin City National High School (STEM)</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Educational water conservation & Philippine environmental jurisprudence platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
