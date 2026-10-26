import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { WaterRecord, WaterUnit } from '../../types';
import { CATEGORY_LABELS, formatWaterVolume } from '../../lib/waterCalculations';
import {
  TrendingDown,
  TrendingUp,
  Droplets,
  Calendar,
  PieChart as PieIcon,
  Activity,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface AnalyticsViewProps {
  records: WaterRecord[];
  analyticsData: any;
  preferredUnit?: WaterUnit;
}

const COLORS = [
  '#1677E8', // Ocean blue
  '#22D3EE', // Cyan
  '#2DD4BF', // Turquoise
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#64748B', // Slate
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  records,
  analyticsData,
  preferredUnit = 'liters',
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  const stats = analyticsData?.stats || {
    todayTotalLiters: 0,
    weekTotalLiters: 0,
    monthTotalLiters: 0,
    averageDailyLiters: 0,
    totalRecordsCount: 0,
  };

  const dailyChart = analyticsData?.dailyChartData || [];
  const categoryTotals = analyticsData?.categoryTotals || {};
  const measuredVsEstimated = analyticsData?.measuredVsEstimated || [];

  const pieData = Object.entries(categoryTotals)
    .filter(([_, val]: any) => val > 0)
    .map(([catKey, val]: any) => ({
      name: CATEGORY_LABELS[catKey as keyof typeof CATEGORY_LABELS]?.label || catKey,
      value: Math.round(val * 10) / 10,
    }));

  const hasData = records.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Water Consumption Analytics
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time calculations based exclusively on your {records.length} saved records
          </p>
        </div>

        <button
          onClick={() => (window.location.href = '/api/records/export')}
          className="self-start sm:self-center flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102338] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          <span>Export Records (CSV)</span>
        </button>
      </div>

      {/* Top metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Today's Usage
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-data text-cyan-600 dark:text-cyan-400">
            {formatWaterVolume(stats.todayTotalLiters, preferredUnit)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active date consumption</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Past 7 Days
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-data text-blue-600 dark:text-blue-400">
            {formatWaterVolume(stats.weekTotalLiters, preferredUnit)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Rolling 7-day cumulative</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Past 30 Days
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-data text-teal-600 dark:text-teal-400">
            {formatWaterVolume(stats.monthTotalLiters, preferredUnit)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Rolling monthly total</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Daily Average
          </p>
          <p className="text-2xl sm:text-3xl font-bold font-data text-slate-900 dark:text-white">
            {formatWaterVolume(stats.averageDailyLiters, preferredUnit)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Across logged days</span>
        </div>
      </div>

      {!hasData ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <AlertCircle className="w-12 h-12 text-cyan-500 mx-auto mb-3 opacity-80" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Insufficient Data for Trend Visualizations
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            AquaTrack adheres to strict data integrity: we never manufacture artificial charts. Record your daily activities to reveal personalized consumption trends.
          </p>
        </div>
      ) : (
        <>
          {/* Main 14-Day Consumption Trend */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-500" />
                  14-Day Consumption Timeline
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Daily recorded volume in Liters across the past two weeks
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0c1a2c] text-xs font-semibold">
                <button
                  onClick={() => setChartType('area')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    chartType === 'area'
                      ? 'bg-white dark:bg-[#102338] text-cyan-600 dark:text-cyan-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Area Chart
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    chartType === 'bar'
                      ? 'bg-white dark:bg-[#102338] text-cyan-600 dark:text-cyan-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Bar Chart
                </button>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'area' ? (
                  <AreaChart data={dailyChart}>
                    <defs>
                      <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#1677E8" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(val) => val.slice(5)} // MM-DD
                      stroke="#888888"
                      fontSize={11}
                    />
                    <YAxis stroke="#888888" fontSize={11} unit="L" />
                    <Tooltip
                      formatter={(val: any) => [`${val} Liters`, 'Usage']}
                      contentStyle={{
                        borderRadius: '12px',
                        backgroundColor: '#10243A',
                        borderColor: '#263D52',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="liters"
                      stroke="#22D3EE"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorLiters)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={dailyChart}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="date" tickFormatter={(val) => val.slice(5)} stroke="#888888" fontSize={11} />
                    <YAxis stroke="#888888" fontSize={11} unit="L" />
                    <Tooltip
                      formatter={(val: any) => [`${val} Liters`, 'Usage']}
                      contentStyle={{
                        borderRadius: '12px',
                        backgroundColor: '#10243A',
                        borderColor: '#263D52',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="liters" fill="#1677E8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Section: Category Distribution & Classification */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Donut */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-teal-500" />
                Category Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Proportion of total consumption by domestic water activity
              </p>

              {pieData.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No category breakdown available</div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: any) => [`${val} L`, 'Volume']}
                        contentStyle={{
                          borderRadius: '12px',
                          backgroundColor: '#10243A',
                          borderColor: '#263D52',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Measured vs Estimated Breakdown */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-500" />
                  Measurement Integrity
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Measured meter readings versus approximated estimation logs
                </p>

                <div className="space-y-3">
                  {measuredVsEstimated.map((item: any, idx: number) => {
                    const totalVal = measuredVsEstimated.reduce((acc: number, curr: any) => acc + curr.value, 0);
                    const pct = totalVal > 0 ? Math.round((item.value / totalVal) * 100) : 0;
                    const isMeasured = item.name.includes('Measured');

                    return (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {item.name}
                          </span>
                          <span className="font-semibold text-slate-500 dark:text-slate-400">
                            {item.value} L ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isMeasured ? 'bg-cyan-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-[11px] text-cyan-800 dark:text-cyan-300 border border-cyan-500/20">
                <strong>Accuracy Tip:</strong> Logging direct meter readings regularly helps verify municipal utility bills and catches subterranean pipe leaks before they escalate.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
