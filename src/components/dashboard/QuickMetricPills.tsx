import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/format-currency';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { Coins, Target, CalendarDays, ArrowRight } from 'lucide-react';
import { NavTabId } from '../layout/Sidebar';

interface QuickMetricPillsProps {
  onNavigate: (tab: NavTabId) => void;
}

export const QuickMetricPills: React.FC<QuickMetricPillsProps> = ({ onNavigate }) => {
  const { metrics, state } = useFinance();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Safe Daily Spend */}
      <div
        onClick={() => onNavigate('simulator')}
        className="group relative overflow-hidden rounded-[22px] bg-[#0c1b29] border border-[#164361]/60 p-4 lg:p-5 flex items-center justify-between shadow-lg cursor-pointer hover:border-cyan-400/80 transition-all hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#06324a] text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold tracking-wider uppercase text-cyan-400 font-heading">
              SAFE DAILY SPEND
            </div>
            <div className="text-2xl font-black text-white font-heading mt-0.5">
              <AnimatedCounter value={metrics.safeDailyAllowance} isCurrency={true} />
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              per day for remaining {metrics.remainingDays} days
            </div>
          </div>
        </div>

        <div className="w-8 h-8 rounded-xl bg-[#143048] flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* 2. Savings Goal */}
      <div
        onClick={() => onNavigate('goals')}
        className="group relative overflow-hidden rounded-[22px] bg-[#1a122e] border border-[#3b2463]/60 p-4 lg:p-5 flex items-center justify-between shadow-lg cursor-pointer hover:border-purple-400/80 transition-all hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#2e1850] text-[#c084fc] border border-purple-500/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#c084fc] font-heading">
              SAVINGS GOAL
            </div>
            <div className="text-2xl font-black text-white font-heading mt-0.5">
              <AnimatedCounter value={metrics.primarySavingsGoal.percentage} suffix="%" />
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {formatINR(metrics.primarySavingsGoal.current)} of {formatINR(metrics.primarySavingsGoal.target)}
            </div>
          </div>
        </div>

        <div className="w-8 h-8 rounded-xl bg-[#2a1b49] flex items-center justify-center text-[#c084fc] group-hover:bg-[#c084fc] group-hover:text-black transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* 3. Commitments */}
      <div
        onClick={() => onNavigate('subscriptions')}
        className="group relative overflow-hidden rounded-[22px] bg-[#221c10] border border-[#544116]/60 p-4 lg:p-5 flex items-center justify-between shadow-lg cursor-pointer hover:border-amber-400/80 transition-all hover:-translate-y-0.5"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#3f3110] text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold tracking-wider uppercase text-amber-400 font-heading">
              COMMITMENTS
            </div>
            <div className="text-2xl font-black text-white font-heading mt-0.5">
              <AnimatedCounter value={metrics.unpaidCommitments} isCurrency={true} />
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              upcoming this month
            </div>
          </div>
        </div>

        <div className="w-8 h-8 rounded-xl bg-[#382b0e] flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-black transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
