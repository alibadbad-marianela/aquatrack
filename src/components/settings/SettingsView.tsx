import React, { useState } from 'react';
import { UserProfile, WaterUnit, PrivacySettings } from '../../types';
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
  AlertCircle,
  Calendar,
  MapPin,
  Users as UsersIcon,
  Smile,
  Lock,
  Eye,
  Trash2
} from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  currentTheme: 'light' | 'dark' | 'system';
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onLogout: () => void;
}

const AVATAR_PRESETS = [
  { icon: '🌊', label: 'Ocean Guardian' },
  { icon: '💧', label: 'Pure Droplet' },
  { icon: '🪸', label: 'Coral Protector' },
  { icon: '🐬', label: 'Dolphin Diver' },
  { icon: '🌧️', label: 'Rainkeeper' },
  { icon: '🌿', label: 'Watershed Ranger' },
  { icon: '🐢', label: 'Sea Turtle' },
  { icon: '🏄', label: 'Aqua Explorer' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  currentTheme,
  onUpdateProfile,
  onThemeChange,
  onLogout,
}) => {
  const [nickname, setNickname] = useState(profile.nickname || 'Juan Dela Cruz');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '🌊');
  const [customAvatarInput, setCustomAvatarInput] = useState(
    profile.avatarUrl && (profile.avatarUrl.startsWith('http') || profile.avatarUrl.startsWith('data:'))
      ? profile.avatarUrl
      : ''
  );
  const [birthdate, setBirthdate] = useState(profile.birthdate || '');
  const [location, setLocation] = useState(profile.location || '');
  const [householdSize, setHouseholdSize] = useState<number>(profile.householdSize || 3);
  const [bio, setBio] = useState(profile.bio || '');

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    showOnLeaderboard: profile.privacySettings?.showOnLeaderboard !== false,
    showStreakPublicly: profile.privacySettings?.showStreakPublicly !== false,
    showPublicTips: profile.privacySettings?.showPublicTips !== false,
  });

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
      const finalAvatar = customAvatarInput.trim() || avatarUrl;

      await onUpdateProfile({
        nickname: nickname.trim() || 'Juan Dela Cruz',
        avatarUrl: finalAvatar,
        birthdate: birthdate || undefined,
        location: location.trim() || undefined,
        householdSize: Number(householdSize) || 1,
        bio: bio.trim() || undefined,
        privacySettings,
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

  const handleExportData = () => {
    try {
      const data = {
        exportDate: new Date().toISOString(),
        profile,
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
    } catch (err) {
      alert('Unable to export data from browser storage.');
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
            Personalize profile details, avatar, privacy, 100+ language support, theme, and data storage
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>Your settings and profile customization have been saved successfully to the database.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-800 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Customization Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-500" />
              Profile Customization
            </h3>
            <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950 px-2.5 py-0.5 rounded-lg">
              Personalized Account
            </span>
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Profile Avatar / Picture
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {AVATAR_PRESETS.map((p) => {
                const isSelected = avatarUrl === p.icon && !customAvatarInput.trim();
                return (
                  <button
                    key={p.icon}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(p.icon);
                      setCustomAvatarInput('');
                    }}
                    className={`p-2.5 rounded-2xl border text-xl transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950 text-white ring-2 ring-cyan-500 scale-105'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                    title={p.label}
                  >
                    <span>{p.icon}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={customAvatarInput}
                onChange={(e) => setCustomAvatarInput(e.target.value)}
                placeholder="Or paste a custom image URL (https://...)"
                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {customAvatarInput.trim() && (
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-cyan-500 shrink-0">
                  <img
                    src={customAvatarInput.trim()}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => ((e.target as any).style.display = 'none')}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Preferred Name / Nickname
              </label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Juan Dela Cruz"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Your greeting and display name across AquaTrack.
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

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                <span>Birthday</span>
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Optional. Used for annual milestone greetings.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span>City / Region</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Quezon City, Metro Manila"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Helps display relevant local water advisories.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <UsersIcon className="w-3.5 h-3.5 text-cyan-500" />
                <span>Household Size</span>
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={householdSize}
                onChange={(e) => setHouseholdSize(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Number of residents for per capita water analytics.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Personal Conservation Bio
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Committed to zero tap waste and rainwater harvesting."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Your conservation pledge or focus.</p>
            </div>
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            Privacy & Sharing Controls
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Show Preferred Name on Game Leaderboards
                </p>
                <p className="text-[11px] text-slate-500">
                  When enabled, your high scores appear with your name on game rankings
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showOnLeaderboard}
                onChange={(e) =>
                  setPrivacySettings((prev) => ({ ...prev, showOnLeaderboard: e.target.checked }))
                }
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Show Water-Saving Streak in Community
                </p>
                <p className="text-[11px] text-slate-500">
                  Allows other verified members to see your milestone streak badges
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showStreakPublicly}
                onChange={(e) =>
                  setPrivacySettings((prev) => ({ ...prev, showStreakPublicly: e.target.checked }))
                }
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] cursor-pointer">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Display Name on Shared Community Tips
                </p>
                <p className="text-[11px] text-slate-500">
                  When unchecked, tips you publish are credited anonymously as "Community Member"
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showPublicTips}
                onChange={(e) =>
                  setPrivacySettings((prev) => ({ ...prev, showPublicTips: e.target.checked }))
                }
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
              />
            </label>
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

        {/* Multilingual Greeting Settings (100+ Languages) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-500" />
              Multilingual Support (100+ Languages)
            </h3>
            <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded-lg bg-cyan-50 dark:bg-cyan-950">
              {GREETING_LANGUAGES.length} Languages
            </span>
          </div>

          <div className="space-y-4">
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
                  Preferred Language Selection
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

        {/* Preferred Water Unit */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-500" />
            Preferred Water Volume Unit
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { id: 'liters', label: 'Liters (L)', desc: 'Standard metric' },
              { id: 'milliliters', label: 'Milliliters (mL)', desc: 'Precise' },
              { id: 'gallons', label: 'US Gallons (gal)', desc: '3.785 L' },
              { id: 'imperialGallons', label: 'Imp Gallons', desc: '4.546 L' },
              { id: 'cubicMeters', label: 'Cubic Meters (m³)', desc: '1,000 L' },
            ].map((u) => {
              const isSelected = preferredUnit === u.id;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setPreferredUnit(u.id as WaterUnit)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <p className="text-xs font-semibold">{u.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{u.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={handleExportData}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Water Logs (JSON)</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings & Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
