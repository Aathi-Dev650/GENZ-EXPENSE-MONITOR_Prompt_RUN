import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ArrowUpRight, ShieldCheck, PiggyBank, CalendarCheck, AlertTriangle } from 'lucide-react';
import { MascotBadge } from '../ui/MascotBadge';

interface MoneyHealthSidebarCardProps {
  onViewDetails: () => void;
}

export const MoneyHealthSidebarCard: React.FC<MoneyHealthSidebarCardProps> = ({
  onViewDetails,
}) => {
  const { metrics } = useFinance();
  const { health } = metrics;

  // Calculate SVG circular stroke offset for radius = 42
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (health.overallScore / 100) * circumference;

  return (
    <div className="rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-white font-heading">
            <span>MONEY HEALTH</span>
            <ArrowUpRight className="w-4 h-4 text-gray-400" />
          </div>

          <button
            onClick={onViewDetails}
            className="w-7 h-7 rounded-xl bg-[#1a2338] hover:bg-[#25324d] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Circular Ring Gauge */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-[#19243a]"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Foreground glowing gradient ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="url(#healthGradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="healthGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00F59B" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white font-heading tracking-tight">
                {health.overallScore}
              </span>
              <span className="text-xs font-semibold text-gray-400">/ 100</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-3 px-4 py-1.5 rounded-full bg-[#00F59B] text-[#071F14] font-black text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(0,245,155,0.3)]">
            {health.statusLabel}
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="space-y-3 mt-6">
          {/* 1. Spending Control */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-300 font-medium">
              <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-[#00F59B] flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>Spending Control</span>
            </div>
            <span className="font-extrabold text-[#00F59B] font-mono">
              {health.spendingControl}
            </span>
          </div>

          {/* 2. Savings Progress */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-300 font-medium">
              <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <PiggyBank className="w-3.5 h-3.5" />
              </div>
              <span>Savings Progress</span>
            </div>
            <span className="font-extrabold text-amber-400 font-mono">
              {health.savingsProgress}
            </span>
          </div>

          {/* 3. Commitment Coverage */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-300 font-medium">
              <div className="w-5 h-5 rounded-md bg-purple-500/20 text-[#c084fc] flex items-center justify-center">
                <CalendarCheck className="w-3.5 h-3.5" />
              </div>
              <span>Commitment Coverage</span>
            </div>
            <span className="font-extrabold text-[#c084fc] font-mono">
              {health.commitmentCoverage}
            </span>
          </div>

          {/* 4. Risk Level */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-300 font-medium">
              <div className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
              <span>Risk Level</span>
            </div>
            <span className="font-extrabold text-rose-400 font-mono">
              {health.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Tip Bubble */}
      <div className="mt-6 p-3 rounded-2xl bg-[#141d30] border border-[#23314d] flex items-start gap-2.5">
        <div className="shrink-0 mt-0.5">
          <MascotBadge size="sm" />
        </div>
        <p className="text-xs text-gray-300 leading-snug">
          {health.recommendations[0]?.message ||
            "You're on track! A little less on dining out could boost your score to 85+."}
        </p>
      </div>
    </div>
  );
};
