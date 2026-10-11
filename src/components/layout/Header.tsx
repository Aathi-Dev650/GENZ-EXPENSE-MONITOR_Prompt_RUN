import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
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
} from 'lucide-react';
import { DayPickerModal } from './DayPickerModal';
import { EqualizerBars } from '../ui/EqualizerBars';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenQuickSimModal?: () => void;
  onSelectNav?: (tabId: string) => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenQuickSimModal,
  onSelectNav,
  onOpenSettings,
}) => {
  const { state, resetToDemoData, isSoundEnabled, toggleSound, playLaserSynth } = useFinance();
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <header className="w-full pt-4 pb-3.5 px-4 lg:px-8 border-b border-[#182032]/80 bg-[#080c14]/85 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Greeting with electrified neon accent */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight font-heading flex items-center gap-2">
                Hey, money <span className="text-[#a855f7] drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]">main character</span>
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

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-0.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-pink-500 to-cyan-400 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-[#0a0e18] flex items-center justify-center text-xs font-bold text-white">
                  A
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <DayPickerModal isOpen={showDayPicker} onClose={() => setShowDayPicker(false)} />
    </>
  );
};
