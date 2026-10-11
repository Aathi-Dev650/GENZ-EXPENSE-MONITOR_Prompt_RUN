import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Search,
  Bell,
  Sparkles,
  RotateCcw,
  Plus,
  Zap,
  Settings,
  Volume2,
  VolumeX,
  User,
  Edit3,
} from 'lucide-react';
import { DayPickerModal } from './DayPickerModal';
import { EqualizerBars } from '../ui/EqualizerBars';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenQuickSimModal?: () => void;
  onSelectNav?: (tabId: string) => void;
  onOpenSettings?: () => void;
  onOpenEditProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenQuickSimModal,
  onSelectNav,
  onOpenSettings,
  onOpenEditProfile,
}) => {
  const { state, resetToDemoData, isSoundEnabled, toggleSound, playLaserSynth, showToast } = useFinance();
  const { user, updateProfile } = useAuth();
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleEditProfile = () => {
    setShowUserMenu(false);
    playLaserSynth();
    if (onOpenEditProfile) {
      onOpenEditProfile();
    } else if (onSelectNav) {
      onSelectNav('profile');
    }
  };

  const handleResetNameToMintUser = () => {
    setShowUserMenu(false);
    updateProfile({ name: 'mint_user' });
    playLaserSynth();
    showToast('Name Reset', 'Profile name reset to "mint_user"', 'info');
  };

  return (
    <>
      <header className="w-full pt-4 pb-3.5 px-4 lg:px-8 border-b border-[#182032]/80 bg-[#080c14]/85 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Greeting with electrified neon accent */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight font-heading flex items-center gap-2">
                Hey, <span className="text-[#a855f7] drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">{user?.name || 'mint_user'}</span>
                <span className="inline-block text-[#00f59b] animate-pulse">✨</span>
              </h1>
            </div>
            <p className="text-xs lg:text-sm text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="text-cyan-300 font-semibold">Day {state.currentDay} of 30</span>
              <span className="text-gray-600">·</span>
              <span>You've got this! Every rupee today builds a better tomorrow.</span>
              <span className="text-amber-400">✨</span>
            </p>
          </div>

          {/* Controls & Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Interactive Day Pill */}
            <button
              onClick={() => setShowDayPicker(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#101726] hover:bg-[#162238] border border-[#202c44] text-white text-xs font-semibold shadow-inner transition-all group cursor-pointer"
              title="Click to simulate timeline day (Day 1..30)"
            >
              <Calendar className="w-3.5 h-3.5 text-[#00f59b] group-hover:scale-110 transition-transform" />
              <span>
                Day <span className="text-[#00f59b] font-bold">{state.currentDay}</span> / 30
              </span>
            </button>

            {/* EDM Audio FX Equalizer Button */}
            <button
              onClick={() => {
                toggleSound();
                playLaserSynth();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                isSoundEnabled
                  ? 'bg-[#181130] border-[#582e91]/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                  : 'bg-[#101726] border-[#202c44] text-gray-400'
              }`}
              title={isSoundEnabled ? 'EDM Audio FX: Enabled' : 'EDM Audio FX: Muted'}
            >
              {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-purple-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">EDM FX</span>
              {isSoundEnabled && <EqualizerBars isPlaying={true} />}
            </button>

            {/* Quote Pill with DJ/Rave vibes */}
            <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#15122b] border border-[#3b2b5f] text-xs text-purple-200">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="italic font-medium">“Discipline now = freedom later.”</span>
              <span className="text-sm">🎧</span>
            </div>

            {/* Quick Add Expense */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#00f59b] hover:bg-[#10b981] text-black font-extrabold text-xs shadow-[0_0_18px_rgba(0,245,155,0.45)] transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Expense</span>
            </button>

            {/* Production Settings Hub */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-2xl bg-[#101726] hover:bg-[#1b263d] border border-[#202c44] text-gray-300 hover:text-white text-xs transition-all cursor-pointer"
                title="Budget Settings, Backup & Live Deployment"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Reset Demo button */}
            <button
              onClick={resetToDemoData}
              className="p-2 rounded-2xl bg-[#101726] hover:bg-[#1b263d] border border-[#202c44] text-gray-300 hover:text-white text-xs transition-all cursor-pointer"
              title="Reset Demo to Original Day 12 Seed State"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-2xl bg-[#101726] hover:bg-[#1b263d] border border-[#202c44] text-gray-300 hover:text-white transition-all relative cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#080c14]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-[#0e1422] border border-[#232e48] rounded-2xl p-3 shadow-2xl z-50">
                  <div className="text-xs font-bold text-white mb-2 px-1 flex items-center justify-between">
                    <span>Active Alerts</span>
                    <span className="text-[10px] text-[#00f59b] font-normal">3 active</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-[#151d2f] border border-[#22304d]">
                      <div className="font-semibold text-white">Commitment Due in 6 Days</div>
                      <div className="text-gray-400 text-[11px] mt-0.5">
                        Shared Flat Wi-Fi (₹850) is safely reserved.
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#151d2f] border border-[#22304d]">
                      <div className="font-semibold text-white">Safe Daily Spend Rhythm</div>
                      <div className="text-gray-400 text-[11px] mt-0.5">
                        Budget BPM is on track! Remaining allowance is healthy.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar with Dropdown */}
            <div className="relative pl-0.5">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 rounded-2xl hover:bg-[#152033] transition-colors cursor-pointer group"
                title={`${user?.name || 'mint_user'} (${user?.email || 'mint_user@mintmate.app'})`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-pink-500 to-cyan-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-[#0a0e18] flex items-center justify-center text-xs font-bold text-white">
                    {user?.avatar || (user?.name ? user.name.charAt(0).toUpperCase() : '😎')}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0e1424] border border-[#232e48] rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center gap-3 pb-3 mb-2 border-b border-[#1c273e]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00f59b] to-[#06b6d4] text-black font-black flex items-center justify-center text-lg shadow-md">
                      {user?.avatar || (user?.name ? user.name.charAt(0).toUpperCase() : '😎')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-white truncate">{user?.name || 'mint_user'}</div>
                      <div className="text-[11px] text-gray-400 truncate">{user?.email || 'mint_user@mintmate.app'}</div>
                      <div className="text-[10px] text-[#00f59b] font-mono mt-0.5">{user?.status || 'VIP RAVE PASS'}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <button
                      onClick={handleEditProfile}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#00f59b]/10 text-[#00f59b] hover:bg-[#00f59b]/20 font-bold transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Profile Name</span>
                      </div>
                      <span className="text-[10px] bg-[#00f59b]/20 px-1.5 py-0.5 rounded text-[#00f59b]">
                        Active
                      </span>
                    </button>

                    <button
                      onClick={handleResetNameToMintUser}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-[#162238] font-medium transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5 text-[#00f59b]" />
                        <span>Reset to mint_user</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <DayPickerModal isOpen={showDayPicker} onClose={() => setShowDayPicker(false)} />
    </>
  );
};
