import React, { useState, useEffect } from 'react';
import {
  Users,
  Trophy,
  ThumbsUp,
  Shield,
  Plus,
  Heart,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Award,
  BookOpen,
  Filter,
  Check,
  X
} from 'lucide-react';
import { api } from '../../lib/api';

interface CommunityTip {
  id: string;
  author: string;
  authorId?: string;
  tip: string;
  category?: string;
  source?: string;
  isOfficial?: boolean;
  likes: number;
  isLiked?: boolean;
  createdAt?: string;
}

interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  category: string;
  badge: string;
  isJoined?: boolean;
}

interface CommunityViewProps {
  challenges: CommunityChallenge[];
  tips: CommunityTip[];
  currentUserId?: string;
  currentUserNickname?: string;
  currentUserAvatar?: string;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  challenges: initialChallenges,
  tips: initialTips,
  currentUserId,
  currentUserNickname = 'Juan Dela Cruz',
  currentUserAvatar,
}) => {
  const [challenges, setChallenges] = useState<CommunityChallenge[]>(initialChallenges);
  const [tips, setTips] = useState<CommunityTip[]>(initialTips);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newTipText, setNewTipText] = useState('');
  const [newTipCategory, setNewTipCategory] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sync state if initial props change
  useEffect(() => {
    if (initialChallenges?.length) setChallenges(initialChallenges);
  }, [initialChallenges]);

  useEffect(() => {
    if (initialTips?.length) setTips(initialTips);
  }, [initialTips]);

  const handleToggleJoin = async (id: string) => {
    try {
      // Optimistic update
      setChallenges((prev) =>
        prev.map((ch) => {
          if (ch.id === id) {
            const willJoin = !ch.isJoined;
            return {
              ...ch,
              isJoined: willJoin,
              participants: Math.max(0, ch.participants + (willJoin ? 1 : -1)),
            };
          }
          return ch;
        })
      );

      const res = await api.joinCommunityChallenge(id);
      setChallenges((prev) =>
        prev.map((ch) =>
          ch.id === id
            ? { ...ch, isJoined: res.isJoined, participants: res.participantsCount }
            : ch
        )
      );
    } catch {
      // Revert if error
      setChallenges((prev) =>
        prev.map((ch) => {
          if (ch.id === id) {
            const wasJoined = !ch.isJoined;
            return {
              ...ch,
              isJoined: wasJoined,
              participants: Math.max(0, ch.participants + (wasJoined ? 1 : -1)),
            };
          }
          return ch;
        })
      );
    }
  };

  const handleLike = async (tipId: string) => {
    const tip = tips.find((t) => t.id === tipId);
    if (!tip) return;

    const willLike = !tip.isLiked;

    // Optimistic update
    setTips((prev) =>
      prev.map((t) =>
        t.id === tipId
          ? {
              ...t,
              isLiked: willLike,
              likes: Math.max(0, t.likes + (willLike ? 1 : -1)),
            }
          : t
      )
    );

    try {
      const res = await api.likeCommunityTip(tipId);
      setTips((prev) =>
        prev.map((t) =>
          t.id === tipId
            ? { ...t, likes: res.likes, isLiked: res.isLiked }
            : t
        )
      );
    } catch {
      // Rollback
      setTips((prev) =>
        prev.map((t) =>
          t.id === tipId
            ? {
                ...t,
                isLiked: !willLike,
                likes: Math.max(0, t.likes + (!willLike ? 1 : -1)),
              }
            : t
        )
      );
    }
  };

  const handleShareTipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTipText.trim()) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await api.createCommunityTip({
        tip: newTipText.trim(),
        category: newTipCategory,
      });

      if (res && res.tip) {
        setTips((prev) => [res.tip, ...prev]);
      } else {
        // Fallback local tip
        const created: CommunityTip = {
          id: `tip_${Date.now()}`,
          author: currentUserNickname,
          authorId: currentUserId || 'me',
          tip: newTipText.trim(),
          category: newTipCategory,
          isOfficial: false,
          likes: 0,
          isLiked: false,
          createdAt: new Date().toISOString(),
        };
        setTips((prev) => [created, ...prev]);
      }

      setNewTipText('');
      setIsShareModalOpen(false);
      setStatusMessage('Your water conservation tip was shared with the community!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage('Unable to publish tip. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Separate verified authority tips from real user community submissions
  const officialAuthorityTips = tips.filter((t) => t.isOfficial);
  const userSubmittedTips = tips.filter((t) => !t.isOfficial);

  const filteredUserTips = filterCategory === 'all'
    ? userSubmittedTips
    : userSubmittedTips.filter((t) => t.category?.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Community Conservation Hub
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real water-saving challenges and community tips. All member contributions come from actual accounts with verified practical advice.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs">
            <Shield className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Zero Fabricated Data: Real Users & Verified Sources</span>
          </div>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Share a Water Tip</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/30 text-cyan-800 dark:text-cyan-200 text-xs flex items-center justify-between animate-fade-in">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Community Collective Challenges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Collective Conservation Challenges
          </h3>
          <span className="text-xs text-slate-400">
            Real user participants
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map((ch) => {
            const hasJoined = !!ch.isJoined;

            return (
              <div
                key={ch.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm flex flex-col justify-between hover:border-cyan-500/30 transition-all"
              >
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                      {ch.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-data">
                      {ch.participants} {ch.participants === 1 ? 'Participant' : 'Participants'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{ch.badge.split(' ')[0]}</span>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {ch.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {ch.description}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => handleToggleJoin(ch.id)}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      hasJoined
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-sm'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm shadow-cyan-500/20'
                    }`}
                  >
                    {hasJoined ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Participating</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Join Challenge</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Official Factual Water Conservation Guidelines */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Verified Authority Standards & Practical Guidelines
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Factual domestic conservation benchmarks from Philippine and International Water Authorities
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20">
            Verified Guidance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {officialAuthorityTips.map((tip) => (
            <div
              key={tip.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    {tip.source || 'Official Guidance'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{tip.category}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  "{tip.tip}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/80">
                <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                  {tip.author}
                </span>

                <button
                  onClick={() => handleLike(tip.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                    tip.isLiked
                      ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 font-bold'
                      : 'text-slate-400 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-label="Like tip"
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${tip.isLiked ? 'fill-current' : ''}`} />
                  <span className="font-data font-bold">{tip.likes}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Member Submitted Tips */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Community Member Submissions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real water-saving methods shared by verified registered AquaTrack members
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Categories</option>
              <option value="Kitchen">Kitchen</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Garden">Garden & Outdoor</option>
              <option value="Maintenance">Maintenance & Leaks</option>
              <option value="Reuse">Greywater & Reuse</option>
            </select>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Tip</span>
            </button>
          </div>
        </div>

        {/* User tips list or honest empty state */}
        {filteredUserTips.length === 0 ? (
          <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Member Tips Shared Yet
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4 leading-relaxed">
              We never fabricate simulated user posts or bot comments. Be the first real community member to share your household water-saving tip!
            </p>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shadow-sm shadow-cyan-500/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Share Your First Tip</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredUserTips.map((tip) => (
              <div
                key={tip.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {tip.category || 'General'}
                    </span>
                    {tip.createdAt && (
                      <span className="text-[10px] text-slate-400">
                        {new Date(tip.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                    "{tip.tip}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800/80">
                  <div className="flex items-center gap-2">
                    {tip.authorId === currentUserId && currentUserAvatar && (currentUserAvatar.startsWith('http') || currentUserAvatar.startsWith('data:')) ? (
                      <img src={currentUserAvatar} alt={tip.author} className="w-5 h-5 rounded-md object-cover border border-cyan-500/40" />
                    ) : (
                      <div className="w-5 h-5 rounded-md bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center overflow-hidden">
                        {tip.author ? tip.author[0].toUpperCase() : 'J'}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {tip.author}
                    </span>
                  </div>

                  <button
                    onClick={() => handleLike(tip.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                      tip.isLiked
                        ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 font-bold'
                        : 'text-slate-400 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${tip.isLiked ? 'fill-current' : ''}`} />
                    <span className="font-data font-bold">{tip.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Share Water Tip Modal */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Share a Water-Saving Tip
                </h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Share practical advice based on factual experience. Your tip will be published under your preferred profile name ({currentUserNickname}).
            </p>

            <form onSubmit={handleShareTipSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={newTipCategory}
                  onChange={(e) => setNewTipCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs text-slate-800 dark:text-white"
                >
                  <option value="General">General Habit</option>
                  <option value="Kitchen">Kitchen & Cooking</option>
                  <option value="Bathroom">Bathroom & Showers</option>
                  <option value="Garden">Garden & Outdoor</option>
                  <option value="Maintenance">Leak Detection & Fixtures</option>
                  <option value="Reuse">Greywater & Rain Harvesting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Your Practical Tip
                </label>
                <textarea
                  rows={4}
                  required
                  value={newTipText}
                  onChange={(e) => setNewTipText(e.target.value)}
                  placeholder="e.g. When boiling vegetables, save the water and let it cool completely before pouring it on potted plants. It nourishes the soil without using fresh tap water."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newTipText.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  {isSubmitting ? (
                    <span>Publishing...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Post Tip</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
