import React from 'react';
import { CREATOR_PROFILE } from '../lib/creatorInfo';
import {
  GraduationCap,
  Award,
  BookOpen,
  Mail,
  Phone,
  HeartHandshake,
  Sparkles,
  X,
  ExternalLink
} from 'lucide-react';

interface CreatorCardProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ onClose, isModal = false }) => {
  const content = (
    <div className="bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] rounded-3xl p-6 md:p-8 shadow-xl max-w-2xl w-full relative overflow-hidden transition-colors">
      {/* Background aquatic ambient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-gradient-to-br from-cyan-400/20 via-blue-500/15 to-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close creator details"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Heading */}
      <div className="flex items-center gap-3.5 mb-6">
        <div className="p-3 bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 rounded-2xl text-white shadow-md shadow-cyan-500/25">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Project Creator Profile
          </span>
          <h2 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white">
            About the Creator
          </h2>
        </div>
      </div>

      {/* Primary Details Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-cyan-50/40 dark:from-[#0c1a2c] dark:to-[#0f243a] border border-cyan-100 dark:border-cyan-900/40 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
              Creator & Lead Developer
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-500 shrink-0" />
              <span>{CREATOR_PROFILE.name}</span>
            </h3>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs sm:text-sm font-bold border border-cyan-500/30 w-fit">
            <GraduationCap className="w-4 h-4 text-cyan-500" />
            <span>{CREATOR_PROFILE.academicInfo}</span>
          </div>
        </div>
      </div>

      {/* Grid: School, Academic Information & Direct Contact Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Institution / School</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
            {CREATOR_PROFILE.school}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Academic Information</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {CREATOR_PROFILE.academicInfo}
          </p>
        </div>

        {/* Clickable Email Address */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800 hover:border-cyan-400/50 transition-colors">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-cyan-500" />
            <span>Email Address</span>
          </p>
          <a
            href={`mailto:${CREATOR_PROFILE.email}`}
            className="text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1.5 break-all"
            title="Send an email to Marian Ela J. Alibadbad"
          >
            <span>{CREATOR_PROFILE.email}</span>
            <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
          </a>
        </div>

        {/* Clickable Contact Number */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800 hover:border-cyan-400/50 transition-colors">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-emerald-500" />
            <span>Contact Number</span>
          </p>
          <a
            href={`tel:${CREATOR_PROFILE.contactNumber}`}
            className="text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5"
            title="Call Marian Ela J. Alibadbad"
          >
            <span>{CREATOR_PROFILE.contactNumber}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
              PH Mobile
            </span>
          </a>
        </div>
      </div>

      {/* Project Motivation Statement */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-teal-500/10 border border-cyan-500/20 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
        <p className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-cyan-500" />
          <span>Project Motivation & Vision</span>
        </p>
        <p>{CREATOR_PROFILE.motivation}</p>
      </div>

      {/* Bottom info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span>AquaTrack — Track Every Drop. Protect Every Tomorrow.</span>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-md transition-all text-xs"
          >
            Close Profile
          </button>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        {content}
      </div>
    );
  }

  return content;
};
