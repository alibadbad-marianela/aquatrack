import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertToLiters,
  convertFromLiters,
  formatWaterVolume,
  calculateGoalProgress,
  calculateStreak,
  calculateSummaryStats
} from './waterCalculations';

test('convertToLiters handles all standard units correctly', () => {
  assert.equal(convertToLiters(10, 'liters'), 10);
  assert.equal(convertToLiters(1000, 'milliliters'), 1);
  assert.equal(convertToLiters(1, 'gallons'), 3.79);
  assert.equal(convertToLiters(2, 'cubic_meters'), 2000);
  assert.equal(convertToLiters(-5, 'liters'), 0);
});

test('convertFromLiters handles conversions back accurately', () => {
  assert.equal(convertFromLiters(10, 'liters'), 10);
  assert.equal(convertFromLiters(1, 'milliliters'), 1000);
  assert.equal(convertFromLiters(3.78541, 'gallons'), 1);
  assert.equal(convertFromLiters(2000, 'cubic_meters'), 2);
});

test('formatWaterVolume outputs clear readable strings', () => {
  assert.equal(formatWaterVolume(50, 'liters'), '50 L');
  assert.equal(formatWaterVolume(1, 'milliliters'), '1,000 mL');
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
