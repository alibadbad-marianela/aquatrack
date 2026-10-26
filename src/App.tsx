import React, { useState, useEffect } from 'react';
import { api, setAuthToken, getAuthToken } from './lib/api';
import { UserProfile, WaterRecord, Goal, Reminder, GameScore, PhilippineLaw, Lesson, WaterUnit } from './types';
import { offlineSync } from './lib/offlineSync';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { LandingPage } from './components/LandingPage';
import { AuthPages } from './components/auth/AuthPages';
import { DashboardView } from './components/dashboard/DashboardView';
import { CalendarView } from './components/calendar/CalendarView';
import { RecordList } from './components/tracking/RecordList';
import { RecordModal } from './components/tracking/RecordModal';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { GamesHub } from './components/games/GamesHub';
import { LearningHub } from './components/learn/LearningHub';
import { EnvironmentalLaws } from './components/laws/EnvironmentalLaws';
import { GoalsView } from './components/goals/GoalsView';
import { CommunityView } from './components/community/CommunityView';
import { SettingsView } from './components/settings/SettingsView';
import { AIAssistant } from './components/ai/AIAssistant';
import { CreatorCard } from './components/CreatorCard';
import { OnboardingModal } from './components/OnboardingModal';
import { PHILIPPINE_LAWS } from './lib/philippineLaws';
import { LESSONS } from './lib/learningContent';
import { WaterNewsView } from './components/news/WaterNewsView';
import { AquaLogo } from './components/AquaLogo';
import { ArrowLeft, GraduationCap } from 'lucide-react';

export default function App() {
  // Theme state: light, dark, system
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('aquatrack_theme') as any) || 'system';
  });

  // Apply theme to document
  useEffect(() => {
    localStorage.setItem('aquatrack_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Auth & User State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  // Active View Navigation
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Modals
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WaterRecord | null>(null);
  const [modalInitialDate, setModalInitialDate] = useState<string | undefined>(undefined);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // App Data State
  const [records, setRecords] = useState<WaterRecord[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [gameScores, setGameScores] = useState<GameScore[]>([]);
  const [achievements, setAchievements] = useState<Array<{ achievementId: string; unlockedAt: string }>>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [bookmarkedLessonIds, setBookmarkedLessonIds] = useState<string[]>([]);
  const [bookmarkedLawIds, setBookmarkedLawIds] = useState<string[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [communityChallenges, setCommunityChallenges] = useState<any[]>([]);
  const [communityTips, setCommunityTips] = useState<any[]>([]);

  // Connectivity & Offline Queue
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(() => offlineSync.getPendingQueue().length);

  // Check current session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setAuthChecking(false);
        return;
      }

      try {
        const { user: profile } = await api.getMe();
        setUser(profile);
        if (profile.theme) setTheme(profile.theme);
        if (!profile.onboardingCompleted) {
          setShowOnboarding(true);
        }
      } catch (err) {
        setAuthToken(null);
        setUser(null);
      } finally {
        setAuthChecking(false);
      }
    };

    initAuth();
  }, []);

  // Network listener & sync
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      const res = await offlineSync.syncPending();
      if (res.syncedCount > 0) {
        setPendingSyncCount(0);
        refreshUserData();
      }
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Fetch all user records & app data once logged in
  const refreshUserData = async () => {
    if (!user) return;

    try {
      const [
        recRes,
        goalRes,
        remRes,
        scoreRes,
        achRes,
        progRes,
        anaRes,
        commRes,
      ] = await Promise.all([
        api.getRecords(),
        api.getGoals(),
        api.getReminders(),
        api.getGameScores(),
        api.getAchievements(),
        api.getLearningProgress(),
        api.getAnalytics(),
        api.getCommunity(),
      ]);

      setRecords(recRes.records);
      setGoals(goalRes.goals);
      setReminders(remRes.reminders);
      setGameScores(scoreRes.scores);
      setAchievements(achRes.unlocked);
      setAnalyticsData(anaRes);
      setCommunityChallenges(commRes.challenges);
      setCommunityTips(commRes.tips);

      const compLessons = progRes.progress.filter((p: any) => p.completed).map((p: any) => p.lessonId);
      setCompletedLessonIds(compLessons);

      const bmLessons = progRes.bookmarks.filter((b: any) => b.itemType === 'lesson').map((b: any) => b.itemId);
      setBookmarkedLessonIds(bmLessons);

      const bmLaws = progRes.bookmarks.filter((b: any) => b.itemType === 'law').map((b: any) => b.itemId);
      setBookmarkedLawIds(bmLaws);
    } catch (err) {
      console.error('Error fetching user data', err);
    }
  };

  useEffect(() => {
    if (user) {
      refreshUserData();
    }
  }, [user]);

  // Auth Handlers
  const handleLogin = async (data: { email: string; password: string }) => {
    const res = await api.login(data);
    setAuthToken(res.token);
    setUser(res.user);
    setShowAuthModal(false);
    if (!res.user.onboardingCompleted) {
      setShowOnboarding(true);
    }
  };

  const handleRegister = async (data: { email: string; password: string; confirmPassword: string; nickname: string }) => {
    const res = await api.register(data);
    setAuthToken(res.token);
    setUser(res.user);
    setShowAuthModal(false);
    setShowOnboarding(true);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    setAuthToken(null);
    setUser(null);
    setRecords([]);
    setCurrentView('dashboard');
  };

  // Water Records CRUD Handlers
  const handleSaveRecord = async (recordData: any) => {
    if (!isOnline) {
      // Enqueue offline
      offlineSync.enqueue(recordData);
      setPendingSyncCount((prev) => prev + 1);
      setShowRecordModal(false);
      setEditingRecord(null);
      return;
    }

    if (editingRecord) {
      await api.updateRecord(editingRecord.id, recordData);
    } else {
      await api.createRecord(recordData);
    }

    setShowRecordModal(false);
    setEditingRecord(null);
    await refreshUserData();
  };

  const handleDeleteRecord = async (id: string) => {
    await api.deleteRecord(id);
    await refreshUserData();
  };

  // Goals CRUD
  const handleCreateGoal = async (data: any) => {
    await api.createGoal(data);
    await refreshUserData();
  };

  const handleDeleteGoal = async (id: string) => {
    await api.deleteGoal(id);
    await refreshUserData();
  };

  // Reminders CRUD
  const handleCreateReminder = async (data: any) => {
    await api.createReminder(data);
    await refreshUserData();
  };

  const handleToggleReminder = async (id: string, enabled: boolean) => {
    await api.updateReminder(id, { enabled });
    await refreshUserData();
  };

  const handleDeleteReminder = async (id: string) => {
    await api.deleteReminder(id);
    await refreshUserData();
  };

  // Games Score Handler
  const handleSaveGameScore = async (gameId: string, score: number, stars: number) => {
    await api.saveGameScore(gameId, score, stars);
    await refreshUserData();
  };

  // Learning Hub & Laws
  const handleCompleteLesson = async (lessonId: string, score: number) => {
    await api.saveLessonProgress(lessonId, score);
    await refreshUserData();
  };

  const handleToggleBookmark = async (itemType: string, itemId: string) => {
    await api.toggleBookmark(itemType, itemId);
    await refreshUserData();
  };

  // Profile Updates
  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    const res = await api.updateProfile(updates);
    setUser(res.user);
  };

  const handleOnboardingComplete = async (prefs: { nickname: string; preferredUnit: WaterUnit; dailyGoalLiters: number }) => {
    setShowOnboarding(false);
    await handleUpdateProfile({
      nickname: prefs.nickname,
      preferredUnit: prefs.preferredUnit,
      onboardingCompleted: true,
    });
    if (prefs.dailyGoalLiters > 0) {
      await api.createGoal({
        title: 'Daily Water Consumption Ceiling',
        targetLiters: prefs.dailyGoalLiters,
        period: 'daily',
        category: 'all',
      });
      await refreshUserData();
    }
  };

  const handleManualSync = async () => {
    const res = await offlineSync.syncPending();
    if (res.syncedCount > 0) {
      setPendingSyncCount(0);
      await refreshUserData();
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7FB] dark:bg-[#081522]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Loading AquaTrack...</p>
        </div>
      </div>
    );
  }

  // Not authenticated: Show Landing Page or Public Water News View
  if (!user) {
    if (currentView === 'news') {
      return (
        <div className="min-h-screen flex flex-col bg-[#F4F7FB] dark:bg-[#081522] text-[#172B4D] dark:text-[#F1F7FF] transition-colors pb-12">
          {/* Public Header */}
          <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#081522]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="hover:opacity-95 transition-opacity"
                aria-label="Back to Welcome Page"
              >
                <AquaLogo size="md" withWordmark={true} withTagline={true} />
              </button>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setShowCreatorModal(true)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 rounded-xl transition-colors hidden sm:inline-flex items-center gap-1.5"
                >
                  <GraduationCap className="w-4 h-4 text-cyan-500" />
                  <span>About Creator</span>
                </button>

                <button
                  onClick={() => {
                    setAuthInitialMode('login');
                    setShowAuthModal(true);
                  }}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Log In
                </button>

                <button
                  onClick={() => {
                    setAuthInitialMode('register');
                    setShowAuthModal(true);
                  }}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all"
                >
                  Get Started
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <WaterNewsView
              onBack={() => setCurrentView('dashboard')}
              isAuthenticated={false}
              onOpenAuth={(mode) => {
                setAuthInitialMode(mode);
                setShowAuthModal(true);
              }}
            />
          </main>

          {showAuthModal && (
            <AuthPages
              initialMode={authInitialMode}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onForgotPassword={async (em) => api.forgotPassword(em)}
              onResetPassword={async (tok, pw) => {
                await api.resetPassword(tok, pw);
              }}
              onClose={() => setShowAuthModal(false)}
            />
          )}

          {showCreatorModal && (
            <CreatorCard isModal={true} onClose={() => setShowCreatorModal(false)} />
          )}
        </div>
      );
    }

    return (
      <>
        <LandingPage
          onOpenLogin={() => {
            setAuthInitialMode('login');
            setShowAuthModal(true);
          }}
          onOpenRegister={() => {
            setAuthInitialMode('register');
            setShowAuthModal(true);
          }}
          onOpenCreator={() => setShowCreatorModal(true)}
          onOpenNews={() => setCurrentView('news')}
        />

        {showAuthModal && (
          <AuthPages
            initialMode={authInitialMode}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onForgotPassword={async (em) => api.forgotPassword(em)}
            onResetPassword={async (tok, pw) => {
              await api.resetPassword(tok, pw);
            }}
            onClose={() => setShowAuthModal(false)}
          />
        )}

        {showCreatorModal && (
          <CreatorCard isModal={true} onClose={() => setShowCreatorModal(false)} />
        )}
      </>
    );
  }

  // Authenticated Application Shell
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] dark:bg-[#081522] text-[#172B4D] dark:text-[#F1F7FF] transition-colors pb-28 md:pb-12">
      {/* Top Navbar */}
      <Navbar
        user={user}
        currentView={currentView}
        currentTheme={theme}
        isOnline={isOnline}
        pendingSyncCount={pendingSyncCount}
        onThemeToggle={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        onOpenRecordModal={() => {
          setEditingRecord(null);
          setShowRecordModal(true);
        }}
        onOpenAIAssistant={() => setShowAIAssistant(true)}
        onOpenCreator={() => setShowCreatorModal(true)}
        onNavigate={(v) => setCurrentView(v)}
        onLogout={handleLogout}
        onManualSync={handleManualSync}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full animate-fade-in">
        {currentView === 'dashboard' && (
          <DashboardView
            user={user}
            records={records}
            goals={goals}
            analyticsData={analyticsData}
            currentStreak={analyticsData?.currentStreak || 0}
            onOpenRecordModal={() => {
              setEditingRecord(null);
              setModalInitialDate(undefined);
              setShowRecordModal(true);
            }}
            onNavigate={(v) => setCurrentView(v)}
            onOpenAIAssistant={() => setShowAIAssistant(true)}
          />
        )}

        {currentView === 'calendar' && (
          <CalendarView
            records={records}
            user={user}
            goals={goals}
            preferredUnit={user.preferredUnit}
            onAddNewForDate={(dStr) => {
              setEditingRecord(null);
              setModalInitialDate(dStr);
              setShowRecordModal(true);
            }}
            onEditRecord={(rec) => {
              setEditingRecord(rec);
              setModalInitialDate(undefined);
              setShowRecordModal(true);
            }}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {currentView === 'history' && (
          <RecordList
            records={records}
            preferredUnit={user.preferredUnit}
            onAddNew={() => {
              setEditingRecord(null);
              setShowRecordModal(true);
            }}
            onEdit={(rec) => {
              setEditingRecord(rec);
              setShowRecordModal(true);
            }}
            onDelete={handleDeleteRecord}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView
            records={records}
            analyticsData={analyticsData}
            preferredUnit={user.preferredUnit}
          />
        )}

        {currentView === 'games' && (
          <GamesHub
            scores={gameScores}
            onSaveScore={handleSaveGameScore}
          />
        )}

        {currentView === 'learn' && (
          <LearningHub
            lessons={LESSONS}
            completedLessonIds={completedLessonIds}
            bookmarkedLessonIds={bookmarkedLessonIds}
            onCompleteLesson={handleCompleteLesson}
            onToggleBookmark={(id) => handleToggleBookmark('lesson', id)}
          />
        )}

        {currentView === 'laws' && (
          <EnvironmentalLaws
            laws={PHILIPPINE_LAWS}
            bookmarkedLawIds={bookmarkedLawIds}
            onToggleBookmark={(id) => handleToggleBookmark('law', id)}
          />
        )}

        {currentView === 'goals' && (
          <GoalsView
            goals={goals}
            reminders={reminders}
            achievements={achievements}
            currentStreak={analyticsData?.currentStreak || 0}
            records={records}
            onCreateGoal={handleCreateGoal}
            onDeleteGoal={handleDeleteGoal}
            onCreateReminder={handleCreateReminder}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}

        {currentView === 'community' && (
          <CommunityView
            challenges={communityChallenges}
            tips={communityTips}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            profile={user}
            currentTheme={theme}
            onUpdateProfile={handleUpdateProfile}
            onThemeChange={(th) => setTheme(th)}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'news' && (
          <WaterNewsView
            onBack={() => setCurrentView('dashboard')}
            isAuthenticated={true}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation for Mobile */}
      <BottomNav currentView={currentView} onNavigate={(v) => setCurrentView(v)} />

      {/* Modals & Drawers */}
      {showRecordModal && (
        <RecordModal
          initialRecord={editingRecord}
          initialDate={modalInitialDate}
          preferredUnit={user.preferredUnit}
          onClose={() => {
            setShowRecordModal(false);
            setEditingRecord(null);
            setModalInitialDate(undefined);
          }}
          onSave={handleSaveRecord}
        />
      )}

      {showAIAssistant && (
        <AIAssistant
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
          userNickname={user.nickname}
        />
      )}

      {showCreatorModal && (
        <CreatorCard isModal={true} onClose={() => setShowCreatorModal(false)} />
      )}

      {showOnboarding && (
        <OnboardingModal
          initialNickname={user.nickname}
          onComplete={handleOnboardingComplete}
          onDismiss={() => {
            setShowOnboarding(false);
            handleUpdateProfile({ onboardingCompleted: true });
          }}
        />
      )}
    </div>
  );
}
