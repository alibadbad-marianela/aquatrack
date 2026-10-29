import React, { useState } from 'react';
import { UserProfile, WaterUnit } from '../../types';
import { GREETING_LANGUAGES } from '../../lib/localization';
import {
  Settings,
  User,
  Moon,
  Sun,
  Laptop,
  Globe,
  Sliders,
  Bell,
  Download,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  currentTheme: 'light' | 'dark' | 'system';
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onLogout: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  currentTheme,
  onUpdateProfile,
  onThemeChange,
  onLogout,
}) => {
  const [nickname, setNickname] = useState(profile.nickname || '');
  const [preferredUnit, setPreferredUnit] = useState<WaterUnit>(profile.preferredUnit || 'liters');
  const [autoRotate, setAutoRotate] = useState(profile.autoRotateGreeting !== false);
  const [rotateInterval, setRotateInterval] = useState(profile.greetingRotateIntervalSec || 8);
  const [preferredLanguage, setPreferredLanguage] = useState(profile.preferredLanguage || 'en');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);
    setErrorMsg(null);

    try {
      await onUpdateProfile({
        nickname: nickname.trim() || 'Friend',
        preferredUnit,
        autoRotateGreeting: autoRotate,
        greetingRotateIntervalSec: Number(rotateInterval) || 8,
        preferredLanguage,
        theme: currentTheme,
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl text-white shadow-md shadow-cyan-500/20">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Preferences & Account Settings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Personalize theme, units, multilingual greeting rotation, and export data
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Your settings have been saved successfully and persisted to the database.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-800 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-500" />
            Profile & Greeting Name
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Preferred Nickname
              </label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                This name appears inside your personalized greeting in all 14 languages.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Account Email
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs sm:text-sm text-slate-500 opacity-80 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">Your registered login credential.</p>
            </div>
          </div>
        </div>

        {/* Theme Appearance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Appearance Theme
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'system', label: 'System Theme', icon: Laptop },
            ].map((th) => {
              const Icon = th.icon;
              const isSelected = currentTheme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onThemeChange(th.id as any)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold ring-1 ring-cyan-500'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{th.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multilingual Greeting Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-500" />
            14-Language Greeting Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c]">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Automatic Multilingual Rotation
                </p>
                <p className="text-[11px] text-slate-500">
                  Rotates greetings smoothly across 14 global and Philippine regional languages
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  autoRotate ? 'bg-cyan-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoRotate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Rotation Interval (Seconds)
                </label>
                <select
                  value={rotateInterval}
                  onChange={(e) => setRotateInterval(Number(e.target.value))}
                  disabled={!autoRotate}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value={5}>5 seconds</option>
                  <option value={8}>8 seconds (Recommended)</option>
                  <option value={12}>12 seconds</option>
                  <option value={20}>20 seconds</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Default Language Selection
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  {GREETING_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.language} ({l.nativeName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Measurement Units */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-500" />
            Standard Water Measurement Unit
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { id: 'liters', label: 'Liters (L)' },
              { id: 'milliliters', label: 'Milliliters (mL)' },
              { id: 'gallons', label: 'US Gallons (gal)' },
              { id: 'imperial_gallons', label: 'Imperial Gal (Imp)' },
              { id: 'cubic_meters', label: 'Cubic Meters (m³)' },
            ].map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setPreferredUnit(u.id as WaterUnit)}
                className={`py-3 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                  preferredUnit === u.id
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Preferences'}</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl border border-red-300 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </form>

      {/* Data Export & Privacy Box */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
            <Download className="w-4 h-4 text-cyan-500" />
            Data Sovereignty & Archiving
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-md">
            Download a permanent CSV spreadsheet containing all your historical water logs, dates, notes, and metrics.
          </p>
        </div>

        <button
          onClick={() => (window.location.href = '/api/records/export')}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#102338] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors shadow-sm"
        >
          Download CSV Archive
        </button>
      </div>
    </div>
  );
};
