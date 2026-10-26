import React, { useState } from 'react';
import { PhilippineLaw } from '../../types';
import {
  Scale,
  Search,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  Filter,
  ShieldCheck
} from 'lucide-react';

interface EnvironmentalLawsProps {
  laws: PhilippineLaw[];
  bookmarkedLawIds: string[];
  onToggleBookmark: (lawId: string) => void;
}

export const EnvironmentalLaws: React.FC<EnvironmentalLawsProps> = ({
  laws,
  bookmarkedLawIds,
  onToggleBookmark,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [activeQuizQuestionIndex, setActiveQuizQuestionIndex] = useState<number | null>(null);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<number | null>(null);

  // Filter
  const filteredLaws = laws.filter((law) => {
    const matchesTopic = selectedTopic === 'all' || law.topic.toLowerCase().includes(selectedTopic.toLowerCase());
    const matchesSearch =
      !searchTerm ||
      law.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      law.waterRelevance.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  const topics = Array.from(new Set(laws.map((l) => l.topic)));

  const LEGAL_QUIZ = [
    {
      question: 'Under Republic Act No. 9275 (Clean Water Act), what primary tool is mandated for all commercial and industrial facilities before discharging wastewater into rivers or coastal bodies?',
      options: [
        'A Verbal Agreement with the Barangay Captain',
        'A Wastewater Discharge Permit issued by the DENR-EMB',
        'An Automatic Property Tax Exemption',
        'A Simple Water Bill Receipt',
      ],
      correctIndex: 1,
      explanation: 'RA 9275 requires mandatory Wastewater Discharge Permits granted by the DENR-EMB to strictly monitor effluent standards and protect receiving water bodies.',
    },
    {
      question: 'Which historical statutory instrument codifies that all natural waters belong to the State and is designated as a Presidential Decree rather than a Republic Act?',
      options: [
        'Republic Act No. 9003',
        'Presidential Decree No. 1067 (Water Code of the Philippines)',
        'Republic Act No. 8749',
        'Executive Order No. 292',
      ],
      correctIndex: 1,
      explanation: 'PD 1067 was enacted in 1976 as a Presidential Decree consolidating water rights, water appropriation permits, and riverbank easements.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Scale className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Philippine Environmental Laws
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Authoritative, verified legal frameworks governing water conservation, solid waste, and watershed protection
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Verified against Official Gazette & DENR</span>
        </div>
      </div>

      {/* Legal Disclaimer Box */}
      <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-[#0c1a2c] border border-blue-200 dark:border-blue-900/50 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 dark:text-white block mb-0.5">Educational Legal Disclaimer:</strong>
          These summaries and analyses are curated for civic education and environmental awareness. They do not constitute formal legal counsel. For statutory proceedings, consult official gazetted texts and accredited legal practitioners.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search laws (e.g. RA 9275, Clean Water, Water Code, solid waste)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Environmental Domains</option>
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Law Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredLaws.map((law) => {
          const isBookmarked = bookmarkedLawIds.includes(law.id);

          return (
            <div
              key={law.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm">
                      {law.number} ({law.year})
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {law.instrumentType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleBookmark(law.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isBookmarked
                          ? 'bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark law'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <a
                      href={law.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>Official Gazette</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-1">
                  {law.commonName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-4">
                  "{law.officialTitle}"
                </p>

                {/* Plain language summary */}
                <div className="mb-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0c1a2c] p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
                  <p className="mb-2"><strong>Overview:</strong> {law.summary}</p>
                  <p className="text-cyan-800 dark:text-cyan-300">
                    <strong>Water & Environmental Relevance:</strong> {law.waterRelevance}
                  </p>
                </div>

                {/* Key Provisions */}
                <div className="mb-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                    Key Statutory Provisions
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    {law.keyProvisions.map((prov, idx) => (
                      <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50/60 dark:bg-slate-800/40">
                        <span className="text-cyan-500 font-bold shrink-0">•</span>
                        <span>{prov}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Agencies & last reviewed */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                <div>
                  <strong>Responsible Agencies:</strong> {law.responsibleAgencies.join(', ')}
                </div>
                <span>Last verified: {law.lastReviewedDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mini Legal Knowledge Check */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-500/30">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Philippine Environmental Law Check
          </h3>
        </div>

        {LEGAL_QUIZ.map((quiz, qIdx) => (
          <div key={qIdx} className="mb-4 p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-slate-800">
            <p className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white mb-3">
              {qIdx + 1}. {quiz.question}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quiz.options.map((opt, oIdx) => {
                const isSelected = activeQuizQuestionIndex === qIdx && quizAnswerSelected === oIdx;
                const isCorrect = oIdx === quiz.correctIndex;
                const showValidation = activeQuizQuestionIndex === qIdx && quizAnswerSelected !== null;

                return (
                  <button
                    key={oIdx}
                    onClick={() => {
                      setActiveQuizQuestionIndex(qIdx);
                      setQuizAnswerSelected(oIdx);
                    }}
                    className={`p-2.5 rounded-xl text-left text-xs transition-all border ${
                      showValidation
                        ? isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                          : isSelected
                          ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-600 dark:text-red-400'
                          : 'border-slate-200 dark:border-slate-800 opacity-60'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {activeQuizQuestionIndex === qIdx && quizAnswerSelected !== null && (
              <p className="mt-3 text-xs text-cyan-700 dark:text-cyan-300 bg-cyan-50/60 dark:bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-500/20">
                <strong>Explanation:</strong> {quiz.explanation}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
