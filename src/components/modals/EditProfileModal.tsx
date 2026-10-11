import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFinance } from '../../context/FinanceContext';
import {
  X,
  User,
  Mail,
  Wallet,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Shield,
  Smile,
  BadgeCheck,
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_PRESETS = ['😎', '⚡', '🎧', '💎', '🚀', '👑', '🎯', '🔥', '💸', '👾', '🌟', '🦾'];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth();
  const { playLaserSynth, playEdmDrop, showToast } = useFinance();

  const [name, setName] = useState('mint_user');
  const [email, setEmail] = useState('mint_user@mintmate.app');
  const [avatar, setAvatar] = useState('😎');
  const [role, setRole] = useState('VIP Money Master');
  const [budget, setBudget] = useState('10000');
  const [status, setStatus] = useState<'VIP RAVE PASS' | 'COMMUNITY' | 'PRO CREATOR'>('VIP RAVE PASS');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || 'mint_user');
      setEmail(user.email || 'mint_user@mintmate.app');
      setAvatar(user.avatar || '😎');
      setRole(user.role || 'VIP Money Master');
      setBudget(user.budget ? user.budget.toString() : '10000');
      setStatus(user.status || 'VIP RAVE PASS');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim() || 'mint_user';
    const parsedBudget = parseFloat(budget) || 10000;

    updateProfile({
      name: cleanName,
      email: email.trim() || `${cleanName.toLowerCase().replace(/\s+/g, '_')}@mintmate.app`,
      avatar,
      role: role.trim() || 'VIP Money Master',
      budget: parsedBudget,
      status,
    });

    playLaserSynth();
    setIsSaved(true);
    showToast(
      'Profile Updated ✨',
      `Your name is set to "${cleanName}". All moves & headers updated!`,
      'success'
    );

    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleResetToMintUser = () => {
    setName('mint_user');
    setEmail('mint_user@mintmate.app');
    setAvatar('😎');
    setRole('VIP Money Master');
    setBudget('10000');
    setStatus('VIP RAVE PASS');
    playLaserSynth();
    showToast('Reset to Default', 'Set name back to general "mint_user"', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0e1424] border border-[#23314f] rounded-3xl p-6 md:p-7 shadow-2xl overflow-y-auto max-h-[92vh] text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#1a253c] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00f59b]/20 to-purple-500/20 border border-[#00f59b]/40 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(0,245,155,0.2)]">
            {avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white font-heading">Edit Profile</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00f59b]/15 text-[#00f59b] border border-[#00f59b]/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Customize your user name, avatar, and financial handle.
            </p>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#12192d] via-[#101726] to-[#151c33] border border-[#223150] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-pink-500 to-cyan-400 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full rounded-2xl bg-[#0a0e18] flex items-center justify-center text-xl font-bold">
                {avatar}
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black text-white truncate font-heading">
                  {name || 'mint_user'}
                </span>
                <BadgeCheck className="w-4 h-4 text-[#00f59b] shrink-0" />
              </div>
              <div className="text-[11px] text-gray-400 truncate">{email}</div>
              <div className="text-[10px] text-cyan-300 font-mono mt-0.5 flex items-center gap-1">
                <span>{role}</span>
                <span>•</span>
                <span>₹{parseFloat(budget || '0').toLocaleString('en-IN')} Allowance</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetToMintUser}
            className="px-2.5 py-1.5 rounded-xl bg-[#172238] hover:bg-[#1e2d4a] text-[11px] font-bold text-gray-300 hover:text-white border border-[#2b3d63] flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            title="Reset name to mint_user"
          >
            <RotateCcw className="w-3 h-3 text-[#00f59b]" />
            <span>Default mint_user</span>
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Editable Name Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#00f59b]" />
                <span>Your Name / Handle</span>
              </label>
              <span className="text-[11px] text-gray-400">
                General default: <span className="text-[#00f59b] font-mono font-semibold">mint_user</span>
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="mint_user"
                maxLength={32}
                className="w-full bg-[#131b2e] border border-[#26375a] focus:border-[#00f59b] focus:ring-1 focus:ring-[#00f59b] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Avatar Preset Grid */}
          <div>
            <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5 mb-2">
              <Smile className="w-3.5 h-3.5 text-purple-400" />
              <span>Choose Your Avatar Emoji</span>
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_PRESETS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setAvatar(emoji);
                    playLaserSynth();
                  }}
                  className={`h-11 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                    avatar === emoji
                      ? 'bg-[#00f59b]/20 border-2 border-[#00f59b] shadow-[0_0_12px_rgba(0,245,155,0.4)] scale-105'
                      : 'bg-[#131b2e] border border-[#22304d] hover:border-gray-500 hover:bg-[#1a243d]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Email / ID */}
          <div>
            <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5 mb-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Email / Account Identifier</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mint_user@mintmate.app"
              className="w-full bg-[#131b2e] border border-[#26375a] focus:border-[#00f59b] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 transition-all font-medium"
            />
          </div>

          {/* Role and Budget Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5 mb-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Title / Role</span>
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="VIP Money Master"
                className="w-full bg-[#131b2e] border border-[#26375a] focus:border-[#00f59b] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-200 flex items-center gap-1.5 mb-1.5">
                <Wallet className="w-3.5 h-3.5 text-[#00f59b]" />
                <span>Monthly Budget (₹)</span>
              </label>
              <input
                type="number"
                min="1000"
                step="500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="10000"
                className="w-full bg-[#131b2e] border border-[#26375a] focus:border-[#00f59b] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 transition-all font-medium"
              />
            </div>
          </div>

          {/* Quick Buttons & Action Bar */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1e2a44] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-[#151e33] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaved}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00f59b] hover:bg-[#10b981] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(0,245,155,0.4)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
