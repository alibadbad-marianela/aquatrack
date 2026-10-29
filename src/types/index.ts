export type WaterCategory =
  | 'drinking_cooking'
  | 'bathing_showering'
  | 'toilet'
  | 'laundry'
  | 'dishwashing'
  | 'cleaning'
  | 'gardening_plants'
  | 'other';

export type WaterUnit = 'liters' | 'milliliters' | 'gallons' | 'imperial_gallons' | 'cubic_meters';

export type GoalPeriod = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface WaterRecord {
  id: string;
  userId: string;
  activityName: string;
  category: WaterCategory;
  quantity: number;
  unit: WaterUnit;
  quantityLiters: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  isEstimated: boolean;
  createdAt: string;
  updatedAt: string;
  syncStatus?: 'synced' | 'pending' | 'local_only' | 'failed';
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  nickname: string;
  preferredLanguage: string;
  preferredUnit: WaterUnit;
  theme: 'light' | 'dark' | 'system';
  autoRotateGreeting: boolean;
  greetingRotateIntervalSec: number;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetLiters: number;
  period: 'daily' | 'weekly' | 'monthly' | 'custom';
  category?: WaterCategory | 'all';
  active: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  time: string; // HH:mm
  days: string[]; // ['Mon', 'Tue', ...]
  enabled: boolean;
  type: 'log_usage' | 'check_goals' | 'water_saving_habit' | 'leak_check';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'tracking' | 'streak' | 'games' | 'learning' | 'conservation';
}

export interface GameScore {
  userId?: string;
  gameId: string;
  highScore: number;
  stars: number;
  playedCount: number;
  lastPlayedAt: string;
}

export interface PhilippineLaw {
  id: string;
  instrumentType: 'Republic Act' | 'Presidential Decree';
  number: string;
  officialTitle: string;
  commonName: string;
  year: number;
  summary: string;
  waterRelevance: string;
  keyProvisions: string[];
  responsibleAgencies: string[];
  officialSourceUrl: string;
  lastReviewedDate: string;
  topic: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  readTimeMinutes: number;
  summary: string;
  content: string;
  practicalTips: string[];
  quizQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CreatorInfo {
  name: string;
  academicInfo: string;
  email: string;
  contactNumber: string;
  school: string;
  gradeLevel: string;
  strand: string;
  section: string;
  motivation: string;
}

export type NewsCategory =
  | 'all'
  | 'philippines_conservation'
  | 'scarcity_drought'
  | 'river_pollution'
  | 'ocean_coral_reefs'
  | 'climate_research'
  | 'household_efficiency';

export interface WaterNewsItem {
  id: string;
  headline: string;
  summary: string;
  publisher: string;
  publishedAt: string; // YYYY-MM-DD
  retrievedAt: string; // ISO
  category: NewsCategory;
  categoryLabel: string;
  sourceUrl: string;
  imageUrl?: string;
  region: 'philippines' | 'global';
  tags: string[];
}

export interface NewsFeedResponse {
  articles: WaterNewsItem[];
  total: number;
  page: number;
  totalPages: number;
  lastUpdated: string;
  isStale?: boolean;
  status: 'live' | 'cached' | 'offline_resilient';
}
