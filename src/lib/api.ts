import { WaterRecord, UserProfile, Goal, Reminder, PhilippineLaw, Lesson, GameScore, NewsFeedResponse, WaterNewsItem } from '../types';
import { BASELINE_VERIFIED_NEWS } from './waterNewsData';
import { convertToLiters, calculateSummaryStats, calculateStreak } from './waterCalculations';

let cachedToken: string | null = null;

export function setAuthToken(token: string | null) {
  cachedToken = token;
  try {
    if (token) {
      localStorage.setItem('aquatrack_token', token);
    } else {
      localStorage.removeItem('aquatrack_token');
    }
  } catch {
    // Graceful fallback if localStorage is restricted
  }
}

export function getAuthToken(): string | null {
  if (!cachedToken) {
    try {
      cachedToken = localStorage.getItem('aquatrack_token');
    } catch {
      cachedToken = null;
    }
  }
  return cachedToken;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errData = await response.json();
      errorMsg = errData.error || errData.message || errorMsg;
    } catch {
      // Body wasn't JSON (e.g. 404 HTML from static server or proxy)
      if (response.status === 404) {
        errorMsg = '404 Not Found';
      }
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

function isNetworkOr404(err: any): boolean {
  if (!err) return false;
  const msg = String(err.message || err);
  return (
    msg.includes('404') ||
    msg.includes('Failed to fetch') ||
    msg.includes('NetworkError') ||
    msg.includes('Load failed') ||
    msg.includes('Network request failed') ||
    msg.includes('Unexpected token') ||
    msg.includes('ECONNREFUSED')
  );
}

// --- LOCAL STORAGE OFFLINE / FALLBACK ENGINE ---
interface StoredAccount {
  user: UserProfile;
  password?: string;
}

function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem('aquatrack_local_accounts');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredAccounts(accounts: StoredAccount[]) {
  try {
    localStorage.setItem('aquatrack_local_accounts', JSON.stringify(accounts));
  } catch {}
}

function saveUserLocally(user: UserProfile, password?: string) {
  const accounts = getStoredAccounts();
  const idx = accounts.findIndex(a => a.user.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) {
    accounts[idx] = { user, password: password || accounts[idx].password };
  } else {
    accounts.push({ user, password });
  }
  saveStoredAccounts(accounts);
  try {
    localStorage.setItem('aquatrack_current_user', JSON.stringify(user));
  } catch {}
}

function getLocalCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem('aquatrack_current_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function createLocalAccount(email: string, password?: string, nickname?: string): { user: UserProfile; token: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanNick = nickname?.trim() || cleanEmail.split('@')[0] || 'Friend';
  const accounts = getStoredAccounts();

  const existing = accounts.find(a => a.user.email.toLowerCase() === cleanEmail);
  if (existing) {
    // If password provided and matches, just log them in
    if (!password || existing.password === password) {
      saveUserLocally(existing.user, existing.password);
      const token = `local_token_${Date.now()}_${existing.user.id}`;
      setAuthToken(token);
      return { user: existing.user, token };
    }
    throw new Error('An account with this email address already exists. Please sign in instead.');
  }

  const now = new Date().toISOString();
  const newUser: UserProfile = {
    id: `local_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    email: cleanEmail,
    displayName: cleanNick,
    nickname: cleanNick,
    preferredLanguage: 'en',
    preferredUnit: 'liters',
    theme: 'system',
    autoRotateGreeting: true,
    greetingRotateIntervalSec: 8,
    onboardingCompleted: true,
    createdAt: now,
  };

  saveUserLocally(newUser, password);
  const token = `local_token_${Date.now()}_${newUser.id}`;
  setAuthToken(token);

  // Initialize starter records and goal for realistic dashboard
  seedLocalUserData(newUser.id);

  return { user: newUser, token };
}

function loginLocalAccount(email: string, password?: string): { user: UserProfile; token: string } {
  const cleanEmail = email.trim().toLowerCase();
  const accounts = getStoredAccounts();
  const existing = accounts.find(a => a.user.email.toLowerCase() === cleanEmail);

  if (existing) {
    if (password && existing.password && existing.password !== password) {
      throw new Error('Invalid email or password');
    }
    saveUserLocally(existing.user, existing.password);
    const token = `local_token_${Date.now()}_${existing.user.id}`;
    setAuthToken(token);
    return { user: existing.user, token };
  }

  // If not found locally, seamlessly create and log in
  return createLocalAccount(cleanEmail, password);
}

function getLocalDemoAccount(): { user: UserProfile; token: string } {
  const demoEmail = 'marian@example.com';
  return loginLocalAccount(demoEmail, 'demo1234');
}

function seedLocalUserData(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const now = new Date().toISOString();

  const starterRecords: WaterRecord[] = [
    {
      id: `rec_1_${userId}`,
      userId,
      activityName: 'Morning Shower',
      category: 'bathing_showering',
      quantity: 35,
      unit: 'liters',
      quantityLiters: 35,
      date: today,
      time: '07:30',
      notes: 'Water-efficient shower head',
      isEstimated: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `rec_2_${userId}`,
      userId,
      activityName: 'Daily Drinking & Hydration',
      category: 'drinking_cooking',
      quantity: 2.5,
      unit: 'liters',
      quantityLiters: 2.5,
      date: today,
      time: '12:00',
      notes: 'Clean drinking water',
      isEstimated: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `rec_3_${userId}`,
      userId,
      activityName: 'Kitchen Dishwashing',
      category: 'dishwashing',
      quantity: 15,
      unit: 'liters',
      quantityLiters: 15,
      date: today,
      time: '13:15',
      notes: 'Basin wash method',
      isEstimated: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: `rec_4_${userId}`,
      userId,
      activityName: 'Laundry Washing Machine',
      category: 'laundry',
      quantity: 45,
      unit: 'liters',
      quantityLiters: 45,
      date: yesterday,
      time: '10:00',
      notes: 'Full eco load',
      isEstimated: false,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const starterGoals: Goal[] = [
    {
      id: `goal_1_${userId}`,
      userId,
      title: 'Daily Water Consumption Ceiling',
      targetLiters: 120,
      period: 'daily',
      category: 'all',
      active: true,
      createdAt: now,
    },
  ];

  try {
    localStorage.setItem(`aquatrack_records_${userId}`, JSON.stringify(starterRecords));
    localStorage.setItem(`aquatrack_goals_${userId}`, JSON.stringify(starterGoals));
  } catch {}
}

function getLocalRecords(): WaterRecord[] {
  const user = getLocalCurrentUser();
  if (!user) return [];
  try {
    const raw = localStorage.getItem(`aquatrack_records_${user.id}`);
    if (raw) return JSON.parse(raw);
    seedLocalUserData(user.id);
    const seeded = localStorage.getItem(`aquatrack_records_${user.id}`);
    return seeded ? JSON.parse(seeded) : [];
  } catch {
    return [];
  }
}

function saveLocalRecords(records: WaterRecord[]) {
  const user = getLocalCurrentUser();
  if (!user) return;
  try {
    localStorage.setItem(`aquatrack_records_${user.id}`, JSON.stringify(records));
  } catch {}
}

function getLocalGoals(): Goal[] {
  const user = getLocalCurrentUser();
  if (!user) return [];
  try {
    const raw = localStorage.getItem(`aquatrack_goals_${user.id}`);
    if (raw) return JSON.parse(raw);
    seedLocalUserData(user.id);
    const seeded = localStorage.getItem(`aquatrack_goals_${user.id}`);
    return seeded ? JSON.parse(seeded) : [];
  } catch {
    return [];
  }
}

function calculateLocalAnalytics() {
  const records = getLocalRecords();
  const summary = calculateSummaryStats(records);
  const streak = calculateStreak(records.map(r => r.date));

  const last7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  const dailyChartData = last7Days.map(date => {
    const dayRecords = records.filter(r => r.date === date);
    const liters = dayRecords.reduce((acc, r) => acc + (r.quantityLiters || r.quantity), 0);
    return { date, liters: Math.round(liters * 10) / 10 };
  });

  const categoryTotals: Record<string, number> = {};
  records.forEach(r => {
    const cat = r.category || 'other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (r.quantityLiters || r.quantity);
  });

  return {
    stats: summary,
    currentStreak: streak,
    dailyChartData,
    categoryTotals,
    measuredVsEstimated: [
      { name: 'Measured', value: records.filter(r => !r.isEstimated).length },
      { name: 'Estimated', value: records.filter(r => r.isEstimated).length },
    ],
  };
}

export const api = {
  // Auth
  register: async (data: { email: string; password: string; confirmPassword?: string; nickname?: string }) => {
    try {
      const res = await apiFetch<{ user: UserProfile; token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      saveUserLocally(res.user, data.password);
      setAuthToken(res.token);
      return res;
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        console.warn('[AquaTrack] Server unreachable / 404, using local registration fallback.');
        const localRes = createLocalAccount(data.email, data.password, data.nickname);
        return localRes;
      }
      throw err;
    }
  },

  login: async (data: { email: string; password: string }) => {
    try {
      const res = await apiFetch<{ user: UserProfile; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      saveUserLocally(res.user, data.password);
      setAuthToken(res.token);
      return res;
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        console.warn('[AquaTrack] Server unreachable / 404, using local login fallback.');
        const localRes = loginLocalAccount(data.email, data.password);
        return localRes;
      }
      throw err;
    }
  },

  loginDemo: async () => {
    try {
      const res = await apiFetch<{ user: UserProfile; token: string }>('/auth/demo', {
        method: 'POST',
      });
      saveUserLocally(res.user);
      setAuthToken(res.token);
      return res;
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        console.warn('[AquaTrack] Server unreachable / 404, using local demo fallback.');
        return getLocalDemoAccount();
      }
      throw err;
    }
  },

  logout: async () => {
    try {
      await apiFetch<{ success: boolean }>('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setAuthToken(null);
    try {
      localStorage.removeItem('aquatrack_current_user');
    } catch {}
    return { success: true };
  },

  getMe: async () => {
    try {
      const res = await apiFetch<{ user: UserProfile }>('/auth/me');
      saveUserLocally(res.user);
      return res;
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        const localUser = getLocalCurrentUser();
        if (localUser) {
          return { user: localUser };
        }
      }
      throw err;
    }
  },

  updateProfile: async (updates: Partial<UserProfile>) => {
    try {
      const res = await apiFetch<{ user: UserProfile }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      saveUserLocally(res.user);
      return res;
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        const cur = getLocalCurrentUser();
        if (cur) {
          const updated = { ...cur, ...updates, updatedAt: new Date().toISOString() };
          saveUserLocally(updated);
          return { user: updated };
        }
      }
      throw err;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      return await apiFetch<{ success: boolean; message: string; resetToken?: string }>('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        return {
          success: true,
          message: 'Local recovery token generated',
          resetToken: 'LOCAL-RECOVERY-TOKEN',
        };
      }
      throw err;
    }
  },

  resetPassword: async (token: string, newPassword: string) => {
    try {
      return await apiFetch<{ success: boolean; user: UserProfile }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        const cur = getLocalCurrentUser();
        if (cur) {
          saveUserLocally(cur, newPassword);
          return { success: true, user: cur };
        }
      }
      throw err;
    }
  },

  // Records
  getRecords: async (params?: { category?: string; search?: string; dateFrom?: string; dateTo?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.search) q.append('search', params.search);
    if (params?.dateFrom) q.append('dateFrom', params.dateFrom);
    if (params?.dateTo) q.append('dateTo', params.dateTo);
    const queryString = q.toString() ? `?${q.toString()}` : '';

    try {
      return await apiFetch<{ records: WaterRecord[] }>(`/records${queryString}`);
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        let recs = getLocalRecords();
        if (params?.category && params.category !== 'all') {
          recs = recs.filter(r => r.category === params.category);
        }
        if (params?.search) {
          const s = params.search.toLowerCase();
          recs = recs.filter(r => r.activityName.toLowerCase().includes(s) || (r.notes && r.notes.toLowerCase().includes(s)));
        }
        return { records: recs };
      }
      throw err;
    }
  },

  createRecord: async (data: any) => {
    try {
      const res = await apiFetch<{ record: WaterRecord }>('/records', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const recs = getLocalRecords();
      recs.unshift(res.record);
      saveLocalRecords(recs);
      return res;
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        const user = getLocalCurrentUser();
        const quantityLiters = convertToLiters(data.quantity, data.unit);
        const record: WaterRecord = {
          id: `local_rec_${Date.now()}`,
          userId: user?.id || 'offline_user',
          activityName: data.activityName,
          category: data.category,
          quantity: data.quantity,
          unit: data.unit,
          quantityLiters,
          date: data.date,
          time: data.time,
          notes: data.notes || '',
          isEstimated: !!data.isEstimated,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const recs = getLocalRecords();
        recs.unshift(record);
        saveLocalRecords(recs);
        return { record };
      }
      throw err;
    }
  },

  updateRecord: async (id: string, data: any) => {
    try {
      const res = await apiFetch<{ record: WaterRecord }>(`/records/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      const recs = getLocalRecords();
      const idx = recs.findIndex(r => r.id === id);
      if (idx >= 0) {
        recs[idx] = res.record;
        saveLocalRecords(recs);
      }
      return res;
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        const recs = getLocalRecords();
        const idx = recs.findIndex(r => r.id === id);
        if (idx >= 0) {
          const quantityLiters = convertToLiters(data.quantity, data.unit);
          recs[idx] = {
            ...recs[idx],
            ...data,
            quantityLiters,
            updatedAt: new Date().toISOString(),
          };
          saveLocalRecords(recs);
          return { record: recs[idx] };
        }
      }
      throw err;
    }
  },

  deleteRecord: async (id: string) => {
    try {
      await apiFetch<{ success: boolean }>(`/records/${id}`, { method: 'DELETE' });
    } catch (err: any) {
      if (!isNetworkOr404(err)) throw err;
    }
    const recs = getLocalRecords().filter(r => r.id !== id);
    saveLocalRecords(recs);
    return { success: true };
  },

  syncBatchRecords: (items: any[]) =>
    apiFetch<{ success: boolean; syncedCount: number; records: WaterRecord[] }>('/records/sync', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),

  // Analytics
  getAnalytics: async () => {
    try {
      return await apiFetch<{
        stats: any;
        currentStreak: number;
        dailyChartData: Array<{ date: string; liters: number }>;
        categoryTotals: Record<string, number>;
        measuredVsEstimated: Array<{ name: string; value: number }>;
      }>('/analytics');
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        return calculateLocalAnalytics();
      }
      throw err;
    }
  },

  // Goals
  getGoals: async () => {
    try {
      return await apiFetch<{ goals: Goal[] }>('/goals');
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        return { goals: getLocalGoals() };
      }
      throw err;
    }
  },

  createGoal: async (data: any) => {
    try {
      return await apiFetch<{ goal: Goal }>('/goals', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        const user = getLocalCurrentUser();
        const newGoal: Goal = {
          id: `local_goal_${Date.now()}`,
          userId: user?.id || 'offline_user',
          title: data.title,
          targetLiters: data.targetLiters,
          period: data.period,
          category: data.category || 'all',
          active: true,
          createdAt: new Date().toISOString(),
        };
        const goals = getLocalGoals();
        goals.push(newGoal);
        try {
          localStorage.setItem(`aquatrack_goals_${user?.id}`, JSON.stringify(goals));
        } catch {}
        return { goal: newGoal };
      }
      throw err;
    }
  },

  updateGoal: (id: string, data: any) =>
    apiFetch<{ goal: Goal }>(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteGoal: (id: string) =>
    apiFetch<{ success: boolean }>(`/goals/${id}`, {
      method: 'DELETE',
    }),

  // Reminders
  getReminders: async () => {
    try {
      return await apiFetch<{ reminders: Reminder[] }>('/reminders');
    } catch (err: any) {
      if (isNetworkOr404(err)) return { reminders: [] };
      throw err;
    }
  },

  createReminder: (data: any) =>
    apiFetch<{ reminder: Reminder }>('/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateReminder: (id: string, data: any) =>
    apiFetch<{ reminder: Reminder }>(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteReminder: (id: string) =>
    apiFetch<{ success: boolean }>(`/reminders/${id}`, {
      method: 'DELETE',
    }),

  // Achievements
  getAchievements: async () => {
    try {
      return await apiFetch<{ unlocked: Array<{ achievementId: string; unlockedAt: string }> }>('/achievements');
    } catch (err: any) {
      if (isNetworkOr404(err)) return { unlocked: [] };
      throw err;
    }
  },

  // Games
  getGameScores: async () => {
    try {
      return await apiFetch<{ scores: GameScore[] }>('/games/scores');
    } catch (err: any) {
      if (isNetworkOr404(err)) return { scores: [] };
      throw err;
    }
  },

  saveGameScore: (gameId: string, score: number, stars: number) =>
    apiFetch<{ result: GameScore }>('/games/score', {
      method: 'POST',
      body: JSON.stringify({ gameId, score, stars }),
    }),

  // Laws & Lessons
  getLaws: () =>
    apiFetch<{ laws: PhilippineLaw[] }>('/laws'),

  getLessons: () =>
    apiFetch<{ lessons: Lesson[] }>('/learning/lessons'),

  getLearningProgress: async () => {
    try {
      return await apiFetch<{
        progress: Array<{ lessonId: string; completed: boolean; score?: number }>;
        bookmarks: Array<{ itemType: string; itemId: string }>;
      }>('/learning/progress');
    } catch (err: any) {
      if (isNetworkOr404(err)) return { progress: [], bookmarks: [] };
      throw err;
    }
  },

  saveLessonProgress: (lessonId: string, score?: number) =>
    apiFetch<{ result: any }>('/learning/progress', {
      method: 'POST',
      body: JSON.stringify({ lessonId, score }),
    }),

  toggleBookmark: (itemType: string, itemId: string) =>
    apiFetch<{ isBookmarked: boolean }>('/bookmarks/toggle', {
      method: 'POST',
      body: JSON.stringify({ itemType, itemId }),
    }),

  // AI Assistant
  askAI: (message: string, history?: Array<{ role: string; text: string }>) =>
    apiFetch<{ reply: string; isLiveAI: boolean }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),

  // Community
  getCommunity: async () => {
    try {
      return await apiFetch<{
        challenges: Array<{ id: string; title: string; description: string; participants: number; category: string; badge: string }>;
        tips: Array<{ id: string; author: string; tip: string; likes: number }>;
      }>('/community');
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        return {
          challenges: [
            { id: 'c1', title: '5-Minute Shower Challenge', description: 'Limit all showers to 5 minutes or less for 7 consecutive days.', participants: 342, category: 'Habit', badge: '🚿 Speed Saver' },
            { id: 'c2', title: 'Zero Tap Running While Brushing', description: 'Turn off the tap completely while brushing your teeth.', participants: 512, category: 'Conservation', badge: '🪥 Tap Guardian' },
            { id: 'c3', title: 'Rainwater Harvesting Enthusiast', description: 'Collect and use rainwater for plant care or floor washing.', participants: 189, category: 'Eco', badge: '🌧️ Cloud Catcher' }
          ],
          tips: [
            { id: 't1', author: 'Environmental Management Bureau', tip: 'Install aerators on sink faucets to reduce flow rates from 9 liters/min down to 3.5 liters/min without sacrificing pressure.', likes: 78 },
            { id: 't2', author: 'AquaTrack Community', tip: 'Reuse cooking water (once cooled and unsalted) for watering home vegetable gardens.', likes: 64 },
          ],
        };
      }
      throw err;
    }
  },

  // Water Issues & Environmental News
  getNews: async (params?: { search?: string; category?: string; region?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.region) query.set('region', params.region);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();

    try {
      return await apiFetch<NewsFeedResponse>(`/news${qs ? `?${qs}` : ''}`);
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        // High fidelity offline news feed with unique photographs
        let filtered = [...BASELINE_VERIFIED_NEWS];
        if (params?.category && params.category !== 'all') {
          filtered = filtered.filter(a => a.category === params.category);
        }
        if (params?.region && params.region !== 'all') {
          filtered = filtered.filter(a => a.region === params.region);
        }
        if (params?.search) {
          const s = params.search.toLowerCase();
          filtered = filtered.filter(a => a.headline.toLowerCase().includes(s) || a.summary.toLowerCase().includes(s));
        }

        const page = params?.page || 1;
        const limit = params?.limit || 6;
        const totalCount = filtered.length;
        const totalPages = Math.ceil(totalCount / limit) || 1;
        const startIndex = (page - 1) * limit;
        const items = filtered.slice(startIndex, startIndex + limit);

        return {
          articles: items,
          total: totalCount,
          page,
          totalPages,
          lastUpdated: new Date().toISOString(),
          nextScheduledUpdate: new Date(Date.now() + 86400000).toISOString(),
          isStale: false,
          status: 'offline_resilient',
        };
      }
      throw err;
    }
  },

  refreshNews: () =>
    apiFetch<{ success: boolean; updated: boolean; count: number }>('/news/refresh', {
      method: 'POST',
    }),

  getNewsStats: async () => {
    try {
      return await apiFetch<{ totalArticles: number; lastUpdated: string; nextScheduledUpdate: string; status: string; sourcesCount: number }>('/news/stats');
    } catch (err: any) {
      if (isNetworkOr404(err)) {
        return {
          totalArticles: BASELINE_VERIFIED_NEWS.length,
          lastUpdated: new Date().toISOString(),
          nextScheduledUpdate: new Date(Date.now() + 86400000).toISOString(),
          status: 'offline_resilient',
          sourcesCount: 6,
        };
      }
      throw err;
    }
  },
};
