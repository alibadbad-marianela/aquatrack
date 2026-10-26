import React, { useState, useEffect } from 'react';
import { WaterNewsItem, NewsCategory } from '../../types';
import { api } from '../../lib/api';
import { NewsCard } from './NewsCard';
import {
  Newspaper,
  Search,
  Filter,
  RefreshCw,
  Clock,
  ArrowLeft,
  Calendar,
  Globe2,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface WaterNewsViewProps {
  onBack: () => void;
  isAuthenticated: boolean;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const WaterNewsView: React.FC<WaterNewsViewProps> = ({
  onBack,
  isAuthenticated,
  onOpenAuth,
}) => {
  const [articles, setArticles] = useState<WaterNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshFeedback, setRefreshFeedback] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Metadata & Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isStale, setIsStale] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('live');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Topics' },
    { id: 'philippines_conservation', label: '🇵🇭 Philippine Conservation' },
    { id: 'scarcity_drought', label: 'Water Scarcity & Drought' },
    { id: 'ocean_coral_reefs', label: 'Oceans & Coral Reefs' },
    { id: 'river_pollution', label: 'River & Plastic Waste' },
    { id: 'climate_research', label: 'Climate Research' },
    { id: 'household_efficiency', label: 'Household Water Efficiency' },
  ];

  const fetchNews = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      const res = await api.getNews({
        search: searchQuery,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        region: selectedRegion === 'all' ? undefined : selectedRegion,
        page: pageNum,
        limit: 9,
      });

      if (append) {
        setArticles((prev) => [...prev, ...res.articles]);
      } else {
        setArticles(res.articles);
      }
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
      setPage(res.page);
      setLastUpdated(res.lastUpdated);
      setIsStale(!!res.isStale);
      setStatus(res.status);
    } catch (err: any) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(1, false);
  }, [selectedCategory, selectedRegion, searchQuery]);

  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      setRefreshFeedback(null);
      const res = await api.refreshNews();
      setRefreshFeedback(`Refreshed! Found ${res.count} articles.`);
      await fetchNews(1, false);
      setTimeout(() => setRefreshFeedback(null), 4000);
    } catch (err: any) {
      setRefreshFeedback('Failed to refresh from external feeds. Using cached verified reports.');
      setTimeout(() => setRefreshFeedback(null), 4000);
    } finally {
      setRefreshing(false);
    }
  };

  // Sort articles locally
  const sortedArticles = [...articles].sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  });

  const formattedUpdate = (() => {
    if (!lastUpdated) return 'Automated 24h update active';
    try {
      const d = new Date(lastUpdated);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return lastUpdated;
    }
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isAuthenticated ? 'Back to Dashboard' : 'Back to Welcome Page'}</span>
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">
              Water Issues & Environmental News
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Verified global & Philippine water reports, policies, and conservation updates
            </p>
          </div>
        </div>

        {/* Auth action if unauthenticated */}
        {!isAuthenticated && onOpenAuth && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Log In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs shadow-md shadow-cyan-500/20"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>

      {/* Daily Update Status & Stale Content Warning */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Daily Automatic Sync:
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active (Runs every 24h independently)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Last successful update: <strong className="font-semibold text-slate-700 dark:text-slate-300">{formattedUpdate}</strong> • Sources: UN-Water, WHO, UNEP, DENR, EMB, WRI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {refreshFeedback && (
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 animate-fade-in">
              {refreshFeedback}
            </span>
          )}

          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
            title="Trigger an immediate check of external environmental news sources"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-500' : ''}`} />
            <span>{refreshing ? 'Checking Feeds...' : 'Check for Updates'}</span>
          </button>
        </div>
      </div>

      {isStale && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            External feed servers are temporarily unreachable. Displaying verified cached articles. Content will automatically refresh on the next scheduled daily cycle.
          </span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by keyword (e.g., Pasig river, drought, coral reef, microplastics, DENR)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Region Toggle */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] rounded-2xl">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedRegion === 'all'
                  ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Regions
            </button>
            <button
              onClick={() => setSelectedRegion('philippines')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedRegion === 'philippines'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🇵🇭 Philippines Only
            </button>
            <button
              onClick={() => setSelectedRegion('global')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedRegion === 'global'
                  ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Global
            </button>
          </div>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="newest">Newest Published First</option>
            <option value="oldest">Oldest Published First</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                    : 'bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] text-slate-600 dark:text-slate-300 hover:border-cyan-500/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6">
        <span>
          Showing <strong className="text-slate-800 dark:text-slate-200 font-bold">{sortedArticles.length}</strong> of{' '}
          <strong className="text-slate-800 dark:text-slate-200 font-bold">{totalCount}</strong> articles
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Grid of Articles */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-3xl bg-slate-100 dark:bg-slate-800/40 p-6 h-80 animate-pulse flex flex-col justify-between"
            >
              <div className="h-44 bg-slate-200 dark:bg-slate-700/60 rounded-2xl mb-4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded w-full" />
            </div>
          ))}
        </div>
      ) : sortedArticles.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52]">
          <Newspaper className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
            No articles match your query
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search terms or clearing category filters to view all environmental reports.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedRegion('all');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-semibold text-xs shadow-md"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedArticles.map((article, idx) => (
            <NewsCard key={`${article.id}-${idx}`} article={article} />
          ))}
        </div>
      )}

      {/* Load More / Pagination */}
      {!loading && page < totalPages && (
        <div className="mt-12 text-center">
          <button
            onClick={() => fetchNews(page + 1, true)}
            className="px-6 py-3 rounded-2xl bg-white dark:bg-[#102338] border border-slate-300 dark:border-[#263D52] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors shadow-xs"
          >
            Load More Articles (Page {page} of {totalPages})
          </button>
        </div>
      )}
    </div>
  );
};
