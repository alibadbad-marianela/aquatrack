import React, { useState } from 'react';
import { Users, Trophy, ThumbsUp, Shield, Plus, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

interface CommunityViewProps {
  challenges: Array<{ id: string; title: string; description: string; participants: number; category: string; badge: string }>;
  tips: Array<{ id: string; author: string; tip: string; likes: number }>;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ challenges, tips }) => {
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>([]);
  const [userTips, setUserTips] = useState<Array<{ id: string; author: string; tip: string; likes: number }>>(tips);
  const [newTipText, setNewTipText] = useState('');
  const [likedTips, setLikedTips] = useState<string[]>([]);

  const toggleJoin = (id: string) => {
    if (joinedChallenges.includes(id)) {
      setJoinedChallenges((prev) => prev.filter((cId) => cId !== id));
    } else {
      setJoinedChallenges((prev) => [...prev, id]);
    }
  };

  const handleLike = (id: string) => {
    if (likedTips.includes(id)) return;
    setLikedTips((prev) => [...prev, id]);
    setUserTips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, likes: t.likes + 1 } : t))
    );
  };

  const handleAddTip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTipText.trim()) return;

    const newTip = {
      id: crypto.randomUUID(),
      author: 'You (Community Member)',
      tip: newTipText.trim(),
      likes: 1,
    };

    setUserTips((prev) => [newTip, ...prev]);
    setLikedTips((prev) => [...prev, newTip.id]);
    setNewTipText('');
  };

  return (
    <div className="space-y-6">
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
            Join collective conservation challenges and share verified household water-saving tips with consent
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs">
          <Shield className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Privacy Protected: Personal logs never shared</span>
        </div>
      </div>

      {/* Community Challenges */}
      <div>
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Active Collective Challenges
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {challenges.map((ch) => {
            const hasJoined = joinedChallenges.includes(ch.id);

            return (
              <div
                key={ch.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                      {ch.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {ch.participants + (hasJoined ? 1 : 0)} Participants
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 dark:text-white mb-1">
                    {ch.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {ch.description}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => toggleJoin(ch.id)}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      hasJoined
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500 text-emerald-700 dark:text-emerald-300'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm'
                    }`}
                  >
                    {hasJoined ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Participating</span>
                      </>
                    ) : (
                      <span>Join Challenge</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Tips Exchange */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
        <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-500" />
          Community Water-Saving Tips
        </h3>

        {/* Add Tip Form */}
        <form onSubmit={handleAddTip} className="flex gap-2">
          <input
            type="text"
            value={newTipText}
            onChange={(e) => setNewTipText(e.target.value)}
            placeholder="Share a practical water conservation tip you practice at home..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            type="submit"
            disabled={!newTipText.trim()}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Post Tip</span>
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {userTips.map((tip) => (
            <div
              key={tip.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3"
            >
              <div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                  "{tip.tip}"
                </p>
                <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 mt-2 block">
                  — {tip.author}
                </span>
              </div>

              <button
                onClick={() => handleLike(tip.id)}
                className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-colors ${
                  likedTips.includes(tip.id)
                    ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40'
                    : 'text-slate-400 hover:text-cyan-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="font-data font-bold">{tip.likes}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
