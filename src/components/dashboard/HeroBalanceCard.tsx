import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/format-currency';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { ArrowUpRight, Plus, Zap } from 'lucide-react';
import { MascotBadge } from '../ui/MascotBadge';

interface HeroBalanceCardProps {
  onAddExpense: () => void;
  onSimulate: () => void;
  onAddIncome: () => void;
}

export const HeroBalanceCard: React.FC<HeroBalanceCardProps> = ({
  onAddExpense,
  onSimulate,
}) => {
  const { metrics, state } = useFinance();

  const spentFraction = Math.min(
    1,
    metrics.totalExpenses / Math.max(1, state.startingBudget + metrics.totalIncome)
  );
  const remainingFraction = Math.max(0, 1 - spentFraction);
  const remainingPercentage = (remainingFraction * 100).toFixed(1);

  return (
    <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-[#00F59B] via-[#05E08F] to-[#10B981] text-[#0A1A12] p-6 lg:p-7 shadow-[0_12px_40px_rgba(0,245,155,0.25)] border border-[#4EFCC0]/60 transition-transform duration-300">
      {/* Subtle retro tech grid background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#053d26 1px, transparent 1px), linear-gradient(90deg, #053d26 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main 2-Column Responsive Layout */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left Column: Financial Data */}
        <div className="flex-1 min-w-0 w-full">
          {/* Header label */}
          <div className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-[#063b24] mb-1.5">
            <span>YOUR MONEY RIGHT NOW</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Big Balance Number */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-[#071F14] font-heading leading-none">
              <AnimatedCounter value={metrics.remainingBalance} isCurrency={true} />
            </h2>
            <span className="text-base lg:text-lg font-bold text-[#0A3D26]">
              of {formatINR(state.startingBudget)} budget
            </span>
          </div>

          {/* Progress Bar + Percentage in one neat row */}
          <div className="flex items-center gap-3 my-4 max-w-md">
            <div className="flex-1 h-3.5 bg-[#083621]/30 rounded-full p-0.5 border border-[#09472d]/40 overflow-hidden">
              <div
                className="h-full bg-[#082b1b] rounded-full transition-all duration-700 ease-out shadow-inner"
                style={{ width: `${Math.min(100, Math.max(5, remainingFraction * 100))}%` }}
              />
            </div>
            <span className="font-black font-mono text-sm text-[#082b1b] shrink-0">
              {remainingPercentage}%
            </span>
          </div>

          {/* Motivational pill & Quick action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap pt-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#092e1e]/20 border border-[#083824]/30 text-xs font-bold text-[#052918]">
              <span>🔥</span>
              <span>You're keeping it cute. Keep going.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onAddExpense}
                className="px-3.5 py-1.5 rounded-xl bg-[#092619] hover:bg-[#071a11] text-[#00f59b] font-extrabold text-xs shadow-md transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Expense</span>
              </button>
              <button
                onClick={onSimulate}
                className="px-3.5 py-1.5 rounded-xl bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
                <span>Simulate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mascot & Floating Coins Cluster (Strictly Contained) */}
        <div className="relative shrink-0 flex flex-col items-center justify-center self-center sm:self-auto w-32 sm:w-36 pt-4 sm:pt-0">
          {/* Floating Gold Coin Stickers (Positioned securely relative to the mascot container) */}
          <div className="absolute -top-3 left-2 w-7 h-7 rounded-full bg-amber-300 border-2 border-[#092919] flex items-center justify-center font-black text-xs text-amber-950 shadow-md rotate-12 animate-pulse pointer-events-none">
            ₹
          </div>
          <div className="absolute top-2 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-[#092919] flex items-center justify-center font-black text-[10px] text-amber-950 shadow-sm -rotate-12 pointer-events-none">
            ₹
          </div>
          <div className="absolute -bottom-1 -left-2 w-5 h-5 rounded-full bg-amber-300 border border-[#092919] flex items-center justify-center font-black text-[9px] text-amber-950 shadow-sm rotate-45 pointer-events-none">
            ₹
          </div>

          {/* Mascot */}
          <div className="relative mb-2">
            <MascotBadge size="lg" />
          </div>

          {/* Speech / Status Badge */}
          <div className="px-3 py-1 rounded-xl bg-[#092116] border border-[#134932] text-[10px] font-black uppercase tracking-wider text-[#00F59B] shadow-xl text-center leading-tight whitespace-nowrap">
            MAIN CHARACTER<br />BUILDS BUDGETS
          </div>
        </div>
      </div>
    </div>
  );
};
