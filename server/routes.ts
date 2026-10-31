import { Router, Request, Response, NextFunction } from 'express';
import { db, UserEntity } from './db';
import { registerSchema, loginSchema, waterRecordSchema, goalSchema } from '../src/lib/validation';
import { convertToLiters, calculateSummaryStats, calculateStreak, formatWaterVolume } from '../src/lib/waterCalculations';
import { PHILIPPINE_LAWS } from '../src/lib/philippineLaws';
import { LESSONS } from '../src/lib/learningContent';
import { GoogleGenAI } from '@google/genai';
import { waterNewsService } from './newsService';

export const apiRouter = Router();

// Middleware: Authenticate via Bearer header or cookie
export interface AuthenticatedRequest extends Request {
  user?: UserEntity;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const tokenFromCookie = req.cookies?.aquatrack_session;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const payload = db.verifySessionToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Session expired or invalid' });
    return;
  }

  const user = db.findUserById(payload.userId);
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  req.user = user;
  next();
}

// Strip password hash from responses
function sanitizeUser(user: UserEntity) {
  const { passwordHash, resetToken, resetTokenExpiry, ...rest } = user;
  return rest;
}

// Health check endpoint
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// --- AUTH ROUTES ---
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }

    const { email, password, nickname } = parsed.data;
    const cleanEmail = email.trim().toLowerCase();
    const cleanNickname = nickname?.trim() || cleanEmail.split('@')[0] || 'Friend';

    const existing = db.findUserByEmail(cleanEmail);
    if (existing) {
      res.status(400).json({
        error: 'An account with this email address already exists. Please sign in instead.',
        alreadyRegistered: true,
      });
      return;
    }

    const user = db.createUser({ email: cleanEmail, password, nickname: cleanNickname });
    const token = db.createSessionToken(user.id);

    res.cookie('aquatrack_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }

    const { email, password } = parsed.data;
    const cleanEmail = email.trim().toLowerCase();
    const user = db.findUserByEmail(cleanEmail);

    if (!user) {
      res.status(401).json({
        error: 'No account found with this email. Please switch to "Create Account" above to register.',
        notRegistered: true,
      });
      return;
    }

    if (!db.verifyPassword(user, password)) {
      res.status(401).json({ error: 'Incorrect password. Please verify your credentials or click "Forgot password?".' });
      return;
    }

    const token = db.createSessionToken(user.id);

    res.cookie('aquatrack_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: sanitizeUser(user), token });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Login failed' });
  }
});

apiRouter.post('/auth/complete-onboarding', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { preferredUnit, goal, nickname } = req.body;
    const validUnits = ['liters', 'milliliters', 'gallons', 'imperial_gallons', 'cubic_meters'];
    if (!preferredUnit || !validUnits.includes(preferredUnit)) {
      res.status(400).json({ error: 'Please choose a valid water measurement unit (Liters, Milliliters, US gallons, or Imperial gallons)' });
      return;
    }

    if (!goal || typeof goal.targetQuantity !== 'number' || goal.targetQuantity <= 0) {
      res.status(400).json({ error: 'Please enter a valid, positive water-saving target' });
      return;
    }

    const validPeriods = ['daily', 'weekly', 'monthly', 'custom'];
    const period = validPeriods.includes(goal.period) ? goal.period : 'daily';

    // Convert target from preferredUnit to canonical liters
    const targetLiters = convertToLiters(goal.targetQuantity, preferredUnit);
    if (targetLiters <= 0 || isNaN(targetLiters)) {
      res.status(400).json({ error: 'Invalid target quantity calculation' });
      return;
    }

    const result = db.completeUserOnboarding(req.user!.id, preferredUnit, nickname, {
      title: goal.title?.trim() || `${period.charAt(0).toUpperCase() + period.slice(1)} Water Conservation Target`,
      targetLiters,
      period,
      category: goal.category || 'all',
      startDate: goal.startDate,
      endDate: goal.endDate,
    });

    res.json({ user: sanitizeUser(result.user), goal: result.goal });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to complete setup wizard' });
  }
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('aquatrack_session');
  res.json({ success: true, message: 'Logged out successfully' });
});

apiRouter.get('/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: sanitizeUser(req.user!) });
});

apiRouter.put('/auth/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updates = req.body;
    const allowed = [
      'nickname',
      'displayName',
      'preferredLanguage',
      'preferredUnit',
      'theme',
      'autoRotateGreeting',
      'greetingRotateIntervalSec',
      'onboardingCompleted',
    ];

    const safeUpdates: Partial<UserEntity> = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        (safeUpdates as any)[key] = updates[key];
      }
    }

    const updated = db.updateUserProfile(req.user!.id, safeUpdates);
    res.json({ user: sanitizeUser(updated) });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Update failed' });
  }
});

apiRouter.post('/auth/forgot-password', (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const { token } = db.generateResetToken(email);
    // In a production environment with an email service, send an email.
    // For this development/demonstration deployment, we provide the recovery token directly.
    res.json({
      success: true,
      message: 'Password reset code generated. Use this code to reset your password.',
      resetToken: token,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Password reset request failed' });
  }
});

apiRouter.post('/auth/reset-password', (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'Valid token and new password (min 6 characters) are required' });
      return;
    }

    const updated = db.resetPasswordWithToken(token, newPassword);
    res.json({ success: true, user: sanitizeUser(updated) });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Password reset failed' });
  }
});

// --- WATER RECORDS CRUD ---
apiRouter.get('/records', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  let records = db.getRecordsByUser(req.user!.id);
  const { category, search, dateFrom, dateTo } = req.query;

  if (category && typeof category === 'string' && category !== 'all') {
    records = records.filter((r) => r.category === category);
  }
  if (dateFrom && typeof dateFrom === 'string') {
    records = records.filter((r) => r.date >= dateFrom);
  }
  if (dateTo && typeof dateTo === 'string') {
    records = records.filter((r) => r.date <= dateTo);
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    records = records.filter(
      (r) => r.activityName.toLowerCase().includes(q) || (r.notes && r.notes.toLowerCase().includes(q))
    );
  }

  res.json({ records });
});

apiRouter.post('/records', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = waterRecordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }

    const data = parsed.data;
    const quantityLiters = convertToLiters(data.quantity, data.unit);

    const record = db.createRecord(req.user!.id, {
      ...data,
      quantityLiters,
    });

    res.status(201).json({ record });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to save record' });
  }
});

apiRouter.put('/records/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = db.getRecordsByUser(req.user!.id).find((r) => r.id === id);
    if (!existing) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    const parsed = waterRecordSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }

    const updates = parsed.data;
    const quantity = updates.quantity !== undefined ? updates.quantity : existing.quantity;
    const unit = updates.unit !== undefined ? updates.unit : existing.unit;
    const quantityLiters = convertToLiters(quantity, unit);

    const updated = db.updateRecord(req.user!.id, id, {
      ...updates,
      quantityLiters,
    });

    res.json({ record: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update record' });
  }
});

apiRouter.delete('/records/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteRecord(req.user!.id, id);
  if (!success) {
    res.status(404).json({ error: 'Record not found' });
    return;
  }
  res.json({ success: true, message: 'Record deleted' });
});

// Offline batch sync
apiRouter.post('/records/sync', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      res.status(400).json({ error: 'Items array expected' });
      return;
    }

    const synced = db.batchSyncRecords(req.user!.id, items);
    res.json({ success: true, syncedCount: synced.length, records: synced });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Batch sync failed' });
  }
});

// CSV export
apiRouter.get('/records/export', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const records = db.getRecordsByUser(req.user!.id);
  const headers = ['ID', 'Date', 'Time', 'Activity', 'Category', 'Quantity', 'Unit', 'Quantity (Liters)', 'Measured/Estimated', 'Notes'];
  const rows = records.map((r) => [
    `"${r.id}"`,
    `"${r.date}"`,
    `"${r.time}"`,
    `"${r.activityName.replace(/"/g, '""')}"`,
    `"${r.category}"`,
    r.quantity,
    `"${r.unit}"`,
    r.quantityLiters,
    r.isEstimated ? 'Estimated' : 'Measured',
    `"${(r.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="AquaTrack-Export-${new Date().toISOString().split('T')[0]}.csv"`);
  res.send(csvContent);
});

// --- ANALYTICS ---
apiRouter.get('/analytics', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const records = db.getRecordsByUser(req.user!.id);
  const stats = calculateSummaryStats(records);
  const dates = records.map((r) => r.date);
  const currentStreak = calculateStreak(dates);

  // Group by day for the past 14 days
  const dailyBreakdown: Record<string, number> = {};
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    dailyBreakdown[key] = 0;
  }
  for (const r of records) {
    if (dailyBreakdown[r.date] !== undefined) {
      dailyBreakdown[r.date] += r.quantityLiters;
    }
  }

  // Category breakdown
  const categoryTotals: Record<string, number> = {};
  let measuredTotal = 0;
  let estimatedTotal = 0;

  for (const r of records) {
    categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.quantityLiters;
    if (r.isEstimated) {
      estimatedTotal += r.quantityLiters;
    } else {
      measuredTotal += r.quantityLiters;
    }
  }

  res.json({
    stats,
    currentStreak,
    dailyChartData: Object.entries(dailyBreakdown).map(([date, liters]) => ({
      date,
      liters: Math.round(liters * 10) / 10,
    })),
    categoryTotals,
    measuredVsEstimated: [
      { name: 'Measured Readings', value: Math.round(measuredTotal * 10) / 10 },
      { name: 'Estimated Usage', value: Math.round(estimatedTotal * 10) / 10 },
    ],
  });
});

// --- GOALS ---
apiRouter.get('/goals', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const goals = db.getGoals(req.user!.id);
  res.json({ goals });
});

apiRouter.post('/goals', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const parsed = goalSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }
    const goal = db.createGoal(req.user!.id, parsed.data as any);
    res.status(201).json({ goal });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create goal' });
  }
});

apiRouter.put('/goals/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const goal = db.updateGoal(req.user!.id, req.params.id, req.body);
    res.json({ goal });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update goal' });
  }
});

apiRouter.delete('/goals/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteGoal(req.user!.id, req.params.id);
  res.json({ success });
});

// --- REMINDERS ---
apiRouter.get('/reminders', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const reminders = db.getReminders(req.user!.id);
  res.json({ reminders });
});

apiRouter.post('/reminders', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const reminder = db.createReminder(req.user!.id, req.body);
  res.status(201).json({ reminder });
});

apiRouter.put('/reminders/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const reminder = db.updateReminder(req.user!.id, req.params.id, req.body);
    res.json({ reminder });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update reminder' });
  }
});

apiRouter.delete('/reminders/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteReminder(req.user!.id, req.params.id);
  res.json({ success });
});

// --- ACHIEVEMENTS ---
apiRouter.get('/achievements', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const unlocked = db.getAchievements(req.user!.id);
  res.json({ unlocked });
});

// --- GAMES ---
apiRouter.get('/games/scores', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const scores = db.getGameScores(req.user!.id);
  res.json({ scores });
});

apiRouter.post('/games/score', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { gameId, score, stars } = req.body;
  if (!gameId || typeof score !== 'number') {
    res.status(400).json({ error: 'Valid gameId and score required' });
    return;
  }
  const result = db.saveGameScore(req.user!.id, gameId, score, stars || 1);
  res.json({ result });
});

// --- LAWS & LEARNING ---
apiRouter.get('/laws', (req: Request, res: Response) => {
  res.json({ laws: PHILIPPINE_LAWS });
});

apiRouter.get('/learning/lessons', (req: Request, res: Response) => {
  res.json({ lessons: LESSONS });
});

apiRouter.get('/learning/progress', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const progress = db.getLessonProgress(req.user!.id);
  const bookmarks = db.getBookmarks(req.user!.id);
  res.json({ progress, bookmarks });
});

apiRouter.post('/learning/progress', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { lessonId, score } = req.body;
  if (!lessonId) {
    res.status(400).json({ error: 'lessonId is required' });
    return;
  }
  const result = db.saveLessonProgress(req.user!.id, lessonId, score);
  res.json({ result });
});

apiRouter.post('/bookmarks/toggle', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { itemType, itemId } = req.body;
  if (!itemType || !itemId) {
    res.status(400).json({ error: 'itemType and itemId required' });
    return;
  }
  const isBookmarked = db.toggleBookmark(req.user!.id, itemType, itemId);
  res.json({ isBookmarked });
});

// Helper: Generate structured, scientifically verified educational answer for offline / unconfigured mode
function generateEducationalFallback(query: string, stats: any, nickname: string): string {
  const lower = query.toLowerCase();
  let advice = '';

  if (lower.includes('9275') || lower.includes('clean water act')) {
    advice = `### Republic Act No. 9275 (Philippine Clean Water Act of 2004)
• **Statutory Mandate:** Formulates a comprehensive national framework for water quality management, prevention of toxic contamination, and civil sanitation across all Philippine water bodies.
• **Primary Regulatory Agency:** Administered and enforced by the Department of Environment and Natural Resources - Environmental Management Bureau (DENR-EMB).
• **Wastewater Discharge Permits:** All industrial, commercial, and agricultural facilities must secure an official Wastewater Discharge Permit before releasing effluent into rivers, lakes, or coastal marine areas.
• **Domestic Community Impact:** Directs local government units (LGUs) and water concessionaires to establish municipal septage and sewerage facilities, mandating periodic septic tank desludging. Fines for unlawful industrial toxic discharges range from ₱10,000 up to ₱200,000 per day of violation.`;
  } else if (lower.includes('1067') || lower.includes('water code')) {
    advice = `### Presidential Decree No. 1067 (Water Code of the Philippines - 1976)
• **Statutory Mandate:** Establishes the fundamental legal doctrine that all natural waters within Philippine territory belong to the State and cannot be acquired through private prescription.
• **Water Permit Requirement:** Administered primarily by the National Water Resources Board (NWRB). Commercial, agricultural, and industrial extractions require a formal Water Permit; only hand-carried domestic drinking extraction is exempt.
• **Priority Hierarchy:** In times of emergency, severe drought, or municipal shortages, domestic human water needs take absolute legal precedence over irrigation, mining, or power generation.`;
  } else if (lower.includes('9003') || lower.includes('solid waste')) {
    advice = `### Republic Act No. 9003 (Ecological Solid Waste Management Act of 2000)
• **Direct Water Nexus:** 80% of marine and river plastic pollution originates from uncollected land-based solid waste reaching storm drains, esteros, and rivers.
• **LGU Enforcement:** Mandates segregation at source (biodegradable, recyclable, residual, special) and requires barangays to operate Materials Recovery Facilities (MRFs).
• **Waterway Protection:** Strictly penalizes open dumping, littering, and burning near riverbanks, creeks, and shorelines to prevent leachate and microplastics from contaminating drinking aquifers.`;
  } else if (lower.includes('11038') || lower.includes('enipas') || lower.includes('protected area')) {
    advice = `### Republic Act No. 11038 (Expanded NIPAS Act of 2018)
• **Watershed & Marine Sanctuaries:** Strengthens statutory protection for 94 national parks, marine reserves, and critical watershed sanctuaries (including Tubbataha Reefs and Apo Reef).
• **Strict No-Take Zones:** Prohibits destructive fishing, toxic chemical discharge, and illegal extraction within designated protected marine habitats.
• **Ecosystem Service Value:** Healthy coral reefs and mangrove forests act as natural storm surge breakwaters and provide nurseries for 70% of Philippine coastal fisheries.`;
  } else if (lower.includes('shower') || lower.includes('bath')) {
    advice = `### Optimizing Shower and Bathing Water Efficiency
• **5-Minute Shower Sprint:** Standard showerheads output 9 to 12 Liters per minute. Shortening a shower from 10 minutes down to 5 minutes conserves 45 to 60 Liters every single day!
• **Low-Flow Aerators:** Installing a modern 1.5–2.0 GPM aerating showerhead cuts flow by 40% while preserving pressure and spray comfort.
• **The Filipino "Tabo at Timba" Practice:** Using a calibrated pail (timba) and dipper (tabo) gives precise visual control over volume, typically consuming only 20–30 Liters per bath compared to 70–100 Liters for an unmetered long shower.`;
  } else if (lower.includes('leak') || lower.includes('toilet') || lower.includes('pipe')) {
    advice = `### Household Leak Audit & Toilet Testing Protocol
• **The 15-Minute Dye Test:** Put 5–10 drops of food coloring or dark coffee into the toilet tank (cistern). Wait 15 minutes without flushing. If color appears in the toilet bowl, your rubber flapper seal is degraded and leaking.
• **The Municipal Meter Sweep Test:** Turn off every tap, valve, and washing appliance. Inspect your municipal water meter's low-flow indicator or sweep hand. If it advances after 15 minutes with all fixtures closed, you have a concealed wall or underground pipe leak.
• **Faucet Drips:** A single faucet dripping once per second squanders over 11,000 Liters of treated potable water per year. Replacing an inexpensive rubber O-ring or cartridge fixes it in minutes.`;
  } else if (lower.includes('dish') || lower.includes('kitchen') || lower.includes('cook') || lower.includes('brush') || lower.includes('teeth')) {
    advice = `### Kitchen & Everyday Tap Conservation Protocols
• **Two-Basin Dishwashing:** Instead of running the tap continuously, fill one basin with warm soapy water for washing and a second basin with clean water for rinsing. This saves 50–70 Liters per wash!
• **Toothbrushing Habit:** Shutting off the faucet while brushing teeth for 2 minutes conserves up to 12 Liters of potable water every single time.
• **Produce Rinsing:** Wash vegetables and fruits in a large bowl, and reuse the rinse water for household potted plants or garden soil.`;
  } else if (lower.includes('laundry') || lower.includes('washing machine') || lower.includes('rinse')) {
    advice = `### Sustainable Laundry Practices
• **Full Loads Only:** Run laundry machines only when full, matching water levels to cycle size.
• **Graywater ("Banlaw") Reclamation:** Collect second and third rinse water from hand-washing or machine cycles to scrub outdoor tiles, wash car tires, or flush gravity toilets.
• **Eco Detergents:** Use biodegradable, low-phosphate laundry detergents to prevent phosphorus eutrophication in receiving streams.`;
  } else {
    advice = `### Core Domestic Conservation Strategy
• **Turn Off Taps While Lathering:** Shut off faucets while brushing teeth, soaping hands, or washing dishes to save 6–12 Liters per session.
• **Conduct Regular Leak Audits:** Inspect toilet flappers and outdoor hose bibbs monthly to stop silent, wasteful leaks.
• **Maximize Full Loads:** Run laundry and dish washing only with full loads, and reuse gray rinse water (banlaw) for scrubbing garage floors or watering ornamental garden beds.
• **Rainwater Harvesting:** Collect tropical rainfall runoff in clean, covered drums fitted with mosquito screening for zero-cost outdoor cleaning and irrigation.`;
  }

  return `[AquaTrack AI Assistant — Verified Environmental Knowledge Base]

Hello ${nickname}! Here is verified water conservation and legal guidance tailored to your account:

${advice}

📊 **Your Authenticated AquaTrack Statistics:**
• Today's Logged Consumption: ${stats.todayTotalLiters} Liters
• Past 7 Days Consumption: ${stats.weekTotalLiters} Liters
• Daily Average: ${stats.averageDailyLiters} Liters/day
• Logged Activities: ${stats.totalRecordsCount} entries
• WHO Domestic Benchmark: 100 L/person/day

*Tip: You can log new usage records in the Tracking section, explore Philippine environmental jurisprudence, or play the 10 conservation games!*`;
}

// --- AI ASSISTANT (Gemini API via @google/genai with Multi-turn & Fast Fallback) ---
apiRouter.post('/ai/chat', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message text is required' });
    return;
  }

  // Get authenticated user context to provide personalized responses
  const userRecords = db.getRecordsByUser(req.user!.id);
  const stats = calculateSummaryStats(userRecords);
  const nickname = req.user?.nickname || 'Friend';
  const preferredUnit = req.user?.preferredUnit || 'liters';
  const userGoals = db.getGoals(req.user!.id);
  const activeGoal = userGoals.find((g) => g.active && g.period === 'daily') || userGoals[0];

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    res.json({
      reply: 'The Google Gemini API key is currently not configured on this server. To enable real conversational AI capabilities, please configure GEMINI_API_KEY in the application secrets.',
      isLiveAI: false,
    });
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `You are AquaTrack AI, an intelligent, versatile, and conversational assistant for the AquaTrack platform (Tagline: "Track Every Drop. Protect Every Tomorrow.").

Core Directives:
1. Complete General Conversational Assistant:
   - You can converse naturally and cheerfully, answer general greetings ("Hello!", "How are you?"), help write content (such as school announcements, club flyers, notices, awareness campaign slogans), explain complex concepts in simple terms (e.g., weather vs climate, hydrological cycle, ocean acidification), and answer ordinary general knowledge questions across any topic.
2. Environmental & Water Authority:
   - You specialize in water conservation, leak audits, watershed protection, and Philippine environmental jurisprudence (including RA 9275 Clean Water Act, PD 1067 Water Code, RA 9003 Solid Waste Management, ENIPAS RA 11038, DRRM RA 10121).
3. Authenticated User Profile:
   - Nickname: "${nickname}"
   - Preferred Water Unit: "${preferredUnit}"
   - Preferred Language: "${req.user?.preferredLanguage || 'en'}"
4. User's Real Water Tracking Data (from verified database):
   - Total records logged: ${stats.totalRecordsCount}
   - Today's recorded consumption: ${stats.todayTotalLiters} Liters (${formatWaterVolume(stats.todayTotalLiters, preferredUnit)})
   - Past 7 days consumption: ${stats.weekTotalLiters} Liters (${formatWaterVolume(stats.weekTotalLiters, preferredUnit)})
   - Active Goal: ${activeGoal ? `${formatWaterVolume(activeGoal.targetLiters, preferredUnit)} (${activeGoal.title})` : 'No active goal set yet'}
   ${userRecords.length === 0 ? 'CRITICAL REQUIREMENT: This user has NO water consumption records logged yet (0 records). If they ask about their personal consumption or logs, you MUST honestly state that they have no records logged yet, and encourage them to record their first water activity using the "+ Record Water Usage" button on their dashboard. Do NOT invent fake consumption history or pretend they have records.' : `Recent activities: ${userRecords.slice(0, 5).map((r) => `${r.date}: ${r.activityName} (${r.quantity} ${r.unit})`).join(', ')}`}
5. When the user asks normal, general questions (e.g. "Hello, how are you?", "Help me write a school announcement", "What is the difference between weather and climate?"), answer them directly and engagingly. Do not force water statistics into everyday general conversation unless relevant.
6. When discussing water amounts, ALWAYS display quantities in their preferred unit (${preferredUnit}).
7. Maintain multi-turn conversational context seamlessly.`;

    // Construct multi-turn contents
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-8)) {
        if (turn.text && typeof turn.text === 'string') {
          contents.push({
            role: turn.role === 'model' || turn.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: turn.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const tryGenerate = async (modelName: string) => {
      return Promise.race([
        ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout calling model ${modelName}`)), 10000)
        ),
      ]);
    };

    let chatResponse: any;
    try {
      chatResponse = await tryGenerate('gemini-3.8-flash');
    } catch (err1: any) {
      console.warn('[AquaTrack AI] gemini-3.8-flash fallback:', err1?.message);
      try {
        chatResponse = await tryGenerate('gemini-flash-latest');
      } catch (err2: any) {
        console.warn('[AquaTrack AI] gemini-flash-latest fallback:', err2?.message);
        try {
          chatResponse = await tryGenerate('gemini-3.1-flash-lite');
        } catch (err3: any) {
          console.warn('[AquaTrack AI] gemini-3.1-flash-lite fallback:', err3?.message);
        }
      }
    }

    if (chatResponse && chatResponse.text) {
      res.json({ reply: chatResponse.text, isLiveAI: true });
      return;
    }

    // Contextual fallback response if upstream API is temporarily unreachable
    const lowerMsg = message.toLowerCase();
    let fallbackReply = `Hello ${nickname}! I'm AquaTrack AI. `;
    if (lowerMsg.includes('photo') || lowerMsg.includes('plant')) {
      fallbackReply += `Photosynthesis is the fundamental biological process where plants convert sunlight, carbon dioxide, and water (H₂O) into glucose (energy) and oxygen (O₂). Water is essential because its photolysis provides electrons to drive the light reactions, while transpiration maintains cell turgor and transports minerals throughout the plant.`;
    } else if (lowerMsg.includes('school') || lowerMsg.includes('announcement') || lowerMsg.includes('draft')) {
      fallbackReply += `Here is a school water conservation announcement draft:

📢 **AquaTrack Campus Conservation Announcement**
"Attention students and faculty! In observance of Water Action Week, AquaTrack reminds everyone that every drop counts. Please ensure all campus bathroom faucets are shut completely, report dripping water fountains to school maintenance, and bring reusable water tumblers. Small collective habits protect our regional aquifers! 'Track Every Drop. Protect Every Tomorrow.'"`;
    } else if (lowerMsg.includes('how much') || lowerMsg.includes('consumption') || lowerMsg.includes('my water') || lowerMsg.includes('today')) {
      if (userRecords.length === 0) {
        fallbackReply += `You currently have 0 recorded water logs in your account. To start tracking your personal water usage and see detailed analytics, click the "+ Record Water Usage" button on your dashboard to log your first activity (like showering, laundry, or cooking)!`;
      } else {
        fallbackReply += `You have logged ${stats.totalRecordsCount} water activities. Your recorded usage for today is ${formatWaterVolume(stats.todayTotalLiters, preferredUnit)}, and your 7-day total is ${formatWaterVolume(stats.weekTotalLiters, preferredUnit)}. Keep up the great tracking!`;
      }
    } else if (lowerMsg.includes('law') || lowerMsg.includes('ra 9275') || lowerMsg.includes('clean water') || lowerMsg.includes('penalty')) {
      fallbackReply += `Under Republic Act No. 9275 (The Philippine Clean Water Act of 2004), discharging untreated wastewater or hazardous chemical effluent into water bodies carries administrative fines ranging from ₱10,000 to ₱200,000 per day of violation until rectified, along with potential criminal penalties under Section 28 for gross negligence.`;
    } else {
      fallbackReply += `I am here to assist with water management questions, calculating water volume in ${preferredUnit}, reviewing Philippine environmental statutes, or drafting conservation materials for your community. How can I assist you next?`;
    }

    res.json({
      reply: fallbackReply,
      isLiveAI: false,
    });
  } catch (error: any) {
    console.error('[AquaTrack AI] Gemini API Error:', error?.message);
    res.status(500).json({
      error: `Gemini AI service unavailable: ${error?.message || 'Failed to process request'}. Please retry.`,
      isLiveAI: false,
    });
  }
});

// --- COMMUNITY CHALLENGES & TIPS ---
apiRouter.get('/community', (req: Request, res: Response) => {
  res.json({
    challenges: [
      {
        id: 'challenge-1',
        title: 'The 5-Minute Shower Sprint',
        description: 'Cap your daily showers at 5 minutes for 5 straight days to save approximately 45 liters per day.',
        participants: 128,
        category: 'Personal Habit',
        badge: 'Shower Sprinter',
      },
      {
        id: 'challenge-2',
        title: 'Zero Sink-Running Toothbrush Week',
        description: 'Never leave the bathroom tap flowing while brushing teeth. Use a cup to rinse.',
        participants: 215,
        category: 'Household',
        badge: 'Tap Sentry',
      },
      {
        id: 'challenge-3',
        title: 'Master Leak Detective Patrol',
        description: 'Conduct a thorough home leak check: toilet tank dye test, outdoor hose bibbs, and kitchen faucet washers.',
        participants: 94,
        category: 'Audit & Maintenance',
        badge: 'Leak Inspector',
      },
    ],
    tips: [
      {
        id: 'tip-1',
        author: 'AquaTrack Science Team',
        tip: 'Collect vegetable washing rinse water to nourish outdoor potted plants with organic minerals.',
        likes: 42,
      },
      {
        id: 'tip-2',
        author: 'Marian Ela J. Alibadbad',
        tip: 'Check your water meter before sleeping. If the red indicator needle spins while all taps are off, you have a hidden leak.',
        likes: 89,
      },
      {
        id: 'tip-3',
        author: 'Eco Youth PH',
        tip: 'Only run your washing machine with full loads to optimize water and electricity efficiency simultaneously.',
        likes: 56,
      },
    ],
  });
});

// --- PUBLIC WATER ISSUES & ENVIRONMENTAL NEWS ROUTES ---
apiRouter.get('/news', (req: Request, res: Response) => {
  try {
    const { search, category, region, page, limit } = req.query;
    const feed = waterNewsService.getNewsFeed({
      search: typeof search === 'string' ? search : undefined,
      category: typeof category === 'string' ? category : undefined,
      region: typeof region === 'string' ? region : undefined,
      page: page ? parseInt(String(page), 10) : undefined,
      limit: limit ? parseInt(String(limit), 10) : undefined,
    });
    res.json(feed);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve news feed', details: err.message });
  }
});

apiRouter.post('/news/refresh', async (req: Request, res: Response) => {
  try {
    const result = await waterNewsService.refreshNewsSources();
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to refresh news feed', details: err.message });
  }
});

apiRouter.get('/news/stats', (req: Request, res: Response) => {
  try {
    const stats = waterNewsService.getStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to get news stats' });
  }
});
