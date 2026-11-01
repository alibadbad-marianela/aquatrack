import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { WaterRecord, Goal, Reminder, GameScore, WaterUnit } from '../src/types';

export interface PrivacySettings {
  showOnLeaderboard?: boolean;
  showPublicTips?: boolean;
  showStreakPublicly?: boolean;
}

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  nickname: string;
  avatarUrl?: string;
  birthdate?: string; // YYYY-MM-DD
  location?: string;
  householdSize?: number;
  bio?: string;
  privacySettings?: PrivacySettings;
  preferredLanguage: string;
  preferredUnit: WaterUnit;
  theme: 'light' | 'dark' | 'system';
  autoRotateGreeting: boolean;
  greetingRotateIntervalSec: number;
  onboardingCompleted: boolean;
  resetToken?: string;
  resetTokenExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityTipEntity {
  id: string;
  userId: string;
  authorNickname: string;
  authorAvatar?: string;
  category: string;
  title: string;
  tip: string;
  practicalImpact?: string;
  likesCount: number;
  likedBy: string[]; // user IDs
  isVerifiedAuthority?: boolean;
  sourceAuthority?: string;
  createdAt: string;
}

export interface ChallengeParticipantEntity {
  id: string;
  challengeId: string;
  userId: string;
  joinedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  nickname: string;
  avatarUrl?: string;
  gameId: string;
  highScore: number;
  stars: number;
  achievementsCount: number;
  lastPlayedAt: string;
}

export interface DatabaseState {
  users: UserEntity[];
  records: WaterRecord[];
  goals: Goal[];
  reminders: Reminder[];
  gameScores: GameScore[];
  lessonProgress: Array<{ userId: string; lessonId: string; completed: boolean; score?: number; completedAt: string }>;
  bookmarks: Array<{ userId: string; itemType: string; itemId: string; createdAt: string }>;
  achievements: Array<{ userId: string; achievementId: string; unlockedAt: string }>;
  communityTips: CommunityTipEntity[];
  challengeParticipants: ChallengeParticipantEntity[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'aquatrack.json');
const JWT_SECRET = process.env.JWT_SECRET || 'aquatrack-super-secret-jwt-key-2026';

const FACTUAL_AUTHORITY_TIPS: CommunityTipEntity[] = [
  {
    id: 'emb-aerator-standard',
    userId: 'authority_denr_emb',
    authorNickname: 'DENR-EMB Water Quality Section',
    category: 'Fixtures & Audits',
    title: 'Faucet Aerator Installation & Flow Restriction',
    tip: 'Installing a 2.5 liter-per-minute aerator on your kitchen and bathroom sink faucets reduces flow rates by up to 50% compared to standard 6–9 liter taps without compromising rinse pressure.',
    practicalImpact: 'Saves 25–40 Liters per household daily',
    likesCount: 0,
    likedBy: [],
    isVerifiedAuthority: true,
    sourceAuthority: 'DENR-EMB Guidelines on Domestic Water Efficiency',
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'mwss-toilet-dye-test',
    userId: 'authority_mwss',
    authorNickname: 'MWSS Conservation Desk',
    category: 'Leak Detection',
    title: 'Two-Step Toilet Tank Dye Test',
    tip: 'Place 4–5 drops of food coloring into your toilet tank and wait 15 minutes without flushing. If color seeps into the bowl, the rubber flapper valve is worn and leaking up to 200 liters of water daily.',
    practicalImpact: 'Eliminates silent leaks of 100–200 Liters daily',
    likesCount: 0,
    likedBy: [],
    isVerifiedAuthority: true,
    sourceAuthority: 'MWSS Leak Audit Field Manual',
    createdAt: '2026-01-20T09:30:00.000Z',
  },
  {
    id: 'unwater-graywater-practice',
    userId: 'authority_unwater',
    authorNickname: 'UN-Water Best Practices',
    category: 'Reuse & Harvesting',
    title: 'Graywater Reuse for Non-Edible Irrigation',
    tip: 'Water used for washing uncooked vegetables and rice rinsing (hugas-bigas) contains trace minerals and can be safely applied directly to ornamental shrubs and tree beds, eliminating potable tap usage for gardening.',
    practicalImpact: 'Saves 15–30 Liters per cooking session',
    likesCount: 0,
    likedBy: [],
    isVerifiedAuthority: true,
    sourceAuthority: 'UN-Water Guidelines on Safe Graywater Utilization',
    createdAt: '2026-02-05T10:00:00.000Z',
  },
  {
    id: 'irri-water-smart-agronomy',
    userId: 'authority_irri',
    authorNickname: 'IRRI Water Management Section',
    category: 'Urban Agriculture',
    title: 'Alternate Wetting and Drying (AWD) Principle',
    tip: 'Applying the AWD method to home gardens and urban plots—allowing the topsoil to dry slightly before re-saturating—develops deeper root systems and cuts irrigation demand by 25% to 30%.',
    practicalImpact: 'Reduces garden irrigation by 25–30%',
    likesCount: 0,
    likedBy: [],
    isVerifiedAuthority: true,
    sourceAuthority: 'International Rice Research Institute (IRRI) AWD Guidelines',
    createdAt: '2026-02-18T11:15:00.000Z',
  },
];

function initDatabase(): DatabaseState {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.communityTips || parsed.communityTips.length === 0) {
        parsed.communityTips = [...FACTUAL_AUTHORITY_TIPS];
      }
      if (!parsed.challengeParticipants) {
        parsed.challengeParticipants = [];
      }
      return parsed;
    } catch (e) {
      console.error('Error reading database file, initializing clean state', e);
    }
  }

  const initialState: DatabaseState = {
    users: [],
    records: [],
    goals: [],
    reminders: [],
    gameScores: [],
    lessonProgress: [],
    bookmarks: [],
    achievements: [],
    communityTips: [...FACTUAL_AUTHORITY_TIPS],
    challengeParticipants: [],
  };

  saveDatabase(initialState);
  return initialState;
}

let dbState: DatabaseState = initDatabase();

function saveDatabase(state: DatabaseState): void {
  try {
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

export const db = {
  // --- USERS & AUTH ---
  findUserByEmail(email: string): UserEntity | undefined {
    if (!email) return undefined;
    const clean = email.trim().toLowerCase();
    return dbState.users.find((u) => u.email.toLowerCase() === clean);
  },

  findUserById(id: string): UserEntity | undefined {
    return dbState.users.find((u) => u.id === id);
  },

  createUser(data: { email: string; password: string; nickname: string; displayName?: string }): UserEntity {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanNickname = data.nickname.trim();

    const existing = db.findUserByEmail(cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(data.password, salt);
    const now = new Date().toISOString();

    const newUser: UserEntity = {
      id: crypto.randomUUID(),
      email: cleanEmail,
      passwordHash,
      displayName: data.displayName?.trim() || cleanNickname,
      nickname: cleanNickname,
      preferredLanguage: 'en',
      preferredUnit: 'liters',
      theme: 'system',
      autoRotateGreeting: true,
      greetingRotateIntervalSec: 8,
      onboardingCompleted: false, // New users MUST complete the Welcome Setup Wizard
      createdAt: now,
      updatedAt: now,
    };

    dbState.users.push(newUser);
    saveDatabase(dbState);
    return newUser;
  },

  completeUserOnboarding(
    userId: string,
    preferredUnit: WaterUnit,
    nickname?: string,
    goalData?: { title: string; targetLiters: number; period: 'daily' | 'weekly' | 'monthly' | 'custom'; category?: string; startDate?: string; endDate?: string }
  ): { user: UserEntity; goal?: Goal } {
    const userIndex = dbState.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    const currentUser = dbState.users[userIndex];
    const cleanNick = nickname?.trim() || currentUser.nickname;
    const updatedUser: UserEntity = {
      ...currentUser,
      preferredUnit,
      nickname: cleanNick,
      displayName: cleanNick,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    };
    dbState.users[userIndex] = updatedUser;

    let savedGoal: Goal | undefined;
    if (goalData && goalData.targetLiters > 0) {
      savedGoal = {
        id: crypto.randomUUID(),
        userId,
        title: goalData.title || `${goalData.period.charAt(0).toUpperCase() + goalData.period.slice(1)} Water Goal`,
        targetLiters: goalData.targetLiters,
        period: goalData.period,
        category: (goalData.category as any) || 'all',
        active: true,
        startDate: goalData.startDate,
        endDate: goalData.endDate,
        createdAt: new Date().toISOString(),
      };
      // Deactivate any existing goals of same period
      dbState.goals = dbState.goals.map((g) => (g.userId === userId && g.period === goalData.period ? { ...g, active: false } : g));
      dbState.goals.push(savedGoal);
    }

    saveDatabase(dbState);
    return { user: updatedUser, goal: savedGoal };
  },

  verifyPassword(user: UserEntity, plainText: string): boolean {
    return bcrypt.compareSync(plainText, user.passwordHash);
  },

  updateUserProfile(userId: string, updates: Partial<UserEntity>): UserEntity {
    const userIndex = dbState.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error('User not found');

    const currentUser = dbState.users[userIndex];
    const updatedUser: UserEntity = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    dbState.users[userIndex] = updatedUser;
    saveDatabase(dbState);
    return updatedUser;
  },

  generateResetToken(email: string): { token: string; user: UserEntity } {
    const user = db.findUserByEmail(email);
    if (!user) throw new Error('No account found with this email');

    const token = crypto.randomBytes(24).toString('hex');
    const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    db.updateUserProfile(user.id, { resetToken: token, resetTokenExpiry: expiry });
    return { token, user };
  },

  resetPasswordWithToken(token: string, newPassword: string): UserEntity {
    const user = dbState.users.find(
      (u) => u.resetToken === token && u.resetTokenExpiry && new Date(u.resetTokenExpiry) > new Date()
    );
    if (!user) throw new Error('Invalid or expired reset token');

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(newPassword, salt);

    return db.updateUserProfile(user.id, {
      passwordHash,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });
  },

  createSessionToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  },

  verifySessionToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return null;
    }
  },

  // --- WATER RECORDS CRUD ---
  getRecordsByUser(userId: string): WaterRecord[] {
    return dbState.records
      .filter((r) => r.userId === userId)
      .sort((a, b) => (a.date === b.date ? b.time.localeCompare(a.time) : b.date.localeCompare(a.date)));
  },

  createRecord(userId: string, data: Omit<WaterRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): WaterRecord {
    const now = new Date().toISOString();
    const newRecord: WaterRecord = {
      ...data,
      id: crypto.randomUUID(),
      userId,
      createdAt: now,
      updatedAt: now,
      syncStatus: 'synced',
    };

    dbState.records.push(newRecord);

    // Auto-unlock "first_drop" achievement if first log
    const userRecordsCount = dbState.records.filter((r) => r.userId === userId).length;
    if (userRecordsCount === 1) {
      db.unlockAchievement(userId, 'first_drop');
    }

    saveDatabase(dbState);
    return newRecord;
  },

  updateRecord(userId: string, recordId: string, updates: Partial<WaterRecord>): WaterRecord {
    const idx = dbState.records.findIndex((r) => r.id === recordId && r.userId === userId);
    if (idx === -1) throw new Error('Record not found or unauthorized');

    const existing = dbState.records[idx];
    const updated: WaterRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    dbState.records[idx] = updated;
    saveDatabase(dbState);
    return updated;
  },

  deleteRecord(userId: string, recordId: string): boolean {
    const idx = dbState.records.findIndex((r) => r.id === recordId && r.userId === userId);
    if (idx === -1) return false;

    dbState.records.splice(idx, 1);
    saveDatabase(dbState);
    return true;
  },

  batchSyncRecords(userId: string, incomingRecords: Array<Partial<WaterRecord> & { clientUuid?: string }>): WaterRecord[] {
    const now = new Date().toISOString();
    const results: WaterRecord[] = [];

    for (const item of incomingRecords) {
      if (!item.activityName || !item.category || typeof item.quantity !== 'number') continue;

      // Idempotency check: see if record with same clientUuid or matching id exists
      const existing = dbState.records.find(
        (r) => r.userId === userId && (r.id === item.id || (item.clientUuid && r.id === item.clientUuid))
      );

      if (!existing) {
        const newRecord: WaterRecord = {
          id: item.clientUuid || item.id || crypto.randomUUID(),
          userId,
          activityName: item.activityName,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit || 'liters',
          quantityLiters: item.quantityLiters || item.quantity,
          date: item.date || now.split('T')[0],
          time: item.time || '12:00',
          notes: item.notes || '',
          isEstimated: !!item.isEstimated,
          createdAt: item.createdAt || now,
          updatedAt: now,
          syncStatus: 'synced',
        };
        dbState.records.push(newRecord);
        results.push(newRecord);
      } else {
        results.push(existing);
      }
    }

    saveDatabase(dbState);
    return results;
  },

  // --- GOALS ---
  getGoals(userId: string): Goal[] {
    return dbState.goals.filter((g) => g.userId === userId);
  },

  createGoal(userId: string, data: Omit<Goal, 'id' | 'userId' | 'createdAt'>): Goal {
    const newGoal: Goal = {
      ...data,
      id: crypto.randomUUID(),
      userId,
      createdAt: new Date().toISOString(),
    };
    dbState.goals.push(newGoal);
    saveDatabase(dbState);
    return newGoal;
  },

  updateGoal(userId: string, goalId: string, updates: Partial<Goal>): Goal {
    const idx = dbState.goals.findIndex((g) => g.id === goalId && g.userId === userId);
    if (idx === -1) throw new Error('Goal not found');
    dbState.goals[idx] = { ...dbState.goals[idx], ...updates };
    saveDatabase(dbState);
    return dbState.goals[idx];
  },

  deleteGoal(userId: string, goalId: string): boolean {
    const idx = dbState.goals.findIndex((g) => g.id === goalId && g.userId === userId);
    if (idx === -1) return false;
    dbState.goals.splice(idx, 1);
    saveDatabase(dbState);
    return true;
  },

  // --- REMINDERS ---
  getReminders(userId: string): Reminder[] {
    return dbState.reminders.filter((r) => r.userId === userId);
  },

  createReminder(userId: string, data: Omit<Reminder, 'id' | 'userId'>): Reminder {
    const newReminder: Reminder = {
      ...data,
      id: crypto.randomUUID(),
      userId,
    };
    dbState.reminders.push(newReminder);
    saveDatabase(dbState);
    return newReminder;
  },

  updateReminder(userId: string, reminderId: string, updates: Partial<Reminder>): Reminder {
    const idx = dbState.reminders.findIndex((r) => r.id === reminderId && r.userId === userId);
    if (idx === -1) throw new Error('Reminder not found');
    dbState.reminders[idx] = { ...dbState.reminders[idx], ...updates };
    saveDatabase(dbState);
    return dbState.reminders[idx];
  },

  deleteReminder(userId: string, reminderId: string): boolean {
    const idx = dbState.reminders.findIndex((r) => r.id === reminderId && r.userId === userId);
    if (idx === -1) return false;
    dbState.reminders.splice(idx, 1);
    saveDatabase(dbState);
    return true;
  },

  // --- ACHIEVEMENTS ---
  getAchievements(userId: string): Array<{ achievementId: string; unlockedAt: string }> {
    return dbState.achievements.filter((a) => a.userId === userId);
  },

  unlockAchievement(userId: string, achievementId: string): boolean {
    const exists = dbState.achievements.some((a) => a.userId === userId && a.achievementId === achievementId);
    if (!exists) {
      dbState.achievements.push({
        userId,
        achievementId,
        unlockedAt: new Date().toISOString(),
      });
      saveDatabase(dbState);
      return true;
    }
    return false;
  },

  // --- GAME SCORES ---
  getGameScores(userId: string): GameScore[] {
    return dbState.gameScores.filter((g) => g.userId === userId);
  },

  saveGameScore(userId: string, gameId: string, score: number, stars: number): GameScore {
    let entry = dbState.gameScores.find((g) => g.userId === userId && g.gameId === gameId);
    const now = new Date().toISOString();

    if (!entry) {
      entry = {
        gameId,
        highScore: score,
        stars,
        playedCount: 1,
        lastPlayedAt: now,
      };
      dbState.gameScores.push({ ...entry, userId } as any);
    } else {
      entry.playedCount += 1;
      entry.lastPlayedAt = now;
      if (score > entry.highScore) entry.highScore = score;
      if (stars > entry.stars) entry.stars = stars;
    }

    db.unlockAchievement(userId, 'game_player');
    if (entry.stars === 3) {
      db.unlockAchievement(userId, 'game_master');
    }

    saveDatabase(dbState);
    return entry;
  },

  // --- LESSON PROGRESS & BOOKMARKS ---
  getLessonProgress(userId: string) {
    return dbState.lessonProgress.filter((l) => l.userId === userId);
  },

  saveLessonProgress(userId: string, lessonId: string, score?: number) {
    let entry = dbState.lessonProgress.find((l) => l.userId === userId && l.lessonId === lessonId);
    if (!entry) {
      entry = {
        userId,
        lessonId,
        completed: true,
        score,
        completedAt: new Date().toISOString(),
      };
      dbState.lessonProgress.push(entry);
    } else {
      entry.completed = true;
      if (score !== undefined) entry.score = score;
      entry.completedAt = new Date().toISOString();
    }

    db.unlockAchievement(userId, 'eco_scholar');
    saveDatabase(dbState);
    return entry;
  },

  getBookmarks(userId: string) {
    return dbState.bookmarks.filter((b) => b.userId === userId);
  },

  toggleBookmark(userId: string, itemType: string, itemId: string): boolean {
    const idx = dbState.bookmarks.findIndex(
      (b) => b.userId === userId && b.itemType === itemType && b.itemId === itemId
    );
    if (idx !== -1) {
      dbState.bookmarks.splice(idx, 1);
      saveDatabase(dbState);
      return false; // unbookmarked
    } else {
      dbState.bookmarks.push({
        userId,
        itemType,
        itemId,
        createdAt: new Date().toISOString(),
      });
      saveDatabase(dbState);
      return true; // bookmarked
    }
  },

  // --- REAL COMMUNITY TIPS & CHALLENGES (No Fabricated Data) ---
  getCommunityTips(category?: string): CommunityTipEntity[] {
    let tips = [...dbState.communityTips];
    if (category && category !== 'all') {
      tips = tips.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }
    // Sort with most liked & newest first
    return tips.sort((a, b) => b.likesCount - a.likesCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createCommunityTip(data: {
    userId: string;
    authorNickname: string;
    authorAvatar?: string;
    category: string;
    title: string;
    tip: string;
    practicalImpact?: string;
  }): CommunityTipEntity {
    const newTip: CommunityTipEntity = {
      id: crypto.randomUUID(),
      userId: data.userId,
      authorNickname: data.authorNickname.trim() || 'Community Member',
      authorAvatar: data.authorAvatar,
      category: data.category.trim() || 'General Habit',
      title: data.title.trim(),
      tip: data.tip.trim(),
      practicalImpact: data.practicalImpact?.trim(),
      likesCount: 0,
      likedBy: [],
      isVerifiedAuthority: false,
      createdAt: new Date().toISOString(),
    };

    dbState.communityTips.unshift(newTip);
    db.unlockAchievement(data.userId, 'community_contributor');
    saveDatabase(dbState);
    return newTip;
  },

  likeCommunityTip(tipId: string, userId: string): CommunityTipEntity {
    const tip = dbState.communityTips.find((t) => t.id === tipId);
    if (!tip) throw new Error('Community tip not found');

    if (!tip.likedBy) tip.likedBy = [];

    const existingIdx = tip.likedBy.indexOf(userId);
    if (existingIdx !== -1) {
      // Toggle off / unlike
      tip.likedBy.splice(existingIdx, 1);
      tip.likesCount = Math.max(0, tip.likesCount - 1);
    } else {
      // Like
      tip.likedBy.push(userId);
      tip.likesCount += 1;
    }

    saveDatabase(dbState);
    return tip;
  },

  getChallengeParticipantsCount(challengeId: string): number {
    return dbState.challengeParticipants.filter((p) => p.challengeId === challengeId).length;
  },

  getUserJoinedChallenges(userId: string): string[] {
    return dbState.challengeParticipants.filter((p) => p.userId === userId).map((p) => p.challengeId);
  },

  toggleChallengeParticipation(challengeId: string, userId: string): { joined: boolean; count: number } {
    const idx = dbState.challengeParticipants.findIndex(
      (p) => p.challengeId === challengeId && p.userId === userId
    );

    let joined = false;
    if (idx !== -1) {
      dbState.challengeParticipants.splice(idx, 1);
      joined = false;
    } else {
      dbState.challengeParticipants.push({
        id: crypto.randomUUID(),
        challengeId,
        userId,
        joinedAt: new Date().toISOString(),
      });
      joined = true;
      db.unlockAchievement(userId, 'challenge_champion');
    }

    saveDatabase(dbState);
    const count = db.getChallengeParticipantsCount(challengeId);
    return { joined, count };
  },

  // --- GAME LEADERBOARDS & RANKINGS (Real Gameplay Only) ---
  getGameLeaderboard(gameId?: string): LeaderboardEntry[] {
    let scores = [...dbState.gameScores];
    if (gameId && gameId !== 'all') {
      scores = scores.filter((s) => s.gameId === gameId);
    }

    // Map each score entry with real user details
    const entries: LeaderboardEntry[] = [];

    for (const score of scores) {
      const user = dbState.users.find((u) => u.id === (score as any).userId);
      if (!user) continue;

      // Honor user privacy setting
      if (user.privacySettings?.showOnLeaderboard === false) {
        continue;
      }

      const achievementsCount = dbState.achievements.filter((a) => a.userId === user.id).length;

      entries.push({
        rank: 0,
        userId: user.id,
        nickname: user.nickname || user.displayName || 'Water Hero',
        avatarUrl: user.avatarUrl,
        gameId: score.gameId,
        highScore: score.highScore,
        stars: score.stars,
        achievementsCount,
        lastPlayedAt: score.lastPlayedAt || new Date().toISOString(),
      });
    }

    // Sort by highScore descending, then stars descending
    entries.sort((a, b) => b.highScore - a.highScore || b.stars - a.stars);

    // Assign sequential ranks 1, 2, 3...
    return entries.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  },

  // --- STREAK HISTORY & METRICS ---
  getStreakDetails(userId: string) {
    const records = db.getRecordsByUser(userId);
    const recordDates = new Set(records.map((r) => r.date));

    // Calculate dates for past 30 days
    const past30Days: Array<{ date: string; dayName: string; hasLogged: boolean; totalLiters: number }> = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayRecords = records.filter((r) => r.date === dateStr);
      const totalLiters = dayRecords.reduce((sum, r) => sum + (r.quantityLiters || r.quantity), 0);

      past30Days.push({
        date: dateStr,
        dayName,
        hasLogged: recordDates.has(dateStr),
        totalLiters: Math.round(totalLiters * 10) / 10,
      });
    }

    // Calculate current streak
    let currentStreak = 0;
    const sortedDates = Array.from(recordDates).sort().reverse();
    if (sortedDates.length > 0) {
      const todayStr = today.toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      if (sortedDates[0] === todayStr || sortedDates[0] === yesterdayStr) {
        currentStreak = 1;
        let checkDate = new Date(sortedDates[0]);

        for (let i = 1; i < sortedDates.length; i++) {
          checkDate = new Date(checkDate.getTime() - 86400000);
          const expected = checkDate.toISOString().split('T')[0];
          if (sortedDates[i] === expected) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Calculate best streak historically
    let bestStreak = currentStreak;
    if (sortedDates.length > 0) {
      let tempStreak = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const d1 = new Date(sortedDates[i]);
        const d2 = new Date(sortedDates[i + 1]);
        const diffDays = Math.round((d1.getTime() - d2.getTime()) / 86400000);
        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > bestStreak) bestStreak = tempStreak;
        } else {
          tempStreak = 1;
        }
      }
    }

    return {
      currentStreak,
      bestStreak: Math.max(bestStreak, currentStreak),
      totalLoggedDays: recordDates.size,
      past30Days,
    };
  },
};
