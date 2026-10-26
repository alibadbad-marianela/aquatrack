import React, { useState, useMemo } from 'react';
import { WaterRecord, UserProfile, Goal, WaterUnit } from '../../types';
import { formatWaterVolume, CATEGORY_LABELS } from '../../lib/waterCalculations';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Droplets,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

interface CalendarViewProps {
  records: WaterRecord[];
  user: UserProfile;
  goals: Goal[];
  onAddNewForDate: (dateStr: string) => void;
  onEditRecord: (record: WaterRecord) => void;
  onDeleteRecord: (id: string) => Promise<void>;
  preferredUnit?: WaterUnit;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  records,
  user,
  goals,
  onAddNewForDate,
  onEditRecord,
  onDeleteRecord,
  preferredUnit = 'liters',
}) => {
  // Current visible month/year
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Selected date string (YYYY-MM-DD), default to today
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const primaryDailyGoal = useMemo(() => {
    return goals.find((g) => g.active && g.period === 'daily') || goals[0];
  }, [goals]);

  // Aggregate records by date
  const recordsByDate = useMemo(() => {
    const map = new Map<string, { totalLiters: number; records: WaterRecord[] }>();
    records.forEach((rec) => {
      const existing = map.get(rec.date) || { totalLiters: 0, records: [] };
      existing.totalLiters += rec.quantityLiters;
      existing.records.push(rec);
      map.set(rec.date, existing);
    });
    return map;
  }, [records]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month and total days
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  // Records for currently selected date
  const selectedDayData = recordsByDate.get(selectedDate) || { totalLiters: 0, records: [] };
  const selectedDateObj = new Date(selectedDate + 'T00:00:00');
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    let monthTotal = 0;
    let daysWithRecords = 0;
    let daysUnderGoal = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${prefix}-${String(d).padStart(2, '0')}`;
      const data = recordsByDate.get(dStr);
      if (data && data.records.length > 0) {
        monthTotal += data.totalLiters;
        daysWithRecords++;
        if (primaryDailyGoal && data.totalLiters <= primaryDailyGoal.targetLiters) {
          daysUnderGoal++;
        }
      }
    }

    return {
      monthTotal,
      daysWithRecords,
      daysUnderGoal,
      avgPerActiveDay: daysWithRecords > 0 ? Math.round(monthTotal / daysWithRecords) : 0,
    };
  }, [year, month, daysInMonth, recordsByDate, primaryDailyGoal]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteRecord(id);
    } finally {
      setDeletingId(null);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header and month controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              Water Activity Calendar
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track daily consumption patterns, view recorded logs by date, and schedule meter audits
          </p>
        </div>

        {/* Navigation & Today CTA */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleJumpToToday}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102338] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            Today
          </button>

          <div className="flex items-center bg-white dark:bg-[#102338] border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white min-w-[130px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Month Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Month Total</p>
          <p className="text-xl sm:text-2xl font-bold font-data text-cyan-600 dark:text-cyan-400 mt-1">
            {formatWaterVolume(monthlyStats.monthTotal, preferredUnit)}
          </p>
          <span className="text-[10px] text-slate-400">Total logged in {monthNames[month]}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Logged Days</p>
          <p className="text-xl sm:text-2xl font-bold font-data text-blue-600 dark:text-blue-400 mt-1">
            {monthlyStats.daysWithRecords} <span className="text-xs font-normal text-slate-400">/ {daysInMonth}</span>
          </p>
          <span className="text-[10px] text-slate-400">Days with recorded activities</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Daily Average</p>
          <p className="text-xl sm:text-2xl font-bold font-data text-emerald-600 dark:text-emerald-400 mt-1">
            {formatWaterVolume(monthlyStats.avgPerActiveDay, preferredUnit)}
          </p>
          <span className="text-[10px] text-slate-400">Per logged active day</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Days Under Goal</p>
          <p className="text-xl sm:text-2xl font-bold font-data text-purple-600 dark:text-purple-400 mt-1">
            {monthlyStats.daysUnderGoal} <span className="text-xs font-normal text-slate-400">days</span>
          </p>
          <span className="text-[10px] text-slate-400">
            Within {primaryDailyGoal ? `${primaryDailyGoal.targetLiters}L` : 'daily'} target
          </span>
        </div>
      </div>

      {/* Main Grid & Selected Day Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Calendar Month Grid */}
        <div className="lg:col-span-7 bg-white dark:bg-[#102338] p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#263D52] shadow-sm">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, idx) => (
              <span
                key={d}
                className={`text-[11px] font-bold uppercase tracking-wider py-1 ${
                  idx === 0 || idx === 6 ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'
                }`}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty offset padding for days before day 1 */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-2xl bg-slate-50/40 dark:bg-slate-900/20 border border-transparent" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const data = recordsByDate.get(dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = todayStr === dateStr;
              const hasRecords = data && data.records.length > 0;
              const isOverGoal =
                primaryDailyGoal && hasRecords && data.totalLiters > primaryDailyGoal.targetLiters;

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-2xl flex flex-col justify-between text-left transition-all relative border ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/70 dark:bg-cyan-950/60 shadow-md ring-2 ring-cyan-500/30'
                      : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                  aria-label={`${formattedSelectedDate}, ${hasRecords ? `${data.totalLiters} Liters logged` : 'No records'}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                          : isSelected
                          ? 'text-cyan-600 dark:text-cyan-300 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Small status indicator pill */}
                    {hasRecords && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isOverGoal ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        title={isOverGoal ? 'Exceeded daily target' : 'Under daily target'}
                      />
                    )}
                  </div>

                  {/* Volume readout inside day cell */}
                  {hasRecords ? (
                    <div className="w-full truncate text-[10px] font-semibold font-data">
                      <span className={isOverGoal ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-700 dark:text-slate-200'}>
                        {formatWaterVolume(data.totalLiters, preferredUnit)}
                      </span>
                      <span className="hidden sm:block text-[9px] text-slate-400 font-normal">
                        {data.records.length} {data.records.length === 1 ? 'log' : 'logs'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-300 dark:text-slate-600">—</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Current Day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Under Daily Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Above Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-lg border-2 border-cyan-500 bg-cyan-50 dark:bg-cyan-950/60" />
              <span>Selected Date</span>
            </div>
          </div>
        </div>

        {/* Selected Date Detail Panel */}
        <div className="lg:col-span-5 bg-white dark:bg-[#102338] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#263D52] shadow-sm space-y-5">
          {/* Header of selected date */}
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                Selected Date
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mt-0.5">
                {formattedSelectedDate}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedDayData.records.length} {selectedDayData.records.length === 1 ? 'activity logged' : 'activities logged'}
              </p>
            </div>

            {/* Quick Add on this date */}
            <button
              onClick={() => onAddNewForDate(selectedDate)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 transition-all shrink-0"
              title={`Log water activity for ${selectedDate}`}
            >
              <Plus className="w-4 h-4" />
              <span>Log Water</span>
            </button>
          </div>

          {/* Daily Total & Target Comparison */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Total Day Consumption
              </span>
              <span className="text-base font-bold font-data text-cyan-600 dark:text-cyan-400">
                {formatWaterVolume(selectedDayData.totalLiters, preferredUnit)}
              </span>
            </div>

            {primaryDailyGoal && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Goal ({formatWaterVolume(primaryDailyGoal.targetLiters, preferredUnit)})</span>
                  <span className={selectedDayData.totalLiters > primaryDailyGoal.targetLiters ? 'text-amber-500 font-bold' : 'text-emerald-500 font-bold'}>
                    {Math.round((selectedDayData.totalLiters / primaryDailyGoal.targetLiters) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      selectedDayData.totalLiters > primaryDailyGoal.targetLiters ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((selectedDayData.totalLiters / primaryDailyGoal.targetLiters) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Records List for this day */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Activities for this day
            </h4>

            {selectedDayData.records.length === 0 ? (
              <div className="text-center py-8 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <Droplets className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  No water records for this date
                </p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Click the button below to log past consumption or domestic usage for this day.
                </p>
                <button
                  onClick={() => onAddNewForDate(selectedDate)}
                  className="mt-3 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 text-xs font-bold hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition-colors"
                >
                  + Log Activity for {selectedDate}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {selectedDayData.records.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                          {rec.activityName}
                        </h5>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${
                            rec.isEstimated
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {rec.isEstimated ? 'Est' : 'Measured'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="truncate">{CATEGORY_LABELS[rec.category]?.label || rec.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{rec.time}</span>
                        </span>
                      </div>

                      {rec.notes && (
                        <p className="text-[10px] text-slate-400 italic mt-1 truncate">
                          "{rec.notes}"
                        </p>
                      )}
                    </div>

                    {/* Volume and action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-bold font-data text-cyan-600 dark:text-cyan-400">
                        {formatWaterVolume(rec.quantityLiters, preferredUnit)}
                      </span>

                      <div className="flex items-center gap-1 border-l border-slate-100 dark:border-slate-800 pl-2">
                        <button
                          onClick={() => onEditRecord(rec)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit activity"
                          aria-label={`Edit ${rec.activityName}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.id)}
                          disabled={deletingId === rec.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete activity"
                          aria-label={`Delete ${rec.activityName}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
