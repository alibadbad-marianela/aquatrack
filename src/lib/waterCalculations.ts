import { WaterCategory, WaterUnit } from '../types';

export const UNIT_CONVERSIONS: Record<WaterUnit, number> = {
  liters: 1,
  milliliters: 0.001,
  gallons: 3.78541,
  cubic_meters: 1000,
};

export const CATEGORY_LABELS: Record<WaterCategory, { label: string; icon: string; typicalLiters: number }> = {
  drinking_cooking: { label: 'Drinking & Cooking', icon: 'CupSoda', typicalLiters: 10 },
  bathing_showering: { label: 'Bathing & Showering', icon: 'ShowerHead', typicalLiters: 65 },
  toilet: { label: 'Toilet Use', icon: 'Bath', typicalLiters: 35 },
  laundry: { label: 'Laundry', icon: 'Shirt', typicalLiters: 50 },
  dishwashing: { label: 'Dishwashing', icon: 'UtensilsCrossed', typicalLiters: 20 },
  cleaning: { label: 'Cleaning & Mopping', icon: 'Sparkles', typicalLiters: 15 },
  gardening_plants: { label: 'Gardening & Plants', icon: 'Flower2', typicalLiters: 25 },
  other: { label: 'Other Household', icon: 'Droplets', typicalLiters: 10 },
};

export function convertToLiters(quantity: number, unit: WaterUnit): number {
  if (quantity < 0 || isNaN(quantity)) return 0;
  const factor = UNIT_CONVERSIONS[unit] || 1;
  return Math.round(quantity * factor * 100) / 100;
}

export function convertFromLiters(liters: number, targetUnit: WaterUnit): number {
  if (liters < 0 || isNaN(liters)) return 0;
  const factor = UNIT_CONVERSIONS[targetUnit] || 1;
  return Math.round((liters / factor) * 100) / 100;
}

export function formatWaterVolume(liters: number, unit: WaterUnit = 'liters'): string {
  const converted = convertFromLiters(liters, unit);
  const unitSuffix =
    unit === 'liters' ? 'L' :
    unit === 'milliliters' ? 'mL' :
    unit === 'gallons' ? 'gal' : 'm³';
  return `${converted.toLocaleString('en-US', { maximumFractionDigits: 1 })} ${unitSuffix}`;
}

export interface SummaryStats {
  todayTotalLiters: number;
  weekTotalLiters: number;
  monthTotalLiters: number;
  averageDailyLiters: number;
  totalRecordsCount: number;
}

export function calculateSummaryStats(
  records: Array<{ quantityLiters: number; date: string }>,
  referenceDateStr?: string
): SummaryStats {
  const refDate = referenceDateStr ? new Date(referenceDateStr) : new Date();
  const todayStr = refDate.toISOString().split('T')[0];

  // 7 days ago
  const sevenDaysAgo = new Date(refDate);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

  // 30 days ago
  const thirtyDaysAgo = new Date(refDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

  let todayTotal = 0;
  let weekTotal = 0;
  let monthTotal = 0;

  const activeDates = new Set<string>();

  for (const r of records) {
    if (r.date === todayStr) {
      todayTotal += r.quantityLiters;
    }
    if (r.date >= sevenDaysAgoStr && r.date <= todayStr) {
      weekTotal += r.quantityLiters;
    }
    if (r.date >= thirtyDaysAgoStr && r.date <= todayStr) {
      monthTotal += r.quantityLiters;
    }
    activeDates.add(r.date);
  }

  const daysCount = Math.max(1, activeDates.size);
  const totalLitersAllTime = records.reduce((sum, r) => sum + r.quantityLiters, 0);
  const averageDailyLiters = Math.round((totalLitersAllTime / daysCount) * 10) / 10;

  return {
    todayTotalLiters: Math.round(todayTotal * 10) / 10,
    weekTotalLiters: Math.round(weekTotal * 10) / 10,
    monthTotalLiters: Math.round(monthTotal * 10) / 10,
    averageDailyLiters,
    totalRecordsCount: records.length,
  };
}

export function calculateGoalProgress(
  targetLiters: number,
  consumedLiters: number
): { percentage: number; remaining: number; isExceeded: boolean } {
  if (targetLiters <= 0) return { percentage: 0, remaining: 0, isExceeded: false };
  const percentage = Math.round((consumedLiters / targetLiters) * 100);
  const remaining = Math.max(0, Math.round((targetLiters - consumedLiters) * 10) / 10);
  const isExceeded = consumedLiters > targetLiters;
  return { percentage: Math.min(percentage, 100), remaining, isExceeded };
}

export function calculateStreak(dates: string[], referenceDateStr?: string): number {
  if (!dates || dates.length === 0) return 0;

  const uniqueSortedDates = Array.from(new Set(dates)).sort().reverse();
  const today = referenceDateStr ? new Date(referenceDateStr) : new Date();
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Must have logged today or yesterday to maintain active streak
  const mostRecent = uniqueSortedDates[0];
  if (mostRecent !== todayStr && mostRecent !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let curr = new Date(mostRecent);

  for (const dateStr of uniqueSortedDates) {
    const expectedStr = curr.toISOString().split('T')[0];
    if (dateStr === expectedStr) {
      streak++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
