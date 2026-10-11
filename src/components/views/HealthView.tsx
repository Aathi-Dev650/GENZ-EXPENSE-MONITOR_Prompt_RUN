import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Trophy,
  ShieldCheck,
  PiggyBank,
  CalendarCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Award,
  CheckCircle,
} from 'lucide-react';
import { MascotBadge } from '../ui/MascotBadge';

export const HealthView: React.FC = () => {
  const { metrics, state } = useFinance();
  const { health } = metrics;

  const achievements = [
    {
      id: 'ach-1',
      title: 'Main Character Solvency',
      desc: 'Kept available balance positive throughout Day 12',
      unlocked: true,
      icon: '👑',
    },
    {
      id: 'ach-2',
      title: 'Goal Stasher (₹2,200)',
      desc: 'Funded over 70% of your primary emergency cushion',
      unlocked: true,
      icon: '💰',
    },
    {
      id: 'ach-3',
      title: 'Simulation Strategist',
      desc: 'Simulate purchase consequences before buying',
      unlocked: true,
      icon: '⚡',
    },
    {
      id: 'ach-4',
      title: 'Commitment Crusher',
      desc: 'Cover 100% of upcoming rent, bills, and phone renewals',
      unlocked: metrics.unpaidCommitments > 0,
      icon: '🛡️',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-heading tracking-tight flex items-center gap-2">
            <span>Financial Wellness & Health Score</span>
            <span className="text-[#00F59B]">⚡</span>
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Transparent, rule-based wellness metrics calculated from your actual spending, runway, and commitments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-semibold">Overall Rating:</span>
          <span className="px-3.5 py-1 rounded-full bg-[#00F59B] text-[#071F14] text-xs font-black uppercase tracking-wider">
            {health.statusLabel} ({health.overallScore}/100)
          </span>
        </div>
      </div>

      {/* Hero Health Ring & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Overall Health Score Card (5 cols) */}
        <div className="lg:col-span-5 rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl flex flex-col items-center justify-center text-center">
          <div className="relative w-44 h-44 flex items-center justify-center my-4">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-[#19243a]"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#healthGradFull)"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - health.overallScore / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="healthGradFull" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#00F59B" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white font-heading tracking-tight">
                {health.overallScore}
              </span>
              <span className="text-xs font-bold text-gray-400 mt-0.5">SCORE / 100</span>
            </div>
          </div>

          <div className="mt-2">
            <h3 className="text-lg font-black text-white font-heading">
              {health.overallScore >= 80
                ? 'Strong Financial Solvency'
                : health.overallScore >= 70
                ? 'Healthy Spending Rhythm'
                : 'Plan Needs Tuning'}
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              Your safe daily spend of ₹{metrics.safeDailyAllowance}/day comfortably covers remaining days while
              protecting ₹{metrics.unpaidCommitments} in upcoming commitments.
            </p>
          </div>
        </div>

        {/* Right: 4 Pillar Progress Bars (7 cols) */}
        <div className="lg:col-span-7 rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl flex flex-col justify-between space-y-4">
          <h3 className="text-xs font-black tracking-wider uppercase text-gray-400 font-heading">
            SCORING FACTORS & PILLARS
          </h3>

          <div className="space-y-4">
            {/* 1. Spending Discipline */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-2 text-white">
                  <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
                  <span>Spending Discipline & Pacing</span>
                </span>
                <span className="font-mono text-[#00F59B]">{health.spendingControl} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-[#172238] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00F59B] rounded-full transition-all duration-700"
                  style={{ width: `${health.spendingControl}%` }}
                />
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Evaluates spend velocity relative to the 30-day timeline.
              </div>
            </div>

            {/* 2. Savings Progress */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-2 text-white">
                  <PiggyBank className="w-4 h-4 text-amber-400" />
                  <span>Emergency Reserve & Goal Funding</span>
                </span>
                <span className="font-mono text-amber-400">{health.savingsProgress} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-[#172238] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-700"
                  style={{ width: `${health.savingsProgress}%` }}
                />
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Measures funded safety cushion against unplanned life shocks.
              </div>
            </div>

            {/* 3. Commitment Coverage */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-2 text-white">
                  <CalendarCheck className="w-4 h-4 text-[#c084fc]" />
                  <span>Commitment & Bill Coverage</span>
                </span>
                <span className="font-mono text-[#c084fc]">{health.commitmentCoverage} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-[#172238] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c084fc] rounded-full transition-all duration-700"
                  style={{ width: `${health.commitmentCoverage}%` }}
                />
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Calculates coverage buffer for upcoming rent, Wi-Fi, and bills.
              </div>
            </div>

            {/* 4. Risk Level Score */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-2 text-white">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Cash Runway & Risk Safety Margin</span>
                </span>
                <span className="font-mono text-rose-400">{health.riskLevel} / 100</span>
              </div>
              <div className="w-full h-2.5 bg-[#172238] rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full transition-all duration-700"
                  style={{ width: `${health.riskLevel}%` }}
                />
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                Measures minimum daily burn safety without risking zero balance.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rule-Based Recommendations */}
      <div className="rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl">
        <h3 className="text-xs font-black tracking-wider uppercase text-gray-400 font-heading mb-4">
          DATA-GROUNDED ACTIONABLE INSIGHTS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {health.recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-2xl bg-[#141d30] border border-[#23314d] flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <MascotBadge size="sm" />
                <p className="text-xs text-gray-200 leading-relaxed font-medium">
                  {rec.message}
                </p>
              </div>

              {rec.actionLabel && (
                <div className="mt-3 pt-2 border-t border-[#1d2a44] text-[11px] text-[#00f59b] font-bold">
                  {rec.actionLabel} →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gen Z Badges & Achievements */}
      <div>
        <h3 className="text-xs font-black tracking-wider uppercase text-gray-400 font-heading mb-3">
          VIBE & DISCIPLINE BADGES
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all ${
                ach.unlocked
                  ? 'bg-[#151c2d] border-[#293b5e] shadow-md'
                  : 'bg-[#0f1422] border-[#1b253b] opacity-50'
              }`}
            >
              <div className="text-2xl mb-2">{ach.icon}</div>
              <h4 className="text-sm font-bold text-white tracking-tight">{ach.title}</h4>
              <p className="text-xs text-gray-400 mt-1 leading-snug">{ach.desc}</p>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-[#00f59b]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Unlocked</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
