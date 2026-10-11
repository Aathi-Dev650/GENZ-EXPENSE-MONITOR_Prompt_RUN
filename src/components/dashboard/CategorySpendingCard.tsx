import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/format-currency';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { NavTabId } from '../layout/Sidebar';

interface CategorySpendingCardProps {
  onNavigateToTransactions: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#10B981',
  Travel: '#06B6D4',
  Fun: '#F43F5E',
  Bills: '#F59E0B',
  Others: '#8B5CF6',
};

export const CategorySpendingCard: React.FC<CategorySpendingCardProps> = ({
  onNavigateToTransactions,
}) => {
  const { metrics } = useFinance();
  const { categoryBreakdown, totalExpenses } = metrics;

  const chartData = [
    { name: 'Food', value: categoryBreakdown.food?.amount || 850, color: '#10B981' },
    { name: 'Travel', value: categoryBreakdown.travel?.amount || 620, color: '#06B6D4' },
    { name: 'Fun', value: categoryBreakdown.fun?.amount || 420, color: '#F43F5E' },
    { name: 'Bills', value: categoryBreakdown.bills?.amount || 320, color: '#F59E0B' },
    { name: 'Others', value: categoryBreakdown.other?.amount || 140, color: '#8B5CF6' },
  ].filter((item) => item.value > 0);

  const categoryPills = [
    {
      id: 'food',
      name: 'Food',
      amount: categoryBreakdown.food?.amount || 850,
      pct: categoryBreakdown.food?.percentage || 36,
      icon: '🍔',
      bg: 'bg-[#0e241c]',
      border: 'border-[#1b4b39]',
      text: 'text-[#10B981]',
    },
    {
      id: 'travel',
      name: 'Travel',
      amount: categoryBreakdown.travel?.amount || 620,
      pct: categoryBreakdown.travel?.percentage || 26,
      icon: '✈️',
      bg: 'bg-[#0b212f]',
      border: 'border-[#144766]',
      text: 'text-[#06B6D4]',
    },
    {
      id: 'fun',
      name: 'Fun',
      amount: categoryBreakdown.fun?.amount || 420,
      pct: categoryBreakdown.fun?.percentage || 18,
      icon: '🎮',
      bg: 'bg-[#261225]',
      border: 'border-[#541f4f]',
      text: 'text-[#F43F5E]',
    },
    {
      id: 'bills',
      name: 'Bills',
      amount: categoryBreakdown.bills?.amount || 320,
      pct: categoryBreakdown.bills?.percentage || 14,
      icon: '🧾',
      bg: 'bg-[#241e12]',
      border: 'border-[#57441b]',
      text: 'text-[#F59E0B]',
    },
  ];

  return (
    <div className="rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-white font-heading">
          <span>SPENDING BY CATEGORY</span>
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </div>
        <button
          onClick={onNavigateToTransactions}
          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          Details <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: Donut Chart + Legend (5 cols) */}
        <div className="lg:col-span-5 flex items-center gap-4">
          <div className="relative w-32 h-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={56}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#101625" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-sm font-black text-white font-heading leading-tight">
                {formatINR(totalExpenses)}
              </span>
              <span className="text-[9px] text-gray-400 font-medium">spent so far</span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-1.5 text-xs flex-1">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-300 font-medium">{item.name}</span>
                </div>
                <div className="text-gray-400 font-mono text-[11px]">
                  {formatINR(item.value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 4 Category Mini Cards (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {categoryPills.map((pill) => (
            <div
              key={pill.id}
              onClick={onNavigateToTransactions}
              className={`p-3 rounded-2xl ${pill.bg} border ${pill.border} flex flex-col justify-between cursor-pointer hover:scale-[1.02] transition-all`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{pill.icon}</span>
                <span className={`text-[10px] font-bold ${pill.text}`}>
                  {pill.name}
                </span>
              </div>
              <div className="mt-3">
                <div className="text-sm font-black text-white font-heading">
                  {formatINR(pill.amount)}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {pill.pct}% of spend
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
