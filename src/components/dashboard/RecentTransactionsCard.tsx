import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatINR } from '../../lib/format-currency';
import { ArrowUpRight } from 'lucide-react';

interface RecentTransactionsCardProps {
  onViewAll: () => void;
}

export const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({
  onViewAll,
}) => {
  const { state } = useFinance();
  const recent = state.transactions.slice(0, 4);

  const getBrandAvatar = (title: string, category: string) => {
    const t = title.toLowerCase();
    if (t.includes('netflix')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-black border border-red-600/40 flex items-center justify-center font-black text-red-600 text-xs shadow-sm">
          N
        </div>
      );
    }
    if (t.includes('zomato')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-[10px] tracking-tighter shadow-sm">
          zomato
        </div>
      );
    }
    if (t.includes('uber')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-black text-white border border-gray-700 flex items-center justify-center font-black text-[10px] tracking-tight shadow-sm">
          Uber
        </div>
      );
    }
    if (t.includes('starbucks')) {
      return (
        <div className="w-8 h-8 rounded-xl bg-[#006241] text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
          ☕
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-[#1b253b] text-gray-300 flex items-center justify-center text-xs font-bold">
        {title.charAt(0)}
      </div>
    );
  };

  return (
    <div className="rounded-[26px] bg-[#101625] border border-[#202c42] p-6 shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-xs font-black tracking-wider uppercase text-white font-heading">
          <span>RECENT TRANSACTIONS</span>
          <ArrowUpRight className="w-4 h-4 text-gray-400" />
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-gray-400 hover:text-white transition-colors"
        >
          View All
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {recent.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#151e33] transition-colors"
          >
            <div className="flex items-center gap-3">
              {getBrandAvatar(tx.title, tx.category)}
              <div>
                <div className="text-xs font-bold text-white tracking-tight">
                  {tx.title}
                </div>
                <div className="text-[11px] text-gray-400">
                  <span className="capitalize">{tx.category}</span>
                  <span className="mx-1 text-gray-600">·</span>
                  <span>{tx.dateStr}</span>
                </div>
              </div>
            </div>

            <div
              className={`text-xs font-black font-mono tracking-tight ${
                tx.type === 'income' ? 'text-[#00F59B]' : 'text-rose-400'
              }`}
            >
              {tx.type === 'income' ? '+' : '-'}
              {formatINR(tx.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
