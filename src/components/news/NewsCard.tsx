import React, { useState } from 'react';
import { WaterNewsItem } from '../../types';
import { ExternalLink, Calendar, Building2, Globe, Tag, Sparkles } from 'lucide-react';

interface NewsCardProps {
  article: WaterNewsItem;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const [imgError, setImgError] = useState(false);

  // Format date nicely
  const formattedDate = (() => {
    try {
      const d = new Date(article.publishedAt);
      if (isNaN(d.getTime())) return article.publishedAt;
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return article.publishedAt;
    }
  })();

  const categoryColorClass = (() => {
    switch (article.category) {
      case 'philippines_conservation':
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30';
      case 'ocean_coral_reefs':
        return 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30';
      case 'scarcity_drought':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30';
      case 'river_pollution':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'climate_research':
        return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30';
    }
  })();

  const fallbackImage = (() => {
    switch (article.category) {
      case 'ocean_coral_reefs':
        return 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=80';
      case 'river_pollution':
        return 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=1200&q=80';
      case 'scarcity_drought':
        return 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80';
      case 'household_efficiency':
        return 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1200&q=80';
      case 'philippines_conservation':
        return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
      case 'climate_research':
      default:
        return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80';
    }
  })();

  return (
    <article
      className={`group rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] overflow-hidden shadow-sm hover:shadow-xl hover:border-cyan-500/50 transition-all duration-300 flex flex-col ${
        featured ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {/* Article Image Container */}
      <div
        className={`relative overflow-hidden bg-slate-900 ${
          featured ? 'md:w-1/2 min-h-[260px]' : 'w-full h-48 sm:h-52'
        }`}
      >
        <img
          src={imgError || !article.imageUrl ? fallbackImage : article.imageUrl}
          alt={`${article.headline} - Photo via ${article.publisher}`}
          onError={() => setImgError(true)}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Region & Topic Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold backdrop-blur-md border ${categoryColorClass} bg-white/90 dark:bg-black/70 shadow-sm`}
          >
            {article.categoryLabel || article.category}
          </span>
          {article.region === 'philippines' && (
            <span className="px-2 py-1 rounded-xl text-[11px] font-bold bg-blue-600 text-white shadow-sm flex items-center gap-1">
              🇵🇭 Philippines
            </span>
          )}
        </div>

        {/* Original Publisher tag over image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs z-10">
          <span className="inline-flex items-center gap-1 font-semibold truncate drop-shadow-md">
            <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{article.publisher}</span>
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className={`p-5 sm:p-6 flex-1 flex flex-col justify-between ${featured ? 'md:w-1/2' : ''}`}>
        <div>
          {/* Metadata: Date and Region */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Published: {formattedDate}</span>
            </span>
            <span>•</span>
            <span className="capitalize">{article.region}</span>
          </div>

          {/* Headline */}
          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-2 line-clamp-2">
            {article.headline}
          </h3>

          {/* Summary */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
            {article.summary}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {article.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Working External Link */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
          <span className="text-[11px] text-slate-400">
            Source: <strong className="text-slate-600 dark:text-slate-300 font-medium">{article.publisher}</strong>
          </span>

          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:underline transition-colors group-hover:translate-x-0.5"
            aria-label={`Read full article on ${article.publisher}: ${article.headline}`}
          >
            <span>Read Official Report</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
