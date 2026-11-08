import React, { useState, useRef } from 'react';
import { UserProfile, PrivacySettings } from '../../types';
import {
  User,
  Camera,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  Calendar,
  MapPin,
  Users as UsersIcon,
  Shield,
  Sparkles,
  ArrowLeft,
  Mail,
  AtSign
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onNavigateHome: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateProfile,
  onNavigateHome,
}) => {
  // Form fields
  const [displayName, setDisplayName] = useState(user.displayName || user.nickname || 'Juan Dela Cruz');
  const [nickname, setNickname] = useState(user.nickname || 'Juan Dela Cruz');
  const [username, setUsername] = useState(user.username || user.email.split('@')[0] || 'juandelacruz');
  const [birthdate, setBirthdate] = useState(user.birthdate || '');
  const [location, setLocation] = useState(user.location || '');
  const [householdSize, setHouseholdSize] = useState<number>(user.householdSize || 3);
  const [bio, setBio] = useState(user.bio || '');

  // Photo state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl || null);
  const [hasNewPhoto, setHasNewPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Privacy controls
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    showOnLeaderboard: user.privacySettings?.showOnLeaderboard !== false,
    showStreakPublicly: user.privacySettings?.showStreakPublicly !== false,
    showPublicTips: user.privacySettings?.showPublicTips !== false,
    showLocationPublicly: user.privacySettings?.showLocationPublicly !== false,
    showBioPublicly: user.privacySettings?.showBioPublicly !== false,
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle image upload from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPEG, PNG, WEBP, or GIF).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 8MB. Please choose a smaller photo.');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      // Optimize and resize image using HTML5 canvas to keep it lightweight (max 400x400)
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setAvatarPreview(optimizedDataUrl);
          setHasNewPhoto(true);
        } else {
          setAvatarPreview(dataUrl);
          setHasNewPhoto(true);
        }
      };
      img.onerror = () => {
        setAvatarPreview(dataUrl);
        setHasNewPhoto(true);
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarPreview(null);
    setHasNewPhoto(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);
    setErrorMsg(null);

    try {
      const cleanNick = nickname.trim() || 'Juan Dela Cruz';
      const cleanUser = username.trim().toLowerCase().replace(/^@/, '') || cleanNick.toLowerCase().replace(/\s+/g, '_');

      const updates: Partial<UserProfile> = {
        displayName: displayName.trim() || cleanNick,
        nickname: cleanNick,
        username: cleanUser,
        birthdate: birthdate || undefined,
        location: location.trim() || undefined,
        householdSize: Math.max(1, Number(householdSize) || 1),
        bio: bio.trim() || undefined,
        privacySettings,
      };

      // If user uploaded or removed photo, update avatarUrl
      if (hasNewPhoto) {
        updates.avatarUrl = avatarPreview || undefined;
      }

      await onUpdateProfile(updates);
      setSuccessMsg(true);
      setHasNewPhoto(false);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const isPhotoUrl = avatarPreview && (avatarPreview.startsWith('http') || avatarPreview.startsWith('data:'));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Back button and page title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                My Profile & Account Identity
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Manage your personal information, profile photo, and public privacy preferences
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#102338] text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Connected Account: {user.email}</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="font-medium">
            Profile updated successfully! Your customized photo, username, and details are now active throughout AquaTrack.
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-800 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2.5 animate-fade-in shadow-xs">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Upload Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-500" />
                Profile Picture
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload a real photo of your choice from your device. It will appear across navigation, community, and leaderboards.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-2 border-cyan-500/40 dark:border-cyan-400/40 p-1 bg-slate-50 dark:bg-[#0c1a2c] shadow-lg shadow-cyan-500/10 overflow-hidden flex items-center justify-center">
                {isPhotoUrl ? (
                  <img
                    src={avatarPreview!}
                    alt={nickname}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : avatarPreview && avatarPreview.length <= 4 ? (
                  <span className="text-5xl">{avatarPreview}</span>
                ) : (
                  <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold text-4xl flex items-center justify-center">
                    {nickname ? nickname[0].toUpperCase() : 'J'}
                  </div>
                )}
              </div>

              {hasNewPhoto && (
                <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-cyan-600 text-white text-[10px] font-bold shadow-md">
                  Unsaved
                </span>
              )}
            </div>

            {/* Photo Action Buttons */}
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {isPhotoUrl ? 'Custom Device Photo Active' : 'Default Account Avatar'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Supports JPEG, PNG, WEBP, or GIF. Photos are automatically optimized for fast loading and security.
                </p>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
                id="profile-photo-upload"
              />

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isPhotoUrl ? 'Replace Photo' : 'Upload Photo from Device'}</span>
                </button>

                {isPhotoUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-3.5 py-2.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-500" />
              Personal Details
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize how your identity appears throughout greetings, logs, and community interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Preferred Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Preferred Name / Nickname <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Juan Dela Cruz"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Used in greetings across all supported languages (e.g., "Kumusta, Juan Dela Cruz!").
              </p>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <AtSign className="w-3.5 h-3.5 text-cyan-500" />
                <span>Username Handle</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs font-bold">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="juandelacruz"
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-data font-semibold"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Your unique handle on game leaderboards and community posts.
              </p>
            </div>

            {/* Gmail / Account Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-cyan-500" />
                <span>Gmail / Account Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-xs sm:text-sm text-slate-500 opacity-90 cursor-not-allowed font-medium"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Permanent account credential used for secure login.
              </p>
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                <span>Birthday</span>
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Used to personalize annual conservation milestone messages.
              </p>
            </div>

            {/* Location / City */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span>City / Region / Country</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Quezon City, Philippines"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Enables region-specific water district notices and conservation news.
              </p>
            </div>

            {/* Household Size */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <UsersIcon className="w-3.5 h-3.5 text-cyan-500" />
                <span>Household Size (Persons)</span>
              </label>
              <input
                type="number"
                min={1}
                max={30}
                value={householdSize}
                onChange={(e) => setHouseholdSize(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-data font-semibold"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Calculates accurate per-capita daily water consumption metrics.
              </p>
            </div>
          </div>

          {/* Biography */}
          <div className="pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Personal Biography & Conservation Pledge
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Eco-conscious resident practicing zero tap waste, rainwater reuse for gardening, and household leak prevention."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Share your environmental commitment or personal conservation tips with the community.
            </p>
          </div>
        </div>

        {/* Profile Privacy Controls */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              Public Privacy & Visibility Controls
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Control which pieces of your profile information can be viewed by other verified members.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Display Preferred Name & Photo on Game Leaderboards
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  When enabled, your high score rankings display your verified name and custom photo
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showOnLeaderboard}
                onChange={(e) =>
                  setPrivacySettings((prev) => ({ ...prev, showOnLeaderboard: e.target.checked }))
                }
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Display Water-Saving Streak in Community Hub
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enables fellow community members to see your active consecutive days milestone badge
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showStreakPublicly}
                onChange={(e) =>
                  setPrivacySettings((prev) => ({ ...prev, showStreakPublicly: e.target.checked }))
                }
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Display Preferred Name on Community Tips
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  When unchecked, tips you publish are credited anonymously as "Community Member"
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showPublicTips}
                onChange={(e) =>
                  setPrivacySettings((prev) => ({ ...prev, showPublicTips: e.target.checked }))
                }
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0c1a2c] border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-cyan-500/40 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Make Location & City Public
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Displays your city next to your name in community conservation challenges
                </p>
              </div>
              <input
                type="checkbox"
                checked={privacySettings.showLocationPublicly}
                onChange={(e) =>
                  setPrivacySettings((prev) => ({ ...prev, showLocationPublicly: e.target.checked }))
                }
                className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Form Submission Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onNavigateHome}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-cyan-500/25 transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
