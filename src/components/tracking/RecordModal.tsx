import React, { useState } from 'react';
import { WaterRecord, WaterCategory, WaterUnit } from '../../types';
import { CATEGORY_LABELS } from '../../lib/waterCalculations';
import { waterRecordSchema } from '../../lib/validation';
import { X, Save, AlertCircle, Droplets, Info } from 'lucide-react';

interface RecordModalProps {
  initialRecord?: WaterRecord | null;
  initialDate?: string;
  onClose: () => void;
  onSave: (recordData: any) => Promise<void>;
  preferredUnit?: WaterUnit;
}

export const RecordModal: React.FC<RecordModalProps> = ({
  initialRecord,
  initialDate,
  onClose,
  onSave,
  preferredUnit = 'liters',
}) => {
  const [activityName, setActivityName] = useState(initialRecord?.activityName || '');
  const [category, setCategory] = useState<WaterCategory>(initialRecord?.category || 'bathing_showering');
  const [quantity, setQuantity] = useState<string>(initialRecord ? String(initialRecord.quantity) : '');
  const [unit, setUnit] = useState<WaterUnit>(initialRecord?.unit || preferredUnit);
  const [date, setDate] = useState(
    initialRecord?.date || initialDate || new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState(
    initialRecord?.time ||
      new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
  );
  const [notes, setNotes] = useState(initialRecord?.notes || '');
  const [isEstimated, setIsEstimated] = useState(initialRecord ? initialRecord.isEstimated : true);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Quick preset suggestions based on category
  const setQuickPreset = (name: string, qty: number) => {
    setActivityName(name);
    setQuantity(String(qty));
    setUnit('liters');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setError('Please provide a valid quantity greater than 0');
      return;
    }

    const payload = {
      activityName: activityName.trim(),
      category,
      quantity: numQty,
      unit,
      date,
      time,
      notes: notes.trim(),
      isEstimated,
    };

    const validation = waterRecordSchema.safeParse(payload);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save water record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl text-white shadow-md shadow-cyan-500/20">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              {initialRecord ? 'Edit Water Activity' : 'Record Water Usage'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {initialRecord ? 'Update your recorded entry' : 'Log your domestic water consumption'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(CATEGORY_LABELS) as WaterCategory[]).map((catKey) => {
                const info = CATEGORY_LABELS[catKey];
                const isSelected = category === catKey;
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => {
                      setCategory(catKey);
                      if (!activityName) setActivityName(info.label);
                    }}
                    className={`p-2 rounded-xl border text-left text-xs transition-all flex flex-col justify-between h-16 ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/80 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-semibold ring-1 ring-cyan-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="truncate">{info.label}</span>
                    <span className="text-[10px] text-slate-400">~{info.typicalLiters}L</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activity Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Activity Name
            </label>
            <input
              type="text"
              required
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="e.g. 5-minute Morning Shower, Handwashing dishes"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
            />
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Quick presets:</span>
            <button
              type="button"
              onClick={() => setQuickPreset('5-Minute Shower', 45)}
              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] hover:bg-cyan-100 dark:hover:bg-cyan-950"
            >
              Shower (45L)
            </button>
            <button
              type="button"
              onClick={() => setQuickPreset('Toilet Flush (Dual)', 6)}
              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] hover:bg-cyan-100 dark:hover:bg-cyan-950"
            >
              Toilet Flush (6L)
            </button>
            <button
              type="button"
              onClick={() => setQuickPreset('Laundry Load', 50)}
              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] hover:bg-cyan-100 dark:hover:bg-cyan-950"
            >
              Laundry Load (50L)
            </button>
            <button
              type="button"
              onClick={() => setQuickPreset('Toothbrushing (with cup)', 0.5)}
              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] hover:bg-cyan-100 dark:hover:bg-cyan-950"
            >
              Toothbrush Cup (0.5L)
            </button>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Volume / Quantity
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 45"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as WaterUnit)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-medium"
              >
                <option value="liters">Liters (L)</option>
                <option value="milliliters">Milliliters (mL)</option>
                <option value="gallons">US Gallons (gal)</option>
                <option value="imperial_gallons">Imperial Gallons (Imp gal)</option>
                <option value="cubic_meters">Cubic Meters (m³)</option>
              </select>
            </div>
          </div>

          {/* Measured vs Estimated classification */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Classification: {isEstimated ? 'Estimated Usage' : 'Measured Reading'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isEstimated
                    ? 'Approximated based on typical duration or fixture output'
                    : 'Read directly from a calibrated meter, gauge, or container'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEstimated(!isEstimated)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isEstimated ? 'bg-amber-500' : 'bg-cyan-600'
                }`}
                aria-label="Toggle measured vs estimated"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isEstimated ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              maxLength={300}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Turned off tap while brushing teeth; used wash water for outdoor plants"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-1/3 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : initialRecord ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
