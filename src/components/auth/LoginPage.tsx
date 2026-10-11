import React, { useState } from 'react';
import { useAuth, DEFAULT_VIP_USER } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { MascotBadge } from '../ui/MascotBadge';
import { EqualizerBars } from '../ui/EqualizerBars';
import {
  Zap,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  CreditCard,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, signup, quickVipLogin, requestPasswordReset } = useAuth();
  const { isSoundEnabled, toggleSound, playLaserSynth, playEdmDrop, showToast } = useFinance();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [budget, setBudget] = useState(10000);
  const [avatar, setAvatar] = useState('😎');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const avatarOptions = [
    { emoji: '😎', label: 'Mascot' },
    { emoji: '⚡', label: 'Volt' },
    { emoji: '🎧', label: 'DJ' },
    { emoji: '💎', label: 'Diamond' },
    { emoji: '🚀', label: 'Rocket' },
    { emoji: '👑', label: 'Royalty' },
  ];

  const handleInstantVip = () => {
    playEdmDrop();
    quickVipLogin('demo');
    showToast('VIP Access Granted', `Welcome to MintMate! Ready to drop financial moves.`, 'success');
    if (onSuccess) onSuccess();
  };

  const handlePresetSelect = (presetEmail: string, presetName?: string) => {
    playLaserSynth();
    setEmail(presetEmail);
    setPassword('••••••••');
    setErrorMsg(null);
    if (presetName) setName(presetName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await login(email, password, rememberMe);
        if (res.success) {
          playLaserSynth();
          showToast('Welcome to MintMate', 'Authenticated successfully! Initializing EDM soundstage...', 'success');
          if (onSuccess) onSuccess();
        } else {
          setErrorMsg(res.error || 'Authentication failed');
        }
      } else {
        const res = await signup({
          name,
          email,
          password,
          budget,
          avatar,
        });
        if (res.success) {
          playEdmDrop();
          showToast('Account Created!', `Welcome to the stage, ${name}! ₹${budget.toLocaleString('en-IN')} budget active.`, 'success');
          if (onSuccess) onSuccess();
        } else {
          setErrorMsg(res.error || 'Registration failed');
        }
      }
    } catch {
      setErrorMsg('An unexpected error occurred during authorization');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    const res = await requestPasswordReset(forgotEmail);
    setForgotLoading(false);
    if (res.success) {
      playLaserSynth();
      setForgotSent(true);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#00f59b] selection:text-black">
      {/* Background EDM ambient light cones & laser grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Neon green flare */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#00f59b]/15 blur-[120px]" />
        {/* Neon purple rave dome */}
        <div className="absolute top-1/4 -right-24 w-[32rem] h-[32rem] rounded-full bg-[#a855f7]/15 blur-[140px]" />
        {/* Cyber cyan bottom pulse */}
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-[#06b6d4]/15 blur-[130px]" />

        {/* Retro perspective floor grid lines */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(#00f59b 1px, transparent 1px), linear-gradient(90deg, #00f59b 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top Bar Header */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-[#141d2f]/80 bg-[#070b14]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0f241a] border border-[#00f59b]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,155,0.3)]">
            <MascotBadge size="sm" />
          </div>
          <div>
            <div className="font-heading font-black text-base tracking-wider text-[#00f59b] flex items-center gap-1.5">
              <span>MINTMATE</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#10241b] border border-[#00f59b]/30 text-[#00f59b]">
                CYBERSTAGE
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">Your Money · Your Moves</p>
          </div>
        </div>

        {/* EDM Sound FX Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              toggleSound();
              playLaserSynth();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              isSoundEnabled
                ? 'bg-[#181130] border-[#7c3aed]/50 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                : 'bg-[#0f1626] border-[#1d273c] text-gray-400'
            }`}
            title={isSoundEnabled ? 'EDM Audio FX: Enabled' : 'EDM Audio FX: Muted'}
          >
            {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-purple-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">128 BPM FX</span>
            {isSoundEnabled && <EqualizerBars isPlaying={true} />}
          </button>
        </div>
      </header>

      {/* Center Stage Authentication Portal */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">
          {/* Main Card with laser glow container */}
          <div className="relative rounded-3xl bg-[#0b101d]/90 border border-[#1e2a42] p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            {/* Top DJ lightbar border */}
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#00f59b] to-transparent shadow-[0_0_10px_#00f59b]" />

            {/* Stage Title */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121c2d] border border-[#21314e] text-xs font-semibold text-cyan-300 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00f59b]" />
                <span>FINANCIAL ACCESS TERMINAL</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
                Enter The <span className="text-[#00f59b]">Main Character</span> Era
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Log in to control your ₹10,000 monthly cashflow and live purchase simulations.
              </p>
            </div>

            {/* Instant VIP One-Click Pass Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleInstantVip}
                className="w-full group relative overflow-hidden rounded-2xl p-[1.5px] focus:outline-none cursor-pointer transition-transform active:scale-[0.99]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00f59b] via-[#06b6d4] to-[#a855f7] animate-pulse" />
                <div className="relative rounded-2xl bg-[#0d1424] hover:bg-[#10192e] transition-colors p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f59b] to-[#06b6d4] text-black flex items-center justify-center font-black shadow-lg">
                      <Zap className="w-5 h-5 fill-black" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-white group-hover:text-[#00f59b] transition-colors">
                        <span>⚡ 1-Click VIP Demo Pass</span>
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Instant unlock · ₹10k Budget · Live internet product search
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#00f59b] group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-5">
              <div className="border-t border-[#1a2538] w-full" />
              <span className="bg-[#0b101d] px-3 text-[11px] font-mono text-gray-500 uppercase tracking-widest">
                OR SIGN IN MANUALLY
              </span>
              <div className="border-t border-[#1a2538] w-full" />
            </div>

            {/* Tab Selector: Sign In vs Sign Up */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#090d18] border border-[#1b253b] mb-5">
              <button
                type="button"
                onClick={() => {
                  playLaserSynth();
                  setMode('signin');
                  setErrorMsg(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-[#152033] text-[#00f59b] shadow-[0_0_12px_rgba(0,245,155,0.2)] border border-[#00f59b]/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  playLaserSynth();
                  setMode('signup');
                  setErrorMsg(null);
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#152033] text-[#a855f7] shadow-[0_0_12px_rgba(168,85,247,0.2)] border border-[#a855f7]/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Rave Pass
              </button>
            </div>

            {/* Error Message banner */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1.5">Your Name or DJ Handle</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. mint_user"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d17] border border-[#1e2a40] focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b] text-white text-sm outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mint_user@mintmate.app"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080d17] border border-[#1e2a40] focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b] text-white text-sm outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-300">Access Key / Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotModal(true);
                        setForgotEmail(email);
                      }}
                      className="text-[11px] text-[#00f59b] hover:underline cursor-pointer"
                    >
                      Forgot key?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 4 chars)"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#080d17] border border-[#1e2a40] focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b] text-white text-sm outline-none transition-all placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Sign Up extra fields: Starting Budget & Avatar */}
              {mode === 'signup' && (
                <>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-300">Monthly Budget (INR)</label>
                      <span className="text-xs font-black text-[#00f59b]">₹{budget.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {[5000, 10000, 15000, 25000].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudget(b)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                            budget === b
                              ? 'bg-[#00f59b]/20 border-[#00f59b] text-[#00f59b]'
                              : 'bg-[#0f1626] border-[#1d273c] text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          ₹{(b / 1000).toFixed(0)}k
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">Choose Avatar Icon</label>
                    <div className="flex items-center gap-2">
                      {avatarOptions.map((opt) => (
                        <button
                          key={opt.emoji}
                          type="button"
                          onClick={() => setAvatar(opt.emoji)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                            avatar === opt.emoji
                              ? 'bg-purple-600/30 border-2 border-purple-400 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                              : 'bg-[#0f1626] border border-[#1d273c] hover:bg-[#162035]'
                          }`}
                        >
                          {opt.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Remember Me toggle (Sign In mode) */}
              {mode === 'signin' && (
                <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#1e2a40] bg-[#080d17] text-[#00f59b] focus:ring-0 focus:ring-offset-0"
                    />
                    <span>Remember this session</span>
                  </label>

                  <span className="text-[11px] text-gray-500">Auto-saved to device</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-2xl bg-[#00f59b] hover:bg-[#10b981] disabled:opacity-50 text-black font-extrabold text-sm tracking-wide shadow-[0_0_25px_rgba(0,245,155,0.4)] transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>SYNCHRONIZING TERMINAL...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black stroke-black" />
                    <span>{mode === 'signin' ? 'ENTER MINTMATE STAGE' : 'ACTIVATE RAVE PASS'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Footer Pills */}
            <div className="mt-6 pt-4 border-t border-[#182338]">
              <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2 flex items-center justify-between">
                <span>QUICK TEST PRESETS</span>
                <span className="text-[#00f59b]">TAP TO FILL</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('mint_user@mintmate.app', 'mint_user')}
                  className="px-2.5 py-1 rounded-xl bg-[#101726] hover:bg-[#172338] border border-[#202d44] hover:border-[#00f59b]/50 text-[11px] text-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f59b]" />
                  <span>VIP Member (mint_user)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('dj_cyber@mintmate.club', 'DJ Cyber')}
                  className="px-2.5 py-1 rounded-xl bg-[#101726] hover:bg-[#172338] border border-[#202d44] hover:border-[#a855f7]/50 text-[11px] text-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />
                  <span>DJ Cyber (₹15k)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('guest@mintmate.app', 'Guest')}
                  className="px-2.5 py-1 rounded-xl bg-[#101726] hover:bg-[#172338] border border-[#202d44] hover:border-cyan-400/50 text-[11px] text-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>Guest Explorer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Cyberpunk Trust badges below card */}
          <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Offline-First Safe</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Live Market Grounding</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-cyan-400" />
              <span>EDM Synthesizer</span>
            </span>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#0e1424] border border-[#243352] p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotSent(false);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
              <HelpCircle className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold font-heading text-white">Reset Terminal Access Key</h3>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              Enter your registered email address to receive an instant access recovery link.
            </p>

            {forgotSent ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#00f59b] mx-auto" />
                <div className="font-bold">Recovery Dispatch Sent!</div>
                <p className="text-gray-300 text-[11px]">
                  Magic login link dispatched for <span className="text-white font-mono">{forgotEmail}</span>. Or use the 1-Click VIP Pass to log in instantly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                    handleInstantVip();
                  }}
                  className="w-full py-2 rounded-xl bg-[#00f59b] text-black font-bold text-xs"
                >
                  ⚡ Instant Unlock With VIP Pass
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080d17] border border-[#1e2a40] focus:border-cyan-400 text-white text-xs outline-none"
                />
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs tracking-wider transition-all cursor-pointer"
                >
                  {forgotLoading ? 'TRANSMITTING RECOVERY...' : 'DISPATCH RECOVERY CODE'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center text-xs text-gray-500 border-t border-[#141d2f]/60 bg-[#070b14]/50">
        <span>MINTMATE CYBERSTAGE v2.4</span> · <span>GEN-Z PERSONAL FINANCE SIMULATOR</span>
      </footer>
    </div>
  );
};
