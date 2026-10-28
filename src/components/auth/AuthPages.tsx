import React, { useState } from 'react';
import { AquaLogo } from '../AquaLogo';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { registerSchema, loginSchema } from '../../lib/validation';

interface AuthPagesProps {
  initialMode?: 'login' | 'register' | 'forgot';
  onLogin: (data: { email: string; password: string }) => Promise<void>;
  onRegister: (data: { email: string; password: string; confirmPassword: string; nickname: string }) => Promise<void>;
  onForgotPassword: (email: string) => Promise<{ resetToken?: string }>;
  onResetPassword: (token: string, newPass: string) => Promise<void>;
  onDemoLogin?: () => Promise<void>;
  onClose?: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  initialMode = 'login',
  onLogin,
  onRegister,
  onForgotPassword,
  onResetPassword,
  onDemoLogin,
  onClose,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoveryNotice, setRecoveryNotice] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await onLogin({ email, password });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = registerSchema.safeParse({ email, password, confirmPassword, nickname });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      await onRegister({ email, password, confirmPassword, nickname });
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Please provide your account email address');
      return;
    }

    setLoading(true);
    try {
      const res = await onForgotPassword(email);
      if (res.resetToken) {
        setResetToken(res.resetToken);
        setRecoveryNotice(`Password recovery code generated: ${res.resetToken}`);
        setMode('reset');
      } else {
        setRecoveryNotice('Check your email for reset instructions.');
      }
    } catch (err: any) {
      setError(err.message || 'Password recovery failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!resetToken || !newPassword || newPassword.length < 6) {
      setError('Enter a valid recovery token and password (at least 6 characters)');
      return;
    }

    setLoading(true);
    try {
      await onResetPassword(resetToken, newPassword);
      setRecoveryNotice('Password updated successfully! Please log in with your new password.');
      setMode('login');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-8">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-semibold"
          >
            Cancel
          </button>
        )}

        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <AquaLogo size="md" withWordmark={true} withTagline={true} />
          </div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-3">
            {mode === 'login' && 'Sign in to AquaTrack'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Account Recovery'}
            {mode === 'reset' && 'Set New Password'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'login' && 'Access your persistent water logs, goals, and badges'}
            {mode === 'register' && 'Begin tracking and saving clean water today'}
            {mode === 'forgot' && 'Enter your email to receive a password reset token'}
            {mode === 'reset' && 'Enter your reset token and new secure password'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {recoveryNotice && (
          <div className="mb-4 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/30 text-cyan-800 dark:text-cyan-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-cyan-600" />
            <span>{recoveryNotice}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onDemoLogin && (
              <div className="pt-2">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
                  <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Or</span>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try {
                      await onDemoLogin();
                    } catch (err: any) {
                      setError(err.message || 'Demo login failed');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="w-full mt-1.5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-50/50 dark:bg-cyan-950/30 hover:bg-cyan-100/50 dark:hover:bg-cyan-900/30 text-cyan-800 dark:text-cyan-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Instant Demo Sign-In (Marian)</span>
                </button>
              </div>
            )}

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Sign up free
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Nickname / Preferred Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Marian, Alex"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Password (min 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-500">Already have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Your Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs transition-colors"
            >
              {loading ? 'Generating Code...' : 'Request Reset Token'}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full py-2 text-xs text-slate-500 hover:underline"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* RESET PASSWORD FORM */}
        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Recovery Token
              </label>
              <input
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                New Password (min 6 characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-cyan-600 text-white font-semibold text-xs"
            >
              {loading ? 'Saving...' : 'Set New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
