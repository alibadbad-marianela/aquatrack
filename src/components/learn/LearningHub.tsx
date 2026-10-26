import React, { useState } from 'react';
import { Lesson } from '../../types';
import { FEATURE_GUIDES, FeatureGuide } from '../../lib/featureGuides';
import {
  BookOpen,
  Search,
  CheckCircle,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  GraduationCap
} from 'lucide-react';

interface LearningHubProps {
  lessons: Lesson[];
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  onCompleteLesson: (lessonId: string, score: number) => void;
  onToggleBookmark: (lessonId: string) => void;
}

export const LearningHub: React.FC<LearningHubProps> = ({
  lessons,
  completedLessonIds,
  bookmarkedLessonIds,
  onCompleteLesson,
  onToggleBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'lessons' | 'guides'>('lessons');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<FeatureGuide | null>(null);

  // Lesson Quiz State
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const filteredLessons = lessons.filter(
    (l) =>
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredGuides = FEATURE_GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLessonQuizSubmit = () => {
    if (quizSelectedOption === null || !selectedLesson) return;
    setQuizSubmitted(true);
    const isCorrect = quizSelectedOption === selectedLesson.quizQuestion.correctIndex;
    onCompleteLesson(selectedLesson.id, isCorrect ? 100 : 50);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Environmental Learning Hub
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Structured lessons on watersheds and water efficiency, plus complete user guides for every AquaTrack feature
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-[#102338] border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('lessons');
              setSelectedLesson(null);
              setSelectedGuide(null);
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'lessons'
                ? 'bg-white dark:bg-[#0c1a2c] text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Curriculum Lessons ({completedLessonIds.length}/{lessons.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('guides');
              setSelectedLesson(null);
              setSelectedGuide(null);
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'guides'
                ? 'bg-white dark:bg-[#0c1a2c] text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Feature Guides ({FEATURE_GUIDES.length})
          </button>
        </div>
      </div>

      {/* Search Input */}
      {!selectedLesson && !selectedGuide && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === 'lessons'
                ? 'Search lessons (e.g. leaks, watersheds, rainwater, coral reefs)...'
                : 'Search feature guides (e.g. record, edit, analytics, goals, AI)...'
            }
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102338] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-sm"
          />
        </div>
      )}

      {/* LESSON DETAILS VIEW */}
      {selectedLesson && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-6">
          <button
            onClick={() => {
              setSelectedLesson(null);
              setQuizSelectedOption(null);
              setQuizSubmitted(false);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Lessons
          </button>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                {selectedLesson.category}
              </span>
              <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
                {selectedLesson.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleBookmark(selectedLesson.id)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-cyan-500 transition-colors"
                title="Bookmark lesson"
              >
                {bookmarkedLessonIds.includes(selectedLesson.id) ? (
                  <BookmarkCheck className="w-4 h-4 text-cyan-500" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {selectedLesson.readTimeMinutes} min read
              </span>
            </div>
          </div>

          <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-line border-t border-b border-slate-100 dark:border-slate-800 py-6">
            {selectedLesson.content}
          </div>

          {/* Practical Tips Box */}
          <div className="p-5 rounded-2xl bg-cyan-50/60 dark:bg-[#0c1a2c] border border-cyan-500/20">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              Practical Action Checklist
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              {selectedLesson.practicalTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mini Comprehension Quiz */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              Lesson Knowledge Check
            </h4>
            <p className="text-xs text-slate-500 mb-4">{selectedLesson.quizQuestion.question}</p>

            <div className="space-y-2 mb-4">
              {selectedLesson.quizQuestion.options.map((opt, oIdx) => {
                const isSelected = quizSelectedOption === oIdx;
                const isCorrect = oIdx === selectedLesson.quizQuestion.correctIndex;

                let btnStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102338] text-slate-800 dark:text-slate-200';
                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 font-semibold ring-1 ring-cyan-500';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => !quizSubmitted && setQuizSelectedOption(oIdx)}
                    className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleLessonQuizSubmit}
                disabled={quizSelectedOption === null}
                className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-semibold text-xs hover:bg-cyan-700 disabled:opacity-50"
              >
                Submit Answer & Complete Lesson
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-900 dark:text-cyan-300">
                <strong>Explanation:</strong> {selectedLesson.quizQuestion.explanation}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FEATURE GUIDE DETAILS VIEW */}
      {selectedGuide && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-6">
          <button
            onClick={() => setSelectedGuide(null)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Guides
          </button>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
              {selectedGuide.category}
            </span>
            <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
              {selectedGuide.title}
            </h3>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Step-by-Step Instructions</h4>
            {selectedGuide.steps.map((st, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/60 dark:border-slate-800">
                <span className="w-6 h-6 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{st}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-300">
            <strong>Pro Tip:</strong> {selectedGuide.tips}
          </div>
        </div>
      )}

      {/* LESSONS GRID */}
      {activeTab === 'lessons' && !selectedLesson && !selectedGuide && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const isBookmarked = bookmarkedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className="p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm hover:border-cyan-500/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                      {lesson.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isCompleted && (
                        <span title="Completed lesson">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </span>
                      )}
                      {isBookmarked && (
                        <span title="Bookmarked">
                          <BookmarkCheck className="w-4 h-4 text-cyan-500" />
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {lesson.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {lesson.readTimeMinutes} min
                  </span>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                    Read Lesson
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* GUIDES GRID */}
      {activeTab === 'guides' && !selectedLesson && !selectedGuide && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm hover:border-cyan-500/40 transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {guide.category}
                </span>
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mt-0.5">
                  {guide.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{guide.tips}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
