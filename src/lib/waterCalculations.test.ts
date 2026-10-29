import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertToLiters,
  convertFromLiters,
  formatWaterVolume,
  calculateGoalProgress,
  calculateStreak,
  calculateSummaryStats,
  getUnitLabel,
  getUnitFullName,
  getUnitDescription,
} from './waterCalculations';

test('convertToLiters handles all standard units correctly including imperial gallons', () => {
  assert.equal(convertToLiters(10, 'liters'), 10);
  assert.equal(convertToLiters(1000, 'milliliters'), 1);
  assert.equal(convertToLiters(1, 'gallons'), 3.785);
  assert.equal(convertToLiters(1, 'imperial_gallons'), 4.546);
  assert.equal(convertToLiters(2, 'cubic_meters'), 2000);
  assert.equal(convertToLiters(-5, 'liters'), 0);
});

test('convertFromLiters handles conversions back accurately', () => {
  assert.equal(convertFromLiters(10, 'liters'), 10);
  assert.equal(convertFromLiters(1, 'milliliters'), 1000);
  assert.equal(convertFromLiters(3.78541, 'gallons'), 1);
  assert.equal(convertFromLiters(4.54609, 'imperial_gallons'), 1);
  assert.equal(convertFromLiters(2000, 'cubic_meters'), 2);
});

test('formatWaterVolume outputs clear readable strings with unit labels', () => {
  assert.equal(formatWaterVolume(50, 'liters'), '50 L');
  assert.equal(formatWaterVolume(1, 'milliliters'), '1,000 mL');
  assert.equal(formatWaterVolume(3.78541, 'gallons'), '1 US gal');
  assert.equal(formatWaterVolume(4.54609, 'imperial_gallons'), '1 Imp gal');
});

test('getUnitLabel and getUnitFullName provide descriptive titles', () => {
  assert.equal(getUnitLabel('liters'), 'L');
  assert.equal(getUnitLabel('imperial_gallons'), 'Imp gal');
  assert.equal(getUnitFullName('gallons'), 'US Gallons (US gal)');
  assert.equal(getUnitFullName('imperial_gallons'), 'Imperial Gallons (Imp gal)');
  assert.ok(getUnitDescription('imperial_gallons').includes('Commonwealth'));
});

test('calculateGoalProgress tracks consumption and remaining water correctly', () => {
  const under = calculateGoalProgress(100, 45);
  assert.equal(under.percentage, 45);
  assert.equal(under.remaining, 55);
  assert.equal(under.isExceeded, false);

  const exceeded = calculateGoalProgress(100, 120);
  assert.equal(exceeded.percentage, 100);
  assert.equal(exceeded.remaining, 0);
  assert.equal(exceeded.isExceeded, true);

  const zeroTarget = calculateGoalProgress(0, 50);
  assert.equal(zeroTarget.percentage, 0);
  assert.equal(zeroTarget.remaining, 0);
});

test('calculateSummaryStats returns honest zero metrics for new users with no records', () => {
  const emptyStats = calculateSummaryStats([], '2026-10-29T12:00:00Z');
  assert.equal(emptyStats.todayTotalLiters, 0);
  assert.equal(emptyStats.weekTotalLiters, 0);
  assert.equal(emptyStats.monthTotalLiters, 0);
  assert.equal(emptyStats.averageDailyLiters, 0);
  assert.equal(emptyStats.totalRecordsCount, 0);
});

test('calculateStreak counts consecutive logged days', () => {
  const refDate = '2026-10-24T12:00:00Z';
  const threeDays = ['2026-10-24', '2026-10-23', '2026-10-22'];
  assert.equal(calculateStreak(threeDays, refDate), 3);

  const broken = ['2026-10-24', '2026-10-22']; // missed 23rd
  assert.equal(calculateStreak(broken, refDate), 1);

  const old = ['2026-10-10'];
  assert.equal(calculateStreak(old, refDate), 0);
});

test('calculateSummaryStats computes daily, weekly, monthly and average totals', () => {
  const refDate = '2026-10-24T12:00:00Z';
  const records = [
    { quantityLiters: 20, date: '2026-10-24' },
    { quantityLiters: 30, date: '2026-10-24' },
    { quantityLiters: 50, date: '2026-10-20' },
    { quantityLiters: 100, date: '2026-10-01' }, // 23 days ago (in month)
    { quantityLiters: 200, date: '2026-08-01' }, // older than 30 days
  ];

  const stats = calculateSummaryStats(records, refDate);
  assert.equal(stats.todayTotalLiters, 50);
  assert.equal(stats.weekTotalLiters, 100); // 20 + 30 + 50
  assert.equal(stats.monthTotalLiters, 200); // 20 + 30 + 50 + 100
  assert.equal(stats.totalRecordsCount, 5);
});
