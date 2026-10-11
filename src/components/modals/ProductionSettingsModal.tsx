import React, { useState, useRef } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/format-currency';
import {
  Settings,
  X,
  Volume2,
  VolumeX,
  Download,
  Upload,
  FileSpreadsheet,
  Trash2,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { EqualizerBars } from '../ui/EqualizerBars';

interface ProductionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductionSettingsModal: React.FC<ProductionSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    state,
    updateBudgetSettings,
    isSoundEnabled,
    toggleSound,
    playEdmDrop,
    playLaserSynth,
    exportDataAsJson,
    exportTransactionsCsv,
    importDataFromJson,
    startCleanBudget,
    resetToDemoData,
  } = useFinance();

  const [budgetVal, setBudgetVal] = useState(state.startingBudget.toString());
  const [reserveVal, setReserveVal] = useState(state.emergencyReserve.toString());
  const [cleanBudgetVal, setCleanBudgetVal] = useState('15000');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const b = parseFloat(budgetVal);
    const r = parseFloat(reserveVal);
    if (!isNaN(b) && b > 0) {
      updateBudgetSettings(b, isNaN(r) ? 500 : r);
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataFromJson(content);
        if (success) onClose();
      }
    };
    reader.readAsText(file);
  };

  const handleStartFresh = () => {
    const b = parseFloat(cleanBudgetVal);
    if (!isNaN(b) && b > 0) {
      if (window.confirm('Start a 100% clean personal budget from Day 1? This clears current demo entries.')) {
        startCleanBudget(b);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#0e1422] border border-[#253554] rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-[#1b253d]/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00f59b] to-[#06b6d4] text-black flex items-center justify-center font-bold shadow-md">
            <Settings className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white font-heading tracking-tight flex items-center gap-2">
              <span>Budget & Production Hub</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#00f59b]/20 text-[#00f59b] border border-[#00f59b]/40">
                PROD-READY
              </span>
            </h3>
            <p className="text-xs text-gray-400">Configure parameters, backup data, or deploy your live budget</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1: EDM Sound System */}
          <div className="p-4 rounded-2xl bg-[#141b2e] border border-[#23314e] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>EDM Audio FX & Drop Synthesizer</span>
                  {isSoundEnabled && <EqualizerBars isPlaying={true} />}
                </div>
                <div className="text-[11px] text-gray-400">Web Audio synth chord feedback on moves</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSoundEnabled && (
                <button
                  type="button"
                  onClick={playEdmDrop}
                  className="px-2.5 py-1 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-[10px] font-black uppercase tracking-wider"
                >
                  Test Drop ⚡
                </button>
              )}
              <button
                type="button"
                onClick={toggleSound}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold border transition-all ${
                  isSoundEnabled
                    ? 'bg-[#00f59b]/20 border-[#00f59b] text-[#00f59b]'
                    : 'bg-[#1a2338] border-gray-700 text-gray-400'
                }`}
              >
                {isSoundEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Section 2: Active Starting Budget & Cushion */}
          <form onSubmit={handleSaveBudget} className="p-4 rounded-2xl bg-[#141b2e] border border-[#23314e] space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black tracking-wider uppercase text-gray-300 font-heading">
                Starting Budget & Reserve
              </h4>
              <span className="text-[10px] text-cyan-400 font-mono">Current: {formatINR(state.startingBudget)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-gray-400 font-semibold mb-1">
                  Starting 30-Day Budget (₹)
                </label>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={budgetVal}
                  onChange={(e) => setBudgetVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1b253d] border border-[#2b3c5e] text-white text-sm font-bold focus:border-[#00f59b] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-gray-400 font-semibold mb-1">
                  Emergency Reserve (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={reserveVal}
                  onChange={(e) => setReserveVal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1b253d] border border-[#2b3c5e] text-white text-sm font-bold focus:border-[#00f59b] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition-all"
            >
              Apply Budget Settings 🚀
            </button>
          </form>

          {/* Section 3: Data Export & Backup */}
          <div className="p-4 rounded-2xl bg-[#141b2e] border border-[#23314e] space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-gray-300 font-heading">
              Export & Backup Data
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={exportDataAsJson}
                className="p-3 rounded-xl bg-[#19243d] hover:bg-[#213052] border border-[#2a3c63] text-left flex items-center gap-3 transition-colors group"
              >
                <Download className="w-4 h-4 text-[#00f59b] group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-white">JSON Backup</div>
                  <div className="text-[10px] text-gray-400">Save full state snapshot</div>
                </div>
              </button>

              <button
                onClick={exportTransactionsCsv}
                className="p-3 rounded-xl bg-[#19243d] hover:bg-[#213052] border border-[#2a3c63] text-left flex items-center gap-3 transition-colors group"
              >
                <FileSpreadsheet className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="text-xs font-bold text-white">Export CSV</div>
                  <div className="text-[10px] text-gray-400">Spreadsheet statement</div>
                </div>
              </button>
            </div>

            {/* Restore JSON input */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-xl bg-[#182035] hover:bg-[#202b47] border border-[#28385a] text-gray-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Restore Backup from .JSON File</span>
              </button>
            </div>
          </div>

          {/* Section 4: Live Deployment Options */}
          <div className="p-4 rounded-2xl bg-[#141b2e] border border-[#23314e] space-y-3">
            <h4 className="text-xs font-black tracking-wider uppercase text-gray-300 font-heading">
              Live Personal Budget Mode
            </h4>
            <p className="text-xs text-gray-400">
              Ready to use MintMate for real money? Wipe the demo and start from Day 1 with your own budget.
            </p>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={cleanBudgetVal}
                  onChange={(e) => setCleanBudgetVal(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#1b253d] border border-[#2b3c5e] text-white text-xs font-bold outline-none"
                  placeholder="Starting Budget"
                />
              </div>
              <button
                onClick={handleStartFresh}
                className="py-2 px-4 rounded-xl bg-[#00f59b] hover:bg-[#10b981] text-black font-extrabold text-xs shadow-md transition-all active:scale-95"
              >
                Start Fresh Budget
              </button>
            </div>

            <div className="pt-2 border-t border-[#1e2a44] flex items-center justify-between">
              <span className="text-[11px] text-gray-500">Need the original demo data back?</span>
              <button
                onClick={() => {
                  resetToDemoData();
                  onClose();
                }}
                className="text-xs text-purple-300 hover:text-purple-200 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Day 12 Demo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
