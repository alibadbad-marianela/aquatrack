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
  Download,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Droplets,
  Database,
  ArrowRight
} from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  currentTheme: 'light' | 'dark' | 'system';
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onLogout: () => void;
  onNavigateToProfile?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  currentTheme,
  onUpdateProfile,
  onThemeChange,
  onLogout,
  onNavigateToProfile,
}) => {
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
        preferredUnit,
        autoRotateGreeting: autoRotate,
        greetingRotateIntervalSec: Number(rotateInterval) || 8,
        preferredLanguage,
        theme: currentTheme,
      });
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save application settings');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = () => {
    try {
      const data = {
        exportDate: new Date().toISOString(),
        profile: {
          id: profile.id,
          email: profile.email,
          displayName: profile.displayName,
          nickname: profile.nickname,
          username: profile.username,
          preferredUnit: profile.preferredUnit,
          preferredLanguage: profile.preferredLanguage,
        },
        records: JSON.parse(localStorage.getItem(`aquatrack_records_${profile.id}`) || '[]'),
        goals: JSON.parse(localStorage.getItem(`aquatrack_goals_${profile.id}`) || '[]'),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aquatrack_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Unable to export data from browser storage.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl text-white shadow-md shadow-cyan-500/20">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Application Preferences & Units
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Configure application theme, multilingual greeting rotation, and water volume measurement units
          </p>
        </div>
      </div>

      {/* Profile redirection banner */}
      <div className="p-4 rounded-2xl bg-cyan-50/70 dark:bg-[#102338] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
              Personal Information & Profile Photo
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Personal name, username, device photo upload, birthday, and biography are managed on your dedicated Profile Page.
            </p>
          </div>
        </div>

        {onNavigateToProfile && (
          <button
            type="button"
            onClick={onNavigateToProfile}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <span>Edit Profile Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Your application and unit preferences have been saved successfully.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-800 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2 animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance Theme */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              Appearance Theme
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your preferred visual style across light, dark, or system matching mode
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-1">
            {[
              { id: 'light', label: 'Light Mode', icon: Sun, desc: 'Crisp water white' },
              { id: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Deep ocean dark' },
              { id: 'system', label: 'System Theme', icon: Laptop, desc: 'Follows OS' },
            ].map((th) => {
              const Icon = th.icon;
              const isSelected = currentTheme === th.id;
              return (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => onThemeChange(th.id as any)}
                  className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold ring-2 ring-cyan-500/50 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{th.label}</span>
                  <span className="text-[10px] text-slate-400">{th.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multilingual Greeting Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-500" />
                Multilingual Greeting Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure greeting cycling across Philippine regional and global languages
              </p>
            </div>
            <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-lg bg-cyan-50 dark:bg-cyan-950">
              {GREETING_LANGUAGES.length} Languages
            </span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c]">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Automatic Multilingual Rotation
                </p>
                <p className="text-[11px] text-slate-500">
                  Rotates greetings smoothly across global and Philippine regional languages
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white disabled:opacity-50"
                >
                  <option value={5}>5 seconds</option>
                  <option value={8}>8 seconds (Recommended)</option>
                  <option value={12}>12 seconds</option>
                  <option value={20}>20 seconds</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Default Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <optgroup label="🇵🇭 Philippine Languages">
                    {GREETING_LANGUAGES.filter((l) => l.region === 'Philippine').map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.language} ({l.nativeName})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🌍 European Languages">
                    {GREETING_LANGUAGES.filter((l) => l.region === 'European').map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.language} ({l.nativeName})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🌏 Asian Languages">
                    {GREETING_LANGUAGES.filter((l) => l.region === 'Asian').map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.language} ({l.nativeName})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🏜️ Middle Eastern & African">
                    {GREETING_LANGUAGES.filter((l) => l.region === 'Middle Eastern & African').map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.language} ({l.nativeName})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Water Volume Measurement Units Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-500" />
              Water Measurement Units
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select the default volume unit used for logging, analytics, targets, and utility billing comparison
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            {[
              {
                id: 'liters',
                label: 'Liters (L)',
                desc: 'Standard domestic metric system',
                conversion: '1.0 L baseline',
              },
              {
                id: 'milliliters',
                label: 'Milliliters (mL)',
                desc: 'Precise measurement for drinking',
                conversion: '1,000 mL = 1 L',
              },
              {
                id: 'gallons',
                label: 'US Gallons (gal)',
                desc: 'United States volume standard',
                conversion: '1 gal ≈ 3.785 L',
              },
              {
                id: 'imperialGallons',
                label: 'Imperial Gallons',
                desc: 'Commonwealth volume standard',
                conversion: '1 Imp gal ≈ 4.546 L',
              },
              {
                id: 'cubicMeters',
                label: 'Cubic Meters (m³)',
                desc: 'Municipal utility meter billing standard',
                conversion: '1 m³ = 1,000 L',
              },
            ].map((u) => {
              const isSelected = preferredUnit === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setPreferredUnit(u.id as WaterUnit)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-200 ring-2 ring-cyan-500/50 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold">{u.label}</p>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {u.desc}
                    </p>
                  </div>
                  <span className="text-[10px] font-data font-semibold text-cyan-600 dark:text-cyan-400 mt-2 block">
                    {u.conversion}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Data Storage & Export Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-500" />
              Data Storage & Backup
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Download your complete consumption history or manage local offline storage
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Export your water consumption records, streak milestones, and targets in standard JSON format for personal spreadsheets or archiving.
            </p>

            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Water Logs (JSON)</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Preferences...' : 'Save Application Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
