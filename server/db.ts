import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { WaterRecord, Goal, Reminder, GameScore, WaterUnit } from '../src/types';

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  nickname: string;
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

export interface DatabaseState {
  users: UserEntity[];
  records: WaterRecord[];
  goals: Goal[];
  reminders: Reminder[];
  gameScores: GameScore[];
  lessonProgress: Array<{ userId: string; lessonId: string; completed: boolean; score?: number; completedAt: string }>;
  bookmarks: Array<{ userId: string; itemType: string; itemId: string; createdAt: string }>;
  achievements: Array<{ userId: string; achievementId: string; unlockedAt: string }>;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'aquatrack.json');
const JWT_SECRET = process.env.JWT_SECRET || 'aquatrack-super-secret-jwt-key-2026';

function initDatabase(): DatabaseState {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
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
};
