import React, { useState } from 'react';
import { WaterRecord, WaterCategory, WaterUnit } from '../../types';
import { CATEGORY_LABELS, formatWaterVolume } from '../../lib/waterCalculations';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  Download,
  CheckCircle,
  Clock3,
  Droplets,
  ArrowUpDown,
  FileSpreadsheet
} from 'lucide-react';

interface RecordListProps {
  records: WaterRecord[];
  onAddNew: () => void;
  onEdit: (record: WaterRecord) => void;
  onDelete: (id: string) => Promise<void>;
  preferredUnit?: WaterUnit;
}

export const RecordList: React.FC<RecordListProps> = ({
  records,
  onAddNew,
  onEdit,
  onDelete,
  preferredUnit = 'liters',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | '7days' | '30days' | 'this_month' | 'custom'>('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [measurementFilter, setMeasurementFilter] = useState<'all' | 'measured' | 'estimated'>('all');
  const [sortField, setSortField] = useState<'date' | 'quantity' | 'activityName'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filter & Search
  const todayStr = new Date().toISOString().split('T')[0];
  const now = new Date();
  const d7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const d30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const filtered = records.filter((r) => {
    // Category match
    const matchesCategory = selectedCategory === 'all' || r.category === selectedCategory;

    // Measurement match
    const matchesMeasurement =
      measurementFilter === 'all' ||
      (measurementFilter === 'measured' && !r.isEstimated) ||
      (measurementFilter === 'estimated' && r.isEstimated);

    // Date range match
    let matchesDate = true;
    if (dateRange === 'today') {
      matchesDate = r.date === todayStr;
    } else if (dateRange === '7days') {
      matchesDate = r.date >= d7Ago && r.date <= todayStr;
    } else if (dateRange === '30days') {
      matchesDate = r.date >= d30Ago && r.date <= todayStr;
    } else if (dateRange === 'this_month') {
      matchesDate = r.date.startsWith(currentMonthPrefix);
    } else if (dateRange === 'custom') {
      if (customStart && r.date < customStart) matchesDate = false;
      if (customEnd && r.date > customEnd) matchesDate = false;
    }

    // Search query match
    const matchesSearch =
      !searchTerm ||
      r.activityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesMeasurement && matchesDate && matchesSearch;
  });

  // Calculate filtered totals
  const filteredVolumeLiters = filtered.reduce((acc, curr) => acc + curr.quantityLiters, 0);

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'date') {
      cmp = `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
    } else if (sortField === 'quantity') {
      cmp = a.quantityLiters - b.quantityLiters;
    } else {
      cmp = a.activityName.localeCompare(b.activityName);
    }
    return sortOrder === 'desc' ? -cmp : cmp;
  });

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await onDelete(id);
      setDeleteConfirmId(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    window.location.href = '/api/records/export';
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Water Consumption History
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {records.length} recorded {records.length === 1 ? 'activity' : 'activities'} logged
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102338] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors shadow-sm"
            title="Download records as CSV spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Log Water Usage</span>
          </button>
        </div>
      </div>

      {/* Filter and search controls */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-3">
        {/* Main Search and primary filters row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by activity name or notes..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c] text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range filter */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c] text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="this_month">This Month</option>
                <option value="custom">Custom Date Range...</option>
              </select>
            </div>

            {/* Measurement type filter */}
            <select
              value={measurementFilter}
              onChange={(e) => setMeasurementFilter(e.target.value as any)}
              className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c] text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Measurement Types</option>
              <option value="measured">Direct Meter Readings Only</option>
              <option value="estimated">Estimations Only</option>
            </select>

            {/* Sort selector */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={`${sortField}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-') as [any, any];
                  setSortField(field);
                  setSortOrder(order);
                }}
                className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c] text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="quantity-desc">Highest Volume</option>
                <option value="quantity-asc">Lowest Volume</option>
                <option value="activityName-asc">Activity (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom date range inputs if selected */}
        {dateRange === 'custom' && (
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500">From:</span>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c] text-xs text-slate-900 dark:text-white"
            />
            <span className="text-xs font-semibold text-slate-500">To:</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1a2c] text-xs text-slate-900 dark:text-white"
            />
          </div>
        )}

        {/* Filter Summary & Quick Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <div>
            <span>Showing </span>
            <strong className="text-slate-800 dark:text-slate-200 font-bold">{sorted.length}</strong>
            <span> of </span>
            <strong className="text-slate-800 dark:text-slate-200">{records.length}</strong>
            <span> activities • Total Volume: </span>
            <strong className="text-cyan-600 dark:text-cyan-400 font-bold font-data">
              {formatWaterVolume(filteredVolumeLiters, preferredUnit)}
            </strong>
          </div>

          {(searchTerm || selectedCategory !== 'all' || dateRange !== 'all' || measurementFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setDateRange('all');
                setMeasurementFilter('all');
                setCustomStart('');
                setCustomEnd('');
              }}
              className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Record List */}
      {sorted.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500 flex items-center justify-center">
            <Droplets className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {records.length === 0 ? 'No Water Activities Yet' : 'No Matching Activities Found'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            {records.length === 0
              ? 'Start tracking your daily showers, laundry, and cooking water to uncover easy conservation opportunities.'
              : 'Try clearing your search query or choosing another category filter.'}
          </p>
          {records.length === 0 && (
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              Log Your First Entry
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {sorted.map((record) => {
            const cat = CATEGORY_LABELS[record.category] || { label: record.category, icon: 'Droplets' };

            return (
              <div
                key={record.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] hover:border-cyan-500/40 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {record.activityName}
                      </h4>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {cat.label}
                      </span>
                      {record.isEstimated ? (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50">
                          Estimated
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50">
                          Measured
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {record.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {record.time}
                      </span>
                      {record.notes && (
                        <span className="text-slate-600 dark:text-slate-300 italic truncate max-w-xs">
                          "{record.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quantity and Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <p className="text-lg sm:text-xl font-bold font-data text-cyan-600 dark:text-cyan-400">
                      {formatWaterVolume(record.quantityLiters, preferredUnit)}
                    </p>
                    {record.unit !== 'liters' && (
                      <p className="text-[11px] text-slate-400">
                        ({record.quantity} {record.unit})
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEdit(record)}
                      className="p-2 rounded-xl text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit this record"
                      aria-label="Edit record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(record.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete this record"
                      aria-label="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Confirm Deletion
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to remove this water usage activity? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
