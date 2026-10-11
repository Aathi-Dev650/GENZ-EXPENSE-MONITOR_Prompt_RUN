import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/format-currency';
import {
  User,
  Sparkles,
  Edit3,
  BadgeCheck,
  RotateCcw,
  ShieldCheck,
  Wallet,
  Zap,
  Award,
  Calendar,
  CheckCircle2,
  Mail,
  Smile,
  Activity,
} from 'lucide-react';
import { MascotBadge } from '../ui/MascotBadge';
import { EqualizerBars } from '../ui/EqualizerBars';

interface ProfileViewProps {
  onOpenEditModal: () => void;
}

const AVATAR_OPTIONS = ['😎', '⚡', '🎧', '💎', '🚀', '👑', '🎯', '🔥', '💸', '👾', '🌟', '🦾'];

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenEditModal }) => {
  const { user, updateProfile } = useAuth();
  const { state, metrics, playLaserSynth, showToast } = useFinance();

  const [editingName, setEditingName] = useState(user?.name || 'mint_user');
  const [editingEmail, setEditingEmail] = useState(user?.email || 'mint_user@mintmate.app');
  const [editingAvatar, setEditingAvatar] = useState(user?.avatar || '😎');
  const [editingRole, setEditingRole] = useState(user?.role || 'VIP Money Master');
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  useEffect(() => {
    if (user) {
      setEditingName(user.name || 'mint_user');
      setEditingEmail(user.email || 'mint_user@mintmate.app');
      setEditingAvatar(user.avatar || '😎');
      setEditingRole(user.role || 'VIP Money Master');
    }
  }, [user]);

  const handleQuickSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = editingName.trim() || 'mint_user';

    updateProfile({
      name: cleanName,
      email: editingEmail.trim() || 'mint_user@mintmate.app',
      avatar: editingAvatar,
      role: editingRole.trim() || 'VIP Money Master',
    });

    playLaserSynth();
    setIsSavedRecently(true);
    showToast(
      'Profile Name Saved ✨',
      `Active account name set to "${cleanName}". Headers and dashboard updated!`,
      'success'
    );

    setTimeout(() => {
      setIsSavedRecently(false);
    }, 2000);
  };

  const handleResetToMintUser = () => {
    const defaultName = 'mint_user';
    const defaultEmail = 'mint_user@mintmate.app';
    const defaultAvatar = '😎';
    const defaultRole = 'VIP Money Master';

    setEditingName(defaultName);
    setEditingEmail(defaultEmail);
    setEditingAvatar(defaultAvatar);
    setEditingRole(defaultRole);

    updateProfile({
      name: defaultName,
      email: defaultEmail,
      avatar: defaultAvatar,
      role: defaultRole,
    });

    playLaserSynth();
    showToast('Reset to mint_user', 'Profile restored to general default name "mint_user"', 'info');
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Profile Header Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1322] via-[#10192e] to-[#18112c] border border-[#23314f] p-6 lg:p-8 shadow-2xl">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(#00f59b 1px, transparent 1px), linear-gradient(90deg, #00f59b 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar and Identity */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 via-pink-500 to-[#00f59b] p-1 shadow-[0_0_30px_rgba(0,245,155,0.3)]">
                <div className="w-full h-full rounded-[20px] bg-[#090d17] flex items-center justify-center text-4xl select-none">
                  {user?.avatar || '😎'}
                </div>
              </div>
              <button
                onClick={onOpenEditModal}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#00f59b] text-black hover:scale-110 transition-transform shadow-md cursor-pointer"
                title="Change Avatar & Info"
              >
                <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-black text-white font-heading">
                  {user?.name || 'mint_user'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#00f59b]/15 text-[#00f59b] border border-[#00f59b]/40 flex items-center gap-1">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>{user?.status || 'VIP RAVE PASS'}</span>
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-1 font-mono">
                {user?.email || 'mint_user@mintmate.app'} · Joined {user?.joinedAt || 'Day 1 of 30'}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {user?.role || 'VIP Money Master'}
                </span>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ₹{( (user?.budget || 10000) / 1000 ).toFixed(0)}k Budget Limit
                </span>
              </div>
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap self-stretch sm:self-auto">
            <button
              onClick={onOpenEditModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#00f59b] hover:bg-[#10b981] text-black font-extrabold text-xs shadow-[0_0_15px_rgba(0,245,155,0.35)] transition-all active:scale-95 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 stroke-[2.5]" />
              <span>Full Profile Editor</span>
            </button>

            <button
              onClick={handleResetToMintUser}
              className="px-3.5 py-2.5 rounded-2xl bg-[#141d30] hover:bg-[#1a263e] border border-[#23314f] text-gray-300 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset name to mint_user"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#00f59b]" />
              <span>Reset to mint_user</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Name Editor Form & Stats / Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Editable Profile Name Card (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#0c1220] border border-[#1f2b45] p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#18233a]">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#00f59b]" />
                <span>Edit Account Name & Details</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Change your user name anytime. Updates live across all views.
              </p>
            </div>
            <span className="text-[11px] text-[#00f59b] font-mono bg-[#00f59b]/10 px-2 py-0.5 rounded-md border border-[#00f59b]/20">
              Instant Sync
            </span>
          </div>

          <form onSubmit={handleQuickSave} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="text-xs font-bold text-gray-200 block mb-1.5">
                Display Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="mint_user"
                  maxLength={32}
                  className="w-full bg-[#131b2e] border border-[#26375a] focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 transition-all font-semibold"
                />
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400">
                <span>Default account name is <strong className="text-[#00f59b] font-mono">mint_user</strong></span>
                <span>{editingName.length}/32 chars</span>
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="text-xs font-bold text-gray-200 block mb-2">
                Profile Icon
              </label>
              <div className="grid grid-cols-6 sm:grid-cols-6 gap-2">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setEditingAvatar(emoji);
                      playLaserSynth();
                    }}
                    className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      editingAvatar === emoji
                        ? 'bg-[#00f59b]/25 border-2 border-[#00f59b] shadow-[0_0_12px_rgba(0,245,155,0.4)] scale-105'
                        : 'bg-[#131b2e] border border-[#202c46] hover:border-gray-500'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Email and Title row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs font-bold text-gray-200 block mb-1.5">
                  Email / Handle
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={editingEmail}
                    onChange={(e) => setEditingEmail(e.target.value)}
                    placeholder="mint_user@mintmate.app"
                    className="w-full bg-[#131b2e] border border-[#26375a] focus:border-[#00f59b] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-200 block mb-1.5">
                  VIP Title
                </label>
                <input
                  type="text"
                  value={editingRole}
                  onChange={(e) => setEditingRole(e.target.value)}
                  placeholder="VIP Money Master"
                  className="w-full bg-[#131b2e] border border-[#26375a] focus:border-[#00f59b] rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit button bar */}
            <div className="pt-3 flex items-center justify-between border-t border-[#18233a] mt-5">
              <button
                type="button"
                onClick={handleResetToMintUser}
                className="text-xs text-gray-400 hover:text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#00f59b]" />
                <span>Reset to mint_user</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00f59b] hover:bg-[#10b981] text-black font-extrabold text-xs shadow-[0_0_18px_rgba(0,245,155,0.4)] transition-all active:scale-95 cursor-pointer"
              >
                {isSavedRecently ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    <span>Saved to Profile!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 stroke-[3]" />
                    <span>Save Name & Info</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Terminal Identity & Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* VIP Pass Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#12192d] to-[#17132e] border border-[#2a3857] p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-300">
                VIP RAVE PASS ID
              </span>
              <span className="text-xs text-[#00f59b] font-mono font-bold">ACTIVE</span>
            </div>

            <div className="flex items-center gap-3.5 mb-4 p-3 rounded-2xl bg-[#090d18]/80 border border-[#22314f]">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-2xl font-bold shadow-md">
                {user?.avatar || '😎'}
              </div>
              <div>
                <div className="font-extrabold text-sm text-white">{user?.name || 'mint_user'}</div>
                <div className="text-[11px] text-gray-400 font-mono">{user?.email || 'mint_user@mintmate.app'}</div>
                <div className="text-[10px] text-purple-300 mt-0.5">{user?.role || 'VIP Money Master'}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#0f1628] border border-[#1d2943]">
                <div className="text-gray-400 text-[10px] font-medium">Starting Budget</div>
                <div className="text-sm font-extrabold text-[#00f59b] mt-0.5">
                  {formatINR(state.startingBudget)}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#0f1628] border border-[#1d2943]">
                <div className="text-gray-400 text-[10px] font-medium">Safe Daily BPM</div>
                <div className="text-sm font-extrabold text-cyan-300 mt-0.5">
                  {formatINR(metrics.safeDailyAllowance)}
                </div>
              </div>
            </div>
          </div>

          {/* Badges and Vibes */}
          <div className="rounded-3xl bg-[#0c1220] border border-[#1f2b45] p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Earned Member Badges</span>
              </h3>
              <span className="text-[10px] text-[#00f59b] font-bold">3 Unlocked</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#131b2e] border border-[#22314f] flex items-center gap-3">
                <span className="text-lg">⚡</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white text-[11px]">Real-Time Market Hunter</div>
                  <div className="text-[10px] text-gray-400">Live internet price comparison unlocked</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#131b2e] border border-[#22314f] flex items-center gap-3">
                <span className="text-lg">🎧</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white text-[11px]">BPM Spend Disciplinarian</div>
                  <div className="text-[10px] text-gray-400">Paced daily allowance tracker enabled</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-[#131b2e] border border-[#22314f] flex items-center gap-3">
                <span className="text-lg">👑</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white text-[11px]">Main Character Energy</div>
                  <div className="text-[10px] text-gray-400">Zero budget slip-ups on Day {state.currentDay}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
