import { WaterRecord, UserProfile, Goal, Reminder, PhilippineLaw, Lesson, GameScore, NewsFeedResponse } from '../types';

let cachedToken: string | null = null;

export function setAuthToken(token: string | null) {
  cachedToken = token;
  if (token) {
    localStorage.setItem('aquatrack_token', token);
  } else {
    localStorage.removeItem('aquatrack_token');
  }
}

export function getAuthToken(): string | null {
  if (!cachedToken) {
    cachedToken = localStorage.getItem('aquatrack_token');
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
    headers,
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errData = await response.json();
      errorMsg = errData.error || errData.message || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: { email: string; password: string; confirmPassword: string; nickname: string }) =>
    apiFetch<{ user: UserProfile; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<{ user: UserProfile; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loginDemo: () =>
    apiFetch<{ user: UserProfile; token: string }>('/auth/demo', {
      method: 'POST',
    }),

  logout: () =>
    apiFetch<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  getMe: () =>
    apiFetch<{ user: UserProfile }>('/auth/me'),

  updateProfile: (updates: Partial<UserProfile>) =>
    apiFetch<{ user: UserProfile }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  forgotPassword: (email: string) =>
    apiFetch<{ success: boolean; message: string; resetToken?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiFetch<{ success: boolean; user: UserProfile }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  // Records
  getRecords: (params?: { category?: string; search?: string; dateFrom?: string; dateTo?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.search) q.append('search', params.search);
    if (params?.dateFrom) q.append('dateFrom', params.dateFrom);
    if (params?.dateTo) q.append('dateTo', params.dateTo);
    const queryString = q.toString() ? `?${q.toString()}` : '';
    return apiFetch<{ records: WaterRecord[] }>(`/records${queryString}`);
  },

  createRecord: (data: any) =>
    apiFetch<{ record: WaterRecord }>('/records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateRecord: (id: string, data: any) =>
    apiFetch<{ record: WaterRecord }>(`/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteRecord: (id: string) =>
    apiFetch<{ success: boolean }>(`/records/${id}`, {
      method: 'DELETE',
    }),

  syncBatchRecords: (items: any[]) =>
    apiFetch<{ success: boolean; syncedCount: number; records: WaterRecord[] }>('/records/sync', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),

  // Analytics
  getAnalytics: () =>
    apiFetch<{
      stats: any;
      currentStreak: number;
      dailyChartData: Array<{ date: string; liters: number }>;
      categoryTotals: Record<string, number>;
      measuredVsEstimated: Array<{ name: string; value: number }>;
    }>('/analytics'),

  // Goals
  getGoals: () =>
    apiFetch<{ goals: Goal[] }>('/goals'),

  createGoal: (data: any) =>
    apiFetch<{ goal: Goal }>('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

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
  getReminders: () =>
    apiFetch<{ reminders: Reminder[] }>('/reminders'),

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
  getAchievements: () =>
    apiFetch<{ unlocked: Array<{ achievementId: string; unlockedAt: string }> }>('/achievements'),

  // Games
  getGameScores: () =>
    apiFetch<{ scores: GameScore[] }>('/games/scores'),

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

  getLearningProgress: () =>
    apiFetch<{
      progress: Array<{ lessonId: string; completed: boolean; score?: number }>;
      bookmarks: Array<{ itemType: string; itemId: string }>;
    }>('/learning/progress'),

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
  getCommunity: () =>
    apiFetch<{
      challenges: Array<{ id: string; title: string; description: string; participants: number; category: string; badge: string }>;
      tips: Array<{ id: string; author: string; tip: string; likes: number }>;
    }>('/community'),

  // Water Issues & Environmental News
  getNews: (params?: { search?: string; category?: string; region?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.region) query.set('region', params.region);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();
    return apiFetch<NewsFeedResponse>(`/news${qs ? `?${qs}` : ''}`);
  },

  refreshNews: () =>
    apiFetch<{ success: boolean; updated: boolean; count: number }>('/news/refresh', {
      method: 'POST',
    }),

  getNewsStats: () =>
    apiFetch<{ totalArticles: number; lastUpdated: string; nextScheduledUpdate: string; status: string; sourcesCount: number }>('/news/stats'),
};
