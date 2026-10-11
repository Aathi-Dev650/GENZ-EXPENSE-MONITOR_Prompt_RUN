import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Calendar, ChevronLeft, ChevronRight, X, Clock, Play } from 'lucide-react';

interface DayPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DayPickerModal: React.FC<DayPickerModalProps> = ({ isOpen, onClose }) => {
  const { state, setCurrentDay, metrics } = useFinance();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#111624] border border-[#232d42] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-xl bg-[#1a2236]/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-heading">30-Day Budget Timeline</h3>
            <p className="text-xs text-gray-400">Jump to any day to simulate month progression</p>
          </div>
        </div>

        {/* Current day indicator */}
        <div className="bg-[#182133] border border-[#232e48] rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 font-medium">Active Timeline Day</div>
            <div className="text-2xl font-black text-[#00f59b] font-heading mt-0.5">
              Day {state.currentDay} <span className="text-gray-400 text-sm font-normal">/ 30</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 font-medium">Days Remaining</div>
            <div className="text-lg font-bold text-white">
              {30 - state.currentDay} days
            </div>
            <div className="text-[11px] text-cyan-400 font-mono">
              ₹{metrics.safeDailyAllowance}/day safe
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Day 1 (Month Start)</span>
            <span className="text-cyan-400 font-semibold">Day {state.currentDay}</span>
            <span>Day 30 (Final Day)</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={state.currentDay}
            onChange={(e) => setCurrentDay(Number(e.target.value))}
            className="w-full h-2.5 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#00f59b]"
          />
          <div className="grid grid-cols-4 gap-2 pt-2">
            {[1, 12, 20, 28].map((day) => (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                  state.currentDay === day
                    ? 'bg-[#00f59b]/20 border-[#00f59b] text-[#00f59b]'
                    : 'bg-[#182133] border-[#222e44] text-gray-300 hover:border-gray-500'
                }`}
              >
                {day === 12 ? 'Day 12 (Demo)' : `Day ${day}`}
              </button>
            ))}
          </div>
        </div>

        {/* Stepper buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentDay(state.currentDay - 1)}
            disabled={state.currentDay <= 1}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#192236] border border-[#283550] text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-sm transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Day
          </button>
          <button
            onClick={() => setCurrentDay(state.currentDay + 1)}
            disabled={state.currentDay >= 30}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#00f59b]/20 border border-[#00f59b]/50 text-[#00f59b] hover:bg-[#00f59b]/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold text-sm transition-all"
          >
            Next Day <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
