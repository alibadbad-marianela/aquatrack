import React, { useState, useEffect } from 'react';
import { WaterNewsItem } from '../../types';
import { api } from '../../lib/api';
import { NewsCard } from './NewsCard';
import {
  Newspaper,
  ArrowRight,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface WaterNewsSectionProps {
  onOpenNews: () => void;
}

export const WaterNewsSection: React.FC<WaterNewsSectionProps> = ({ onOpenNews }) => {
  const [articles, setArticles] = useState<WaterNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [status, setStatus] = useState<string>('live');

  useEffect(() => {
    let isMounted = true;
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await api.getNews({ limit: 4 });
        if (isMounted) {
          setArticles(data.articles);
          setLastUpdated(data.lastUpdated);
          setStatus(data.status);
        }
      } catch (err) {
        console.warn('Could not load online news on welcome page, continuing gracefully:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNews();
    return () => {
      isMounted = false;
    };
  }, []);

  const formattedUpdate = (() => {
    if (!lastUpdated) return 'Automated Daily Job Active';
    try {
      const d = new Date(lastUpdated);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return lastUpdated;
    }
  })();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-cyan-50/30 to-white dark:from-[#081522] dark:via-[#0b1c2e] dark:to-[#081522] border-t border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/80 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs font-bold mb-3 shadow-xs">
              <Newspaper className="w-3.5 h-3.5 text-cyan-500" />
              <span>Real-Time Environmental Journalism</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Water Issues & Environmental News
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Stay informed with authentic, verified reports on global water scarcity, Philippine river basin rehabilitation, coral reef bleaching, and sustainable watershed policies from the UN, WHO, UNEP, and the DENR.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Updated Daily</span>
              <span className="text-slate-400">({formattedUpdate})</span>
            </div>

            {/* View All News Button */}
            <button
              onClick={onOpenNews}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>View All News</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading && articles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-3xl bg-slate-100 dark:bg-slate-800/50 p-6 h-72 animate-pulse flex flex-col justify-between"
              >
                <div className="h-32 bg-slate-200 dark:bg-slate-700/60 rounded-2xl mb-4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {articles.map((article, idx) => (
              <NewsCard key={`${article.id}-${idx}`} article={article} featured={idx === 0} />
            ))}
          </div>
        )}

        {/* Call to action bar at bottom of section */}
        <div className="mt-10 p-6 rounded-3xl bg-white dark:bg-[#102338] border border-cyan-100 dark:border-cyan-900/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                100% Genuine, Verified Sources
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Directly synchronized with official UN-Water, WHO, and Philippine DENR bulletins.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenNews}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Explore Full News Feed & Archive</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
